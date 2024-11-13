require('dotenv').config();
const { sendMessageToSQS } = require('../src/services/sqsService');

const queueUrl = process.env.SQS_QUEUE_URL;
const messageBody = JSON.stringify({
    bucketName: 'lambdatestaws',
    objectKey: 'test-file.txt',
    message: 'New file uploaded to s3'
});

sendMessageToSQS(queueUrl, messageBody)
  .then((data) => console.log('Mensaje enviado manualmente:', data))
  .catch((err) => console.error('Error enviando mensaje manual:', err));
