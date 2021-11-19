const mysql = require('mysql2');

// create the connection to database
module.exports.connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'reviews'
});

