//Create table schema
//execute node models.js
require('dotenv').config();
const { con } = require('./database');

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var usersSchema = "CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";
  //add your create table schema here
  con.query(usersSchema, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});