const  {S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const s3Client = new S3Client({region:"us-east-2"})

const uploadFileToS3 = async (bucketName, fileName, fileContent) => {
    params = {
        Bucket : bucketName,
        Key : fileName,
        Body : fileContent
    }
    try{
        const data = await s3Client.send(new PutObjectCommand(params))
        console.log("Archivo subido correctamente:", data)
        return data
    }catch(err){
        console.error("Error:", err)
        throw err
    }
}
    const getFileFromS3 = async (bucketName, fileName) =>{
    const params = { 
        Bucket: bucketName,
        Key: fileName
    }    
        try{
            const data = await s3Client.send(new GetObjectCommand(params))
            console.log("Archivo obtenido:", data)
            return data
        }catch(err){
            console.error("Error:", err)
            throw err
        }
}

module.exports = {
    uploadFileToS3,
    getFileFromS3
}