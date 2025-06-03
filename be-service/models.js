//Create table schema
//execute node models.js
require('dotenv').config();
const { con } = require('./database');

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var usersSchema = "CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, gender ENUM('Laki-laki', 'Perempuan'), age INT, height INT, weight INT, activityLevel ENUM('aktivitasMinimal', 'aktivitasRendah', 'aktivitasSedang', 'aktivitasTinggi', 'aktivitasSangatTinggi'), protein INT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

  var articleSchema = "CREATE TABLE article (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, user_id INT NOT NULL, username VARCHAR(50) NOT NULL, image BLOB, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))";
  //add your create table schema here

  con.query(usersSchema, function (err, result) {
    if (err) throw err;
    console.log("Users table created");

    con.query(articleSchema, function (err, result) {
      if (err) throw err;
      console.log("Article table created");

      //add your create table schema here
    });
  });
});