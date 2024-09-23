const db = require('../db');

const formModel = {
  saveForm: (formData) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO reservations (how_many, date, location, user_id) VALUES (?, ?, ?, ?)';
      const values = [formData.how_many, formData.date, formData.location, formData.userId];

      db.query(sql, values, (error, result) => {
        if (error) {
          console.error('Error inserting data:', error);
          reject(error);
        } else {
          console.log('Data inserted successfully');
          resolve(result);
        }
      });
    });
  }
};

module.exports = formModel;
