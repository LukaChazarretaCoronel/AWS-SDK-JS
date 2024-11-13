const {RDSClient, DeleteDBSnapshotCommand} = require("@aws-sdk/client-rds")

const client = new RDSClient({region:"us-east-2"})

const params = {
    DBsnapshotIdentifier: "mydbinstance-snapshot"
}
const command = new DeleteDBSnapshotCommand(params)

const run = async() =>{
   try{
       const data = await send.client(command)
       console.log("Snapshot eliminado correctamente:", data)
   }catch(err){
       console.error("Error al eliminar el snapshot", err)
   }
} 
run()