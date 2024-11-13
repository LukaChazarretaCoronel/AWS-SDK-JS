require('dotenv').config();
const { receiveMessagesFromSQS } = require('../src/services/sqsService');

const queueUrl = process.env.SQS_QUEUE_URL;

receiveMessagesFromSQS(queueUrl)
  .then((messages) => {
    if (messages.length === 0) {
        console.log('No se encontraron mensajes en la cola.');
    } else {
        console.log('Mensajes recibidos:', messages);
    }
  })
  .catch((err) => console.error('Error recibiendo mensajes:', err));
