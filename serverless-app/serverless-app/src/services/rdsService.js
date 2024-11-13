const {RDSClient, CreateDBInstanceCommand, DeleteDBInstanceCommand, RestoreDBInstanceFromDBSnapshotCommand, DescribeDBInstancesCommand  } = require("@aws-sdk/client-rds")
const rdsClient = new RDSClient({region:"us-east-2"})

const createDBInstance = async (dbInstanceIdentifier, dbInstanceClass ) => { 
  const params = {
    DBInstanceIdentifier: dbInstanceIdentifier,
    DBInstanceClass: "db.t3.micro", // Clase actualizada
    Engine: "postgres", // Motor actualizado
    MasterUsername: "Luka",
    MasterUserPassword: "CopaAmerica2021",
    AllocatedStorage: 20, // Almacenamiento actualizado
    DBSubnetGroupName: "my-db-subnet-group",
    EngineVersion: "13.11", // Versión del motor actualizada
    LicenseModel: "postgresql-license" // Modelo de licencia
};
    try {
        const command = new CreateDBInstanceCommand(params);
        const response = await rdsClient.send(command);
        return response;
      } catch (error) {
        console.error("Error creating DB instance:", error);
        throw error;
      }
    };

  const deleteDbInstance = async (dbInstanceIdentifier, skipFinalSnapshot = true) => {
    const params = {
        DBInstanceIdentifier: dbInstanceIdentifier,
        SkipFinalSnapshot: skipFinalSnapshot,
        DeleteAutomatedBackups: true
    }

    try{
        const command = new DeleteDBInstanceCommand(params);
        const response = await rdsClient.send(command);
        console.log("Base de datos eliminada")
        return response;
    }catch(error){
        console.error("Error", error)
        throw error
    }
}
const restoreDBInstanceFromDBSnapshotCommand = async (dbInstanceIdentifier, dbSnapshotIdentifier) => {
    const params = {
        DBInstanceIdentifier: dbInstanceIdentifier,
        DBSnapshotIdentifier: dbSnapshotIdentifier
    }
    try{
        const command = new RestoreDBInstanceFromDBSnapshotCommand(params)
        const response = await rdsClient.send(command)
        return response
    }catch(err){
        console.error("Error:", err)
        throw err
    }
}
const describeDBInstance = async (dbInstanceIdentifier) => {
    const params = {
      DBInstanceIdentifier: dbInstanceIdentifier
    };
  
    try {
      const command = new DescribeDBInstancesCommand(params);
      const response = await rdsClient.send(command);
      return response.DBInstances[0];
    } catch (error) {
      console.error("Error describing DB instance:", error);
      throw error;
    }
  };
  
  const listDBInstances = async () => {
    try {
      const command = new DescribeDBInstancesCommand({});
      const response = await rdsClient.send(command);
      return response.DBInstances;
    } catch (error) {
      console.error("Error listing DB instances:", error);
      throw error;
    }
  };

module.exports = {
    createDBInstance,
    deleteDbInstance,
    restoreDBInstanceFromDBSnapshotCommand,
    describeDBInstance,
    listDBInstances
}