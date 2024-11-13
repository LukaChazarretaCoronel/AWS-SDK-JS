require('dotenv').config();
const { uploadFileToS3 } = require('../src/services/s3Service');

const bucketName = process.env.S3_BUCKET_NAME;
const fileName = 'test 26/10.txt';
const fileContent = 'Hour 11:21';

uploadFileToS3(bucketName, fileName, fileContent)
  .then((data) => console.log('Archivo subido:', data))
  .catch((err) => console.error('Error subiendo archivo:', err));