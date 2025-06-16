const { con } = require("../../database");

// Get food list based on search query
const getFoodListSearch = (search) => {
  return new Promise((resolve, reject) => {
    if (!search || search.length < 1) {
      return resolve([]);
    }

    const query = `
      SELECT namaMakanan, protein 
      FROM food_nutrition
      WHERE namaMakanan LIKE ?
      ORDER BY namaMakanan ASC
      LIMIT 10`;

    const searchParam = `${search}%`;

    con.query(query, [searchParam], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get protein level user
const getProteinUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT protein FROM users WHERE id = ?";
    con.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// Store user consume record
const storeConsumeRecord = (userId, nama_makanan, porsi, protein) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO user_consume (user_id, namaMakanan, protein, jumlahPorsi, date)
      VALUES (?, ?, ?, ?, NOW())
    `;
    con.query(query, [userId, nama_makanan, porsi, protein], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Delete record by id
const deleteConsumeRecord = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user_consume WHERE id = ?";
    con.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get user consume record for current day
const getUserConsumeToday = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, namaMakanan, jumlahPorsi, (protein * jumlahPorsi) AS totalProtein, date
      FROM user_consume 
      WHERE user_id = ? 
      AND DATE(date) = CURDATE()
    `;
    con.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get user consume record list based on user id
const getConsumeRecordByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT namaMakanan, jumlahPorsi, (protein * jumlahPorsi) AS totalProtein, date
      FROM user_consume 
      WHERE user_id = ?
      ORDER BY date DESC
    `;
    con.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get user consume record based period
const getConsumeRecordByPeriod = (userId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT (protein * jumlahPorsi) AS totalProtein, date
      FROM user_consume 
      WHERE user_id = ? 
      AND date BETWEEN ? AND ?
    `;
    con.query(query, [userId, startDate, endDate], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get user consume record based on timestamp
const getConsumeRecordByTimestamp = (userId, timestamp) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT namaMakanan, jumlahPorsi, (protein * jumlahPorsi) AS totalProtein, date
      FROM user_consume 
      WHERE user_id = ? 
      AND date = ?
    `;
    con.query(query, [userId, timestamp], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  getFoodListSearch,
  getProteinUser,
  storeConsumeRecord,
  getUserConsumeToday,
  getConsumeRecordByUserId,
  getConsumeRecordByPeriod,
  getConsumeRecordByTimestamp,
  deleteConsumeRecord,
};
