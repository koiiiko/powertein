const mysql = require('mysql2')

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

con.connect((err) => {
  if (err) {
    console.log('Connection failed:', err.message);
  } else {
    console.log('MySQL Connected');
  }
});

module.exports = { con };