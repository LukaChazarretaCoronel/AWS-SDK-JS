const {RDSClient, ModifyDBInstances} = require("@aws-sdk/client-rds")

const params = {
    DBInstaceIdentifier:"mydbinstance2",
    AllocatedStorage:"30",
    DBInstaceClass: "db.r5.large",
    ApplyImmediately: true
}
const command = new ModifyDBInstances(params)

const run = async () =>{
    try{
        const data = await client.send(command)
        console.log("Instancia modificada:", data)
    }catch(err){
        console.error("Error al modificar la instancia:", err)
    }
}
run()