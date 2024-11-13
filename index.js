const {Client}= require("pg")

const client = new Client(
    { host: "mydbinstance2.c3eeyc2go6gt.us-east-2.rds.amazonaws.com",
      user:"Luka",
      password:"CopaAmerica2021",
      database:"postgres",
      port:5432
    });

const run = async () =>{
    try{
        await client.connect()
        console.log("Conectado a la base de datos")
    
        const createTableQuery =`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMPT DEFAULT NOW()        
        )`
        await client.query(createTableQuery)
        console.log("Tabla 'users' creada exitosamente")
        const insertDataQuery = `
        INSER INTO users(name, email)
        VALUES 
        ('Jhon Doe', 'JhonDoe@example.com'),
        ('Jane Doe', 'JaneDoe@example.com')
        RETURNING *`
        const insertResult = await client.query(insertDataQuery)
        console.log('Datos insetados:', insertResult.rows)

        const selectQuery = (`SELECT * FROM users`)
        const selectResult = await client.query(selectQuery)
        console.log('Datos de la tabla users:', selectResult.rows)

        const updateDataQuery = `
        UPDATE users
        SET name = 'Jhonny Doe'
        WHERE email = 'JhonDoe@example.com'
        RETURNING *`
        const updateResult = await client.query(updateDataQuery)
        console.log("Datos actualizados:", updateResult.rows ) 

        const deleteDataQuery =`
        DELETE FROM users
        WHERE EMAIL = 'JhonDoe@example.com'
        RETURNING *
        `
        const deleteResult = await client.query(deleteDataQuery)
        console.log("Datos eliminados:", deleteResult.rows)

    }catch(err){
        console.error("Error durante la ejecucion de las operaciones:", err)
    }finally{
        await client.end()
        console.log('Desconectado de la base de datos')
    }
}
run()