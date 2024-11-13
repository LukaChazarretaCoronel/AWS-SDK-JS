const {SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand} = require("@aws-sdk/client-sqs")
const sqsClient = new SQSClient({region:"us-east-2"})

const sendMessageToSQS = async (queueUrl, messageBody) => {
    const params = {
        QueueUrl:queueUrl,
        MessageBody:messageBody
    }
    try {
        const data = await sqsClient.send(new SendMessageCommand(params))
        console.log("Mensaje enviado con SQS:", data)
        return data
    }catch(err){
        console.error(err)
        throw err
    }
}

const receiveMessagesFromSQS = async (queueUrl) => {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages:10,
        WaitTimeSeconds: 20
    }
    try{
        const data = await sqsClient.send(new ReceiveMessageCommand(params))
        console.log("Mensaje recibido desde SQS", data)
        return data.Messages || []
    }catch(err){
        console.error("Error receiving messages from SQS",err)
        throw err
    }


}

const deleteMessageFromSQS = async (queueUrl, receiptHandle) => {
    const params = {
        QueueUrl:queueUrl,
        ReceiptHandle: receiptHandle
    }
    try{
        const data  = await sqsClient.send(new DeleteMessageCommand(params))
        console.log("Mensaje borrado desde:", data)
        return data
    }catch(err){
        console.error("Error:",err)
        throw err
    }
}
module.exports = {
    sendMessageToSQS,
    receiveMessagesFromSQS,
    deleteMessageFromSQS
}