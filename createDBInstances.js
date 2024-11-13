const {RDSClient, CreateDBInstanceCommand } = require("@aws-sdk/client-rds")

const client = new RDSClient({ region: "us-east-2" });

const params = {
    DBInstanceIdentifier: "mydbinstance2",
    DBInstanceClass: "db.m5d.large",
    Engine: "postgres",
    MasterUsername: "Luka",
    MasterUserPassword: "CopaAmerica2021",
    AllocatedStorage: 25,
    DBSubnetGroupName: "my-db-subnet-group",
    EngineVersion: "16.3",
}
const command = new CreateDBInstanceCommand(params)
const run = async () =>{
    try{
    const data = await client.send(command)
    console.log("Base de datos creada:", data)
    }catch(err){
    console.error("Error", err)
    }
}
run()
