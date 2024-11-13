const {RDSClient, RestoreDBInstanceFromDBSnapshotCommand } = require("@aws-sdk/client-rds")

const client = new RDSClient({region:"us-east-2"})

const params = {
    DBInstanceIdentifier:"mydbinstance-restored",
    DBSnapshotIdentifier:"mydbinstance-snapshot"
}
const command = new RestoreDBInstanceFromDBSnapshotCommand(params)

const run = async()=>{
    try{
        const data = await client.send(command)
        console.log("Instancia restaurada desde snapshot:", data)
    }catch(err){
        console.error("Error al restaurar desde el snapshot", err)
    }
}