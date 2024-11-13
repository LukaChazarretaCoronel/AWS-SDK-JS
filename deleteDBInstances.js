const {RDSClient, DeleteDBInstanceCommand} = require("@aws-sdk/client-rds")

const client = new RDSClient({region: "us-east-2"})

const params = {
    DBInstanceIdentifier: "mydbinstance2",
    SkipFinalSnapshot: "true"
}
const command = new DeleteDBInstanceCommand(params)

const run = async () =>{
try{
    const data = await client.send(command)
    console.log("instancia eliminada:", data)
}catch(err){
    console.error("Error al eliminar la instancia:",err)
}
}
run()