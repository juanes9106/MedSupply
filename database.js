const { Connection, Request, TYPES } = require('tedious');
require('dotenv').config();


// Configuración de la conexión
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true, // Para desarrollo; usar certificados en producción
  },
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USER, // Usa variables de entorno
      password: process.env.DB_PASSWORD,
    }
  }
};

// Conectar a la base de datos
function connectToDatabase(callback) {
  const connection = new Connection(config);

  console.log(`Connecting to database ${config.database} on server ${config.server}`);

  connection.on('connect', function(err) {
    if (err) {
      console.error('Error connecting to database: ', err);
      callback(err, null);
    } else {
      console.log('Connected to SQL Server...');
      callback(null, connection);
    }
  });

  connection.connect();
}

// Autenticar usuario
function authenticateUser(username, password, callback) {
  connectToDatabase((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    //console.log(`Authenticating user: ${username}`);

    const request = new Request(
      `SELECT * FROM dbo.Users WHERE username = @username AND pass = @pass`,
      (err, rowCount) => {
        if (err) {
          console.error('Error executing query: ', err);
          callback(err, null);
        } else {
          //console.log(`Query executed, row count: ${rowCount}`);
          callback(null, rowCount > 0);
        }
        connection.close(); // Cerramos la conexión después de ejecutar la consulta
      }
    );

    request.addParameter('username', TYPES.VarChar, username);
    request.addParameter('pass', TYPES.VarChar, password);

    connection.execSql(request);
  });
}

module.exports = { authenticateUser };
