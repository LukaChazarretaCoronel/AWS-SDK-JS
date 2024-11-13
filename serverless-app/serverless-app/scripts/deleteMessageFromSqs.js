require('dotenv').config();
const { deleteMessageFromSQS } = require('../src/services/sqsService');

const queueUrl = process.env.SQS_QUEUE_URL;
const receiptHandle =  'AQEBCLENIQthIr2QRr6NxKRvS5+NQFkIW6xAleHbTUhvFmqBaqg9Z0uTN59gcJ1aRK9Dj5hYCHBcD9Si7lVXeumoy6iREcHWLVe7NOAB2qB7ewTT1GHHfp+xaibYcycMlDxHCaCccM3xOMhhnK98kaWXlc/ld9aTSAA1uO2EMjeNnH/gGq2DIpxNX4JC+H/vPI92NYaM5J5Gq6w95DbwCvgSWRs71gIyq0LVBzxMTrLagir8+EllQq2hOsYrHiodFZb+XRG1ZJfWK5YqMyzjDZfUsfHCEX8KY6v0/HwL/RyXDH1ZGLcZY7Cpj6Nw0DkpAi4UrH3bAhg8zDjzDGcmUimuwRESLg/WKchXRfGdAYxVGduCmpd3scKb3HNZvOTWafqllnQTMiSfKv4b6M8Hm36+Al9kMbd0pVEsyzeLPl5kpoY='

deleteMessageFromSQS(queueUrl, receiptHandle)
  .then((data) => console.log('Mensaje borrado:', data))
  .catch((err) => console.error('Error borrando mensaje:', err));
