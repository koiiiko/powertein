//Create table schema
//execute node models.js
require("dotenv").config();
const { con } = require("./database");

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var usersSchema =
    "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, gender ENUM('Laki-laki', 'Perempuan'), age INT, height INT, weight INT, activityLevel ENUM('aktivitasMinimal', 'aktivitasRendah', 'aktivitasSedang', 'aktivitasTinggi', 'aktivitasSangatTinggi'), protein INT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

  var articleSchema =
    "CREATE TABLE IF NOT EXISTS article (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, user_id INT NOT NULL, username VARCHAR(50) NOT NULL, image BLOB, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, like_count INT, dislike_count INT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))";

  var productSchema =
    "CREATE TABLE IF NOT EXISTS product (id INT PRIMARY KEY AUTO_INCREMENT, namaProduct VARCHAR(255) NOT NULL, image TEXT, harga VARCHAR(255), rating DECIMAL(3,1), deskripsi TEXT, kategori VARCHAR(50), tokopediaLink TEXT, reviewCount INT, brand VARCHAR(255), weight VARCHAR(50), flavors VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

  var foodSchema =
    "CREATE TABLE IF NOT EXISTS food_nutrition (id INT PRIMARY KEY AUTO_INCREMENT, namaMakanan VARCHAR(255) NOT NULL, protein FLOAT NOT NULL, created_at TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

  var userConsume =
    "CREATE TABLE IF NOT EXISTS user_consume (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, namaMakanan VARCHAR(255), protein FLOAT, jumlahPorsi INT, date DATE, FOREIGN KEY (user_id) REFERENCES users(id))";

  con.query(usersSchema, function (err, result) {
    if (err) throw err;
    console.log("Users table created");

    con.query(articleSchema, function (err, result) {
      if (err) throw err;
      console.log("Article table created");
    });

    con.query(userConsume, function (err, result) {
      if (err) throw err;
      console.log("User Consume table created");
    });
  });

  con.query(productSchema, function (err, result) {
    if (err) throw err;
    console.log("Product table created");
  });

  con.query(foodSchema, function (err, result) {
    if (err) throw err;
    console.log("Food Nutrition table created");
  });

});