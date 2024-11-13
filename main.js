const { EC2Client, CreateSecurityGroupCommand, AuthorizeSecurityGroupIngressCommand, CreateInternetGatewayCommand, AttachInternetGatewayCommand, DescribeSecurityGroupsCommand, CreateRouteCommand, DescribeRouteTablesCommand, DescribeInternetGatewaysCommand } = require("@aws-sdk/client-ec2");
const { RDSClient, CreateDBInstanceCommand } = require("@aws-sdk/client-rds");
const { Client } = require("pg");

const REGION = "us-east-2";
const VPC_ID = "vpc-07d1f8abee333f1cd";
const SUBNET_GROUP = "my-db-subnet-group";

const ec2Client = new EC2Client({ region: REGION });
const rdsClient = new RDSClient({ region: REGION });

const getMainRouteTableId = async () => {
    try {
        const { RouteTables } = await ec2Client.send(new DescribeRouteTablesCommand({
            Filters: [
                { Name: "vpc-id", Values: [VPC_ID] },
                { Name: "association.main", Values: ["true"] }
            ]
        }));
        if (RouteTables.length === 0) {
            throw new Error("No main route table found for the specified VPC");
        }
        return RouteTables[0].RouteTableId;
    } catch (err) {
        console.error("Error getting main route table ID:", err);
        throw err;
    }

};

const updateRouteTable = async (internetGatewayId) => {
    try {
        const routeTableId = await getMainRouteTableId();
        const routeParams = {
            RouteTableId: routeTableId,
            DestinationCidrBlock: "0.0.0.0/0",
            GatewayId: internetGatewayId
        };
        await ec2Client.send(new CreateRouteCommand(routeParams));
        console.log("Route added for Internet traffic to route table:", routeTableId);
    } catch (err) {
        if (err.name === 'RouteAlreadyExists') {
            console.log("Route to Internet Gateway already exists in the route table.");
        } else {
            console.error("Error updating route table:", err);
            throw err;
        }
    }
};

const getOrCreateInternetGateway = async () => {
    try {
        const { InternetGateways } = await ec2Client.send(new DescribeInternetGatewaysCommand({
            Filters: [{ Name: "attachment.vpc-id", Values: [VPC_ID] }]
        }));

        if (InternetGateways.length > 0) {
            console.log("Internet Gateway already attached to VPC:", InternetGateways[0].InternetGatewayId);
            return InternetGateways[0].InternetGatewayId;
        }

        const { InternetGateway } = await ec2Client.send(new CreateInternetGatewayCommand({}));
        const igwId = InternetGateway.InternetGatewayId;
        console.log("New Internet Gateway created:", igwId);

        await ec2Client.send(new AttachInternetGatewayCommand({
            InternetGatewayId: igwId,
            VpcId: VPC_ID
        }));
        console.log("New Internet Gateway attached to VPC.");
        return igwId;
    } catch (err) {
        console.error("Error managing Internet Gateway:", err);
        throw err;
    }
};

const getOrCreateSecurityGroup = async () => {
    const sgName = "rds-postgresql-sg";
    try {
        const { SecurityGroups } = await ec2Client.send(new DescribeSecurityGroupsCommand({
            Filters: [
                { Name: "group-name", Values: [sgName] },
                { Name: "vpc-id", Values: [VPC_ID] }
            ]
        }));

        if (SecurityGroups.length > 0) {
            return SecurityGroups[0].GroupId;
        }

        const { GroupId } = await ec2Client.send(new CreateSecurityGroupCommand({
            Description: "Allow PostgreSQL access from any IP",
            GroupName: sgName,
            VpcId: VPC_ID
        }));

        await ec2Client.send(new AuthorizeSecurityGroupIngressCommand({
            GroupId,
            IpPermissions: [{
                IpProtocol: "tcp",
                FromPort: 5432,
                ToPort: 5432,
                IpRanges: [{ CidrIp: "0.0.0.0/0", Description: "Public access to PostgreSQL" }]
            }]
        }));

        console.log("Security group created and configured:", GroupId);
        return GroupId;
    } catch (err) {
        console.error("Error managing security group:", err);
        throw err;
    }
};

