## Overview

We need to make two sets of changes to the `thumbnail-microservice` repository:

1. **Lambda code** — add an SQS client and publish a message after thumbnails are created
2. **Terraform** — create the SQS queue, give Lambda permission to publish to it, and add the queue URL as an environment variable

## Lambda Code Changes

### 1. Add the SQS client

Open `src/lambda_function.py`. Find the S3 client at the top of the file and add the SQS client directly below it:

```python
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')  # add this line
```

### 2. Publish to SQS after thumbnails are created

Find the end of the `for` loop and the `return` statement below it. Add the `sqs_client.send_message` block between them:

```python
            thumbnails_created.append(thumbnail_key)
            print(f"Created thumbnail: {thumbnail_key}")

        # ADD THIS BLOCK — publish completion message to SQS
        sqs_client.send_message(
            QueueUrl=os.environ['SQS_QUEUE_URL'],
            MessageBody=json.dumps({
                'bucket': bucket,
                'original_key': key,
                'thumbnail_keys': {
                    size: key.replace('/original/', f'/thumbnails/{size}/')
                    for size in THUMBNAIL_SIZES
                }
            })
        )

        return {
            'statusCode': 200,
            ...
```

The Lambda publishes and moves on. It has no knowledge of who is listening or what they will do with the message.

## Terraform Changes

Open `terraform/main.tf`.

### 1. Add the SQS queue resource

Add this new resource anywhere in the file:

```hcl
resource "aws_sqs_queue" "thumbnail_complete" {
  name                      = "thumbnail-complete"
  message_retention_seconds = 86400  # 1 day
}
```

### 2. Add SQS permission to the existing policy

Find `aws_iam_role_policy.lambda_s3_policy`. It currently has two statement blocks (S3 access and CloudWatch logs). Add a third:

```hcl
resource "aws_iam_role_policy" "lambda_s3_policy" {
  name = "lambda-s3-access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject"]
        Resource = "${data.aws_s3_bucket.images.arn}/*"
      },
      {
        Effect = "Allow"
        Action = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      },
      # ADD THIS BLOCK
      {
        Effect   = "Allow"
        Action   = ["sqs:SendMessage"]
        Resource = aws_sqs_queue.thumbnail_complete.arn
      }
    ]
  })
}
```

### 3. Add SQS_QUEUE_URL to the Lambda environment variables

Find `aws_lambda_function.thumbnail_generator`. It already has an `environment` block — add `SQS_QUEUE_URL` to the existing `variables` map:

```hcl
  environment {
    variables = {
      THUMBNAIL_SIZES = "small,medium,large"
      SQS_QUEUE_URL   = aws_sqs_queue.thumbnail_complete.url  # add this line
    }
  }
```

### 4. Add outputs

Add these at the bottom of `main.tf` so the API Terraform can reference the queue:

```hcl
output "sqs_queue_url" {
  value = aws_sqs_queue.thumbnail_complete.url
}

output "sqs_queue_arn" {
  value = aws_sqs_queue.thumbnail_complete.arn
}
```

## Deploy

Push your changes to `main` to trigger the GitHub Actions workflow. Once complete, verify in the AWS console:

1. Navigate to **SQS** — confirm the `thumbnail-complete` queue was created
2. Navigate to **Lambda** → your function → **Configuration** → **Environment variables** — confirm `SQS_QUEUE_URL` is present
