const bcrypt = require('bcryptjs');
const { con } = require('../../database');

class AuthModel {
  // Create new user for sign up
  static async createUser(username, email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if user already exists
        con.query(
          'SELECT id FROM users WHERE email = ? OR username = ?',
          [email, username],
          async (err, existingUser) => {
            if (err) return reject(err);

            if (existingUser.length > 0) {
              return reject(new Error('User already exists'));
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            con.query(
              'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
              [username, email, hashedPassword],
              (err, result) => {
                if (err) return reject(err);
                resolve({ userId: result.insertId });
              }
            );
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Find user by email or phone number for sign in
  static async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      con.query(
        'SELECT id, username, email, password FROM users WHERE email = ?',
        [email],
        (err, users) => {
          if (err) return reject(err);
          resolve(users.length > 0 ? users[0] : null);
        }
      );
    });
  }

  // Find user by ID
  static async findUserById(userId) {
    return new Promise((resolve, reject) => {
      con.query(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [userId],
        (err, users) => {
          if (err) return reject(err);
          resolve(users.length > 0 ? users[0] : null);
        }
      );
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = AuthModel;