const db = require('../db');

const userModel = {
  createUser: ({ email, password }) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, password], (error, results) => {
        if (error) {
          console.error("Create user error:", error);
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  },

  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], (error, results) => {
        if (error) {
          console.error("Find user error:", error);
          reject(error);
        } else {
          resolve(results[0]); // Assuming email is unique
        }
      });
    });
  },
};

module.exports = userModel;
