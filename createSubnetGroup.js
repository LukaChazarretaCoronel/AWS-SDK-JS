const {RDSClient, CreateDBSubnetGroupCommand} = require("@aws-sdk/client-rds")

const client = new RDSClient({ region: "us-east-2" });

const params = {
    DBSubnetGroupName: "my-db-subnet-group",
    DBSubnetGroupDescription: "My DB subnet group",
    SubnetIds: [
        "subnet-07a20a0e41f392a30",  // Subredes que pertenecen a la misma VPC
        "subnet-04f6751b81c8a3702"
    ],
    Tags: [
        {
            Key: "Name",
            Value: "MyDBSubnetGroup"
        }
    ]
};
const command = new CreateDBSubnetGroupCommand(params)

const run = async () =>{
    try{
        const data = await client.send(command)
        console.log("Creaste el subnet:",data)
    }catch(err){
        console.error("Error:", err)
    }
}
run()