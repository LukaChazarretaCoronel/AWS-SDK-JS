const {RDSClient, CreateDBSnapshotCommand} = require("@aws-sdk/client-rds")

const client = new RDSClient({region: "us-east-2"})

const params = {
    DBSnapshotIdentifier:"mydbinstance-snapshot",
    DBInstanceIdentifier:"mydbinstance2"
}
const command = new CreateDBSnapshotCommand(params)

const run = async () =>{
    try{
        const data = await client.send(command)
        console.log("snapshot creado:", data)
    }catch(err){
        console.error("Error al crear el snapshot:", error)
    }
}
run()