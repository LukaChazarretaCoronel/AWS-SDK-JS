const { sendMessageToSQS } = require("../src/services/sqsService");

exports.s3ToSQSHandler = async (event) => {
    console.log('Evento recibido:', JSON.stringify(event));

    try {
        const s3Event = event.Records[0].s3;
        const bucketName = s3Event.bucket.name;
        const objectKey = s3Event.object.key;
        console.log('Bucket:', bucketName, 'Objeto:', objectKey);

        const messageBody = JSON.stringify({
            bucketName: bucketName,
            objectKey: objectKey,
            message: 'New file uploaded to s3'
        });

        const queueUrl = process.env.SQS_QUEUE_URL;
        console.log('Enviando mensaje a SQS:', messageBody);

        await sendMessageToSQS(queueUrl, messageBody);
        console.log('Mensaje enviado a SQS exitosamente');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent to SQS successfully' })
        };
    } catch (error) {ñ
        console.error('Error en s3ToSQSHandler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing S3 event' })
        };
    }
};
