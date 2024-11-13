const { s3ToSQShandler } = require('../handler/s3ToSQShandler');  // Import the handler function
const { sendMessageToSQS } = require('../src/services/sqsService');

// Mock the sqsService module
jest.mock('../src/services/sqsService');

describe('s3ToSQShandler', () => {
    // Setup and teardown
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SQS_QUEUE_URL = 'https://sqs.test.url';
    });

    afterEach(() => {
        delete process.env.SQS_QUEUE_URL;
    });

    it('should successfully process S3 event and send message to SQS', async () => {
        const mockS3Event = {
            Records: [{
                s3: {
                    bucket: { name: 'test-bucket' },
                    object: { key: 'test-file.txt' }
                }
            }]
        };

        const expectedMessageBody = JSON.stringify({
            bucketName: 'test-bucket',
            objectKey: 'test-file.txt',
            message: 'New file uploaded to s3'
        });

        sendMessageToSQS.mockResolvedValueOnce({ MessageId: 'test-message-id' });

        const response = await s3ToSQShandler(mockS3Event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Message sent to SQS successfully'
        });
        expect(sendMessageToSQS).toHaveBeenCalledTimes(1);
        expect(sendMessageToSQS).toHaveBeenCalledWith(
            'https://sqs.test.url',
            expectedMessageBody
        );
    });

    it('should handle multiple S3 records correctly', async () => {
        // Arrange
        const mockS3Event = {
            Records: [{
                s3: {
                    bucket: { name: 'test-bucket' },
                    object: { key: 'test-file1.txt' }
                }
            }]
        };

        sendMessageToSQS.mockResolvedValueOnce({ MessageId: 'test-message-id' });

        // Act
        const response = await s3ToSQShandler(mockS3Event);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(sendMessageToSQS).toHaveBeenCalledTimes(1);
    });

    it('should handle SQS service errors gracefully', async () => {
        // Arrange
        const mockS3Event = {
            Records: [{
                s3: {
                    bucket: { name: 'test-bucket' },
                    object: { key: 'test-file.txt' }
                }
            }]
        };

        sendMessageToSQS.mockRejectedValueOnce(new Error('SQS service error'));

        // Act
        const response = await s3ToSQShandler(mockS3Event);

        // Assert
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Error processing S3 event'
        });
    });

    it('should handle missing environment variables', async () => {
        // Arrange
        delete process.env.SQS_QUEUE_URL;
        
        const mockS3Event = {
            Records: [{
                s3: {
                    bucket: { name: 'test-bucket' },
                    object: { key: 'test-file.txt' }
                }
            }]
        };

        // Act
        const response = await s3ToSQShandler(mockS3Event);

        // Assert
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Error processing S3 event'
        });
    });

    it('should handle malformed S3 events', async () => {
        // Arrange
        const malformedEvent = {
            Records: [{
                // Missing s3 property
            }]
        };

        // Act
        const response = await s3ToSQShandler(malformedEvent);

        // Assert
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Error processing S3 event'
        });
    });
});