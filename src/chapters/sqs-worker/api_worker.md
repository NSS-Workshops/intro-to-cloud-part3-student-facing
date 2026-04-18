## Overview

We need to make changes across three areas of the `rock-of-ages-api-with-ecs` repository:

1. **Worker code** — a service class that polls SQS and a script that starts it
2. **Terraform** — SQS variables, IAM permissions, worker task definition, and ECS service
3. **GitHub Actions** — pass the SQS values through to Terraform

## Worker Code

### `rockapi/services/sqs_service.py`

Create this new file:

```python
import json
import boto3
import os
from django.conf import settings
from rockapi.models import RockImage


class SqsService:
    def __init__(self):
        self.sqs = boto3.client('sqs', region_name=settings.AWS_REGION)
        self.queue_url = os.environ['SQS_QUEUE_URL']

    def start(self):
        print('Worker started, polling SQS...')
        while True:
            response = self.sqs.receive_message(
                QueueUrl=self.queue_url,
                MaxNumberOfMessages=10,
                WaitTimeSeconds=20
            )
            for message in response.get('Messages', []):
                self._process(message)

    def _process(self, message):
        body = json.loads(message['Body'])
        bucket = body['bucket']
        original_key = body['original_key']
        thumbnail_keys = body['thumbnail_keys']

        original_url = f"https://{bucket}.s3.amazonaws.com/{original_key}"

        try:
            image = RockImage.objects.get(original_url=original_url)
            image.thumbnail_small_url  = f"https://{bucket}.s3.amazonaws.com/{thumbnail_keys['small']}"
            image.thumbnail_medium_url = f"https://{bucket}.s3.amazonaws.com/{thumbnail_keys['medium']}"
            image.thumbnail_large_url  = f"https://{bucket}.s3.amazonaws.com/{thumbnail_keys['large']}"
            image.status = 'ready'
            image.save()
            print(f'Updated image {image.id} to ready')
        except RockImage.DoesNotExist:
            print(f'No RockImage found for {original_url}')

        self.sqs.delete_message(
            QueueUrl=self.queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )
```

### `worker.py`

Create this file at the project root alongside `manage.py`:

```python
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rockproject.settings')
django.setup()

from rockapi.services.sqs_service import SqsService

SqsService().start()
```

No new dependencies are needed — `boto3` is already available in the API container.

## Connecting the Two Repos

The SQS queue is created and owned by the `thumbnail-microservice` Terraform. But the API worker needs to know where the queue is — its URL to poll for messages, and its ARN so Terraform can grant the right IAM permissions.

These are two completely separate repositories with separate Terraform state. There's no automatic way for one to know about the other. The way we bridge them is straightforward: after the Lambda repo deploys the queue, we grab the queue's details from AWS and manually provide them to the API repo as GitHub secrets. The API's GitHub Actions workflow then passes them into Terraform as variables at deploy time.

This is a common real-world pattern — when infrastructure is split across multiple repos or teams, you share the connection values explicitly rather than letting one system reach into another's state.

### Step 1 — Get the SQS values from the AWS console

The `thumbnail-microservice` repo should already be deployed from the previous chapter. The SQS queue it created is now live in your AWS account.

1. Navigate to **SQS** in the AWS console
2. Click on the `thumbnail-complete` queue
3. From the queue detail page, copy two values:
   - The **URL** — shown under *Details*, looks like `https://sqs.us-east-2.amazonaws.com/123456789/thumbnail-complete`
   - The **ARN** — shown under *Details*, looks like `arn:aws:sqs:us-east-2:123456789:thumbnail-complete`

### Step 2 — Add them as GitHub secrets in the API repo

In your `rock-of-ages-api-with-ecs` repository, go to **Settings → Secrets and variables → Actions → New repository secret** and add both:

| Secret name | Value |
|---|---|
| `SQS_QUEUE_URL` | The URL you copied from the SQS console |
| `SQS_QUEUE_ARN` | The ARN you copied from the SQS console |

These secrets will be injected into the GitHub Actions workflow at deploy time and passed through to Terraform as variables — the same pattern already used for `DB_PASSWORD`.

## Terraform Changes

### 1. Add new variables to `terraform/variables.tf`

Add the following two variables to the bottom of the file:

```hcl
variable "sqs_queue_url" {
  description = "URL of the SQS queue for thumbnail completion messages"
  type        = string
}

variable "sqs_queue_arn" {
  description = "ARN of the SQS queue for thumbnail completion messages"
  type        = string
}
```

### 2. Add SQS permissions to `terraform/ecs.tf`

Find `aws_iam_role_policy.ecs_task_s3_policy`. It currently has one statement block. Add a second:

```hcl
resource "aws_iam_role_policy" "ecs_task_s3_policy" {
  name = "ecs-task-s3-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"]
        Resource = [
          "arn:aws:s3:::${var.image_storage_bucket}",
          "arn:aws:s3:::${var.image_storage_bucket}/*"
        ]
      },
      # ADD THIS BLOCK
      {
        Effect = "Allow"
        Action = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
        Resource = var.sqs_queue_arn
      }
    ]
  })
}
```

### 3. Add the worker task definition to `terraform/ecs.tf`

Add this after the existing `aws_ecs_task_definition.api` resource:

```hcl
resource "aws_ecs_task_definition" "worker" {
  family                   = "rock-of-ages-worker"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "worker"
      image     = "${aws_ecr_repository.api.repository_url}:latest"
      essential = true
      command   = ["pipenv", "run", "python", "worker.py"]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "worker"
        }
      }

      environment = [
        { name = "DB_HOST",                 value = aws_db_instance.rock_of_ages.address },
        { name = "DB_NAME",                 value = aws_db_instance.rock_of_ages.db_name },
        { name = "DB_USER",                 value = aws_db_instance.rock_of_ages.username },
        { name = "DB_PASSWORD",             value = var.db_password },
        { name = "AWS_STORAGE_BUCKET_NAME", value = var.image_storage_bucket },
        { name = "AWS_REGION",              value = var.aws_region },
        { name = "SQS_QUEUE_URL",           value = var.sqs_queue_url }
      ]
    }
  ])
}
```

### 4. Add the worker ECS service to `terraform/ecs.tf`

Add this after the existing `aws_ecs_service.api` resource:

```hcl
resource "aws_ecs_service" "worker" {
  name            = "rock-of-ages-worker-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  tags = {
    Name = "rock-of-ages-worker-service"
  }
}
```

## GitHub Actions Workflow

Open `.github/workflows/deploy.yml`. Find the `env` block in the `build-and-push` job and add the two new lines:

```yaml
env:
  TF_VAR_db_password: ${{ secrets.DB_PASSWORD }}
  TF_VAR_sqs_queue_url: ${{ secrets.SQS_QUEUE_URL }}  # add this
  TF_VAR_sqs_queue_arn: ${{ secrets.SQS_QUEUE_ARN }}  # add this
```

## Deploy

Push your changes to `main` to trigger the GitHub Actions workflow. Once the deploy completes:

1. In the AWS console, navigate to **ECS** and open your cluster
2. Confirm a new service named `rock-of-ages-worker-service` is running with 1 task
3. Open the running task and check its logs in **CloudWatch** — you should see `Worker started, polling SQS...`

## Test End to End

1. Navigate to your CloudFront URL and upload an image on a rock's detail page
2. Navigate to **My Rocks** and watch the status — it should update from **processing** to **ready** and the thumbnail should appear
3. If it doesn't update, check the worker logs in CloudWatch for errors
