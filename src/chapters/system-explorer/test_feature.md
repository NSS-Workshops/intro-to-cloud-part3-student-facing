## Try it Out

Everything is deployed. Let's see how the full system behaves end to end.

### Create a Rock

1. Go to the CloudFront dashboard in AWS and copy your CloudFront domain
2. Navigate to the URL in your browser (remember to use `http://` if prompted)
3. Log in and create a new rock using the form

### Upload an Image

1. Open the detail page for the rock you just created
2. Use the image upload button to attach a photo to your rock

### Check the My Rocks View

Navigate to the **My Rocks** view. You should see your new rock listed — and next to it, the image thumbnail is stuck in a **"processing"** state. It never updates.

Try refreshing the page. Still processing.

## What's Actually Happening

The upload itself is working. Here's the full sequence of events behind the scenes:

1. The client asks the Django API for a presigned S3 upload URL (a temporary, pre-authorized URL that allows the client to upload a file directly to S3 without needing AWS credentials)
2. The API creates a `RockImage` record in the database with a status of `processing` and returns that presigned URL to the client
3. The client uploads the image file directly to S3 using that URL — the API is not involved in the actual file transfer
4. S3 detects the new file and triggers the Lambda function
5. Lambda downloads the original, creates three thumbnail sizes (small, medium, large), and uploads them back to S3

And then Lambda exits — successfully — and nothing else happens.

**The API never finds out the thumbnails are ready.** Lambda and the Django API are two separate, isolated services with no connection between them. Nothing ever updates the `RockImage` record in the database, so it stays in `processing` forever.

This is the problem we're going to solve.
