# AWS Serverless Application

This is a serverless application built using AWS SAM, Node.js, and AWS SDK v3. It handles interactions between S3, SQS, and RDS, using various AWS Lambda functions.

## Project Structure

- **auth_handler.js**: Lambda function to handle authentication.
- **dbHandler.js**: Handles RDS instance creation, deletion, and listing.
- **s3ToSQSHandler.js**: Processes S3 events and sends messages to SQS.
- **rdsService.js**: Service to manage RDS operations using AWS SDK.
- **s3Service.js**: Service for uploading and retrieving files from S3.
- **sqsService.js**: Service for sending, receiving, and deleting messages in SQS.
- **template.yaml**: AWS SAM template for defining the serverless resources.

## Environment Variables

Ensure that you set the following environment variables for the application to function correctly:

- **SQS_QUEUE_URL**: The URL of your SQS queue.
- **S3_BUCKET_NAME**: The name of your S3 bucket.

## Usage

- **Upload a File to S3**: Use `uploadFile.js` to upload a file to S3.
- **Send and Receive SQS Messages**: Use `sendManualMessage.js` and `receiveMessages.js`.
- **Manage RDS Instances**: Use API endpoints to create, delete, or describe RDS instances.

## License

This project is licensed under the MIT License.