const createDBInstance = async (securityGroupId) => {
    const dbInstanceIdentifier = "my-public-db-instance";
    try {
        // Check if the DB instance already exists
        const { DBInstances } = await rdsClient.send(new DescribeDBInstancesCommand({
            DBInstanceIdentifier: dbInstanceIdentifier
        }));

        if (DBInstances && DBInstances.length > 0) {
            const existingInstance = DBInstances[0];
            console.log("DB instance already exists:", existingInstance.DBInstanceIdentifier);
            
            // Wait for the instance to become available
            return await waitForInstanceAvailability(existingInstance.DBInstanceIdentifier);
        }
    } catch (err) {
        if (err.name !== "DBInstanceNotFound") {
            console.error("Error describing DB instance:", err);
            throw err;
        }
        // If instance does not exist, proceed to create a new one
    }
    const params = {
        DBInstanceIdentifier: dbInstanceIdentifier,
        DBInstanceClass: "db.t3.micro",
        Engine: "postgres",
        MasterUsername: "Luka",
        MasterUserPassword: "CopaAmerica2021",
        AllocatedStorage: 20,
        VpcSecurityGroupIds: [securityGroupId],
        PubliclyAccessible: true,
        DBSubnetGroupName: SUBNET_GROUP,
        BackupRetentionPeriod: 7,
        MultiAZ: false,
        EngineVersion: "16.3",
        StorageType: "gp2",
    };
    
    try {
        const { DBInstance } = await rdsClient.send(new CreateDBInstanceCommand(params));
        console.log("Database instance created:", DBInstance.DBInstanceIdentifier);
        return await waitForInstanceAvailability(DBInstance.DBInstanceIdentifier);
    } catch (err) {
        console.error("Error creating database instance:", err);
        throw err;
    }
};

const connectToDB = async (host) => {
    const client = new Client({
        host,
        user: "Luka",
        password: "CopaAmerica2021",
        database: "postgres",
        port: 5432
    });

    try {
        await client.connect();
        console.log("Connected to database");
        const res = await client.query("SELECT NOW()");
        console.log("Query result:", res.rows[0]);
    } catch (err) {
        console.error("Error connecting to or querying database:", err);
    } finally {
        await client.end();
    }
};
const waitForInstanceAvailability = async (dbInstanceIdentifier) => {
    const maxRetries = 30;  // Poll for about 15 minutes, polling every 30 seconds
    const delayBetweenPolls = 30000;  // 30 seconds
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const { DBInstances } = await rdsClient.send(new DescribeDBInstancesCommand({
                DBInstanceIdentifier: dbInstanceIdentifier
            }));

            if (DBInstances && DBInstances.length > 0) {
                const dbInstance = DBInstances[0];
                if (dbInstance.DBInstanceStatus === "available") {
                    console.log("RDS instance is available");
                    return dbInstance.Endpoint.Address;  // Return the Endpoint Address
                } else {
                    console.log(`Waiting for DBInstance to become available... Current status: ${dbInstance.DBInstanceStatus}`);
                }
            }
        } catch (err) {
            console.error("Error describing DB instance:", err);
        }

        retries++;
        await new Promise(resolve => setTimeout(resolve, delayBetweenPolls));
    }

    throw new Error("DBInstance did not become available within the expected time.");
};

const run = async () => {
    try {
        const igwId = await getOrCreateInternetGateway();
        await updateRouteTable(igwId);
        const securityGroupId = await getOrCreateSecurityGroup();
        const dbEndpoint = await createDBInstance(securityGroupId);
        
        console.log("Waiting for RDS instance to be available...");
        await new Promise(resolve => setTimeout(resolve, 300000)); // Wait for 5 minutes

        await connectToDB(dbEndpoint);
    } catch (err) {
        console.error("Error during execution:", err);
    }
};

run();