const { Connection, Request, TYPES } = require('tedious');

const config = {
  server: "DESKTOP-0LC768E\\SQLEXPRESS",
  database: "MyDatabase",
  requestTimeout: 30000,
  connectionTimeout: 30000,
  options: {
    trustServerCertificate: true,
  },
  authentication: {
    type: "default",
    options: {
      userName: "juanes9106",
      password: "geminis9106",
    }
  }
};

function connectToDatabase(callback) {
  const connection = new Connection(config);

  connection.on('connect', function(err) {
    if (err) {
      console.log('Error: ', err);
      callback(err, null);
    } else {
      console.log('Connected to SQL Server...');
      callback(null, connection);
    }
  });

  connection.connect();
}

function authenticateUser(username, password, callback) {
  connectToDatabase((err, connection) => {
    if (err) {
      console.log('Error connecting to database: ', err);
      callback(err, null);
      return;
    }

    const request = new Request(
      `SELECT * FROM dbo.Users WHERE username = @username AND pass = @pass`,
      (err, rowCount) => {
        if (err) {
          console.log('Error executing query: ', err);
          callback(err, null);
        } else {
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
