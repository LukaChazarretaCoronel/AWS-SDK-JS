const { createDBInstance, deleteDbInstance, describeDBInstance, listDBInstances } = require("../src/services/rdsService");

exports.dbHandler = async (event) => {
    console.log('Evento recibido:', JSON.stringify(event)); // Log del evento recibido
    
    try {
        const method = event.httpMethod;
        const dbInstanceIdentifier = event.pathParameters?.dbInstanceIdentifier;
        const body = event.body ? JSON.parse(event.body) : null; // Verifica si el cuerpo no está vacío
        
        console.log('Método HTTP:', method);
        console.log('dbInstanceIdentifier:', dbInstanceIdentifier);
        console.log('Body:', body);

        switch (method) {
            case 'POST': {
                if (!body) {
                    console.log('Cuerpo de la solicitud vacío');
                    return {
                        statusCode: 400,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify({ message: "El cuerpo de la solicitud no puede estar vacío" })
                    };
                }

                const { dbInstanceClass, dbInstanceIdentifier } = body; // Desestructurar correctamente el cuerpo
                if (!dbInstanceClass || !dbInstanceIdentifier) {
                    console.log('Faltan parámetros:', { dbInstanceClass, dbInstanceIdentifier });
                    return {
                        statusCode: 400,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify({ message: "dbInstanceClass y dbInstanceIdentifier son requeridos" })
                    };
                }
                const response = await createDBInstance(dbInstanceIdentifier, dbInstanceClass);
                console.log('Respuesta de creación:', response);
                return {
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({ message: "Instancia de base de datos creada exitosamente", data: response })
                };
            }
            case 'DELETE': {
                 if (!dbInstanceIdentifier) { 
                    console.log('Falta dbInstanceIdentifier'); 
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, 
                        body: JSON.stringify({ message: "El identificador de la instancia es requerido" }) }; } 
                        const response = await deleteDbInstance(dbInstanceIdentifier); // Pasa correctamente el identificador 
                        console.log('Instancia eliminada:', dbInstanceIdentifier); 
                        return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, 
                        body: JSON.stringify({ message: "Instancia eliminada exitosamente" }) }; }
            case 'GET': {
                if (dbInstanceIdentifier) {
                    const instance = await describeDBInstance(dbInstanceIdentifier);
                    console.log('Descripción de la instancia:', instance);
                    return {
                        statusCode: 200,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify({ data: instance })
                    };
                }
                const instances = await listDBInstances();
                console.log('Listado de instancias:', instances);
                return {
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({ data: instances })
                };
            }
            default:
                console.log('Método no permitido:', method);
                return {
                    statusCode: 405,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({ message: "Método no permitido" })
                };
        }
    } catch (error) {
        console.error("Error en dbHandler:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ message: "Error interno del servidor", error: error.message })
        };
    }
};
