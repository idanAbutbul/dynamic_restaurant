const db = require('../db');

const tableModel = {
  // Method to update a table's position
  updateTable: (id, updatedData) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE tables SET x = ?, y = ? WHERE id = ?';
      db.query(sql, [updatedData.x, updatedData.y, id], (error, result) => {
        if (error) {
          console.error('Error updating table:', error);
          reject('Error updating table');
        } else {
          console.log('Table updated successfully');
          resolve(result);
        }
      });
    });
  },

  // Method to create a new table
  createTable: (tableData) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO tables (x, y, size, inside) VALUES (?, ?, ?, ?)';
      db.query(sql, [tableData.left, tableData.top, tableData.size, tableData.inside], (error, result) => {
        if (error) {
          console.error('Error creating table:', error);
          reject('Error creating table');
        } else {
          console.log('Table created successfully');
          resolve(result.insertId);
        }
      });
    });
  },

  // Method to delete a table
  deleteTable: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tables WHERE id = ?';
      db.query(sql, [id], (error, result) => {
        if (error) {
          console.error('Error deleting table:', error);
          reject('Error deleting table');
        } else {
          console.log('Table deleted successfully');
          resolve(result);
        }
      });
    });
  },

  // Method to get all table positions
  getTablePositions: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.id, t.x, t.y, t.size, t.inside,
               CASE 
                 WHEN r.id IS NOT NULL 
                 AND r.date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL '1:30' HOUR_MINUTE)
                 THEN 1 ELSE 0 
               END AS reserved
        FROM tables t
        LEFT JOIN reservations r ON t.id = r.table_id AND r.date = CURDATE()
      `;
      db.query(sql, (error, results) => {
        if (error) {
          console.error('Error fetching table positions:', error);
          reject('Error fetching table positions');
        } else {
          const tables = results.map(table => ({
            id: table.id,
            left: table.x,
            top: table.y,
            size: table.size,
            inside: table.inside === 1,
            reserved: table.reserved === 1,
          }));
          resolve(tables);
        }
      });
    });
  },

  // Method to get available tables for a specific date and location
  getAvailableTables: (location, date) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.id, t.x, t.y, t.size, t.inside,
               CASE WHEN r.id IS NOT NULL 
               AND r.date BETWEEN DATE_SUB(?, INTERVAL '1:30' HOUR_MINUTE) 
               AND DATE_ADD(?, INTERVAL '1:30' HOUR_MINUTE)
               THEN 1 ELSE 0 END AS reserved
        FROM tables t
        LEFT JOIN reservations r ON t.id = r.table_id
        WHERE t.inside = ?
      `;
      db.query(sql, [date, date, location === 'inside'], (error, results) => {
        if (error) {
          console.error('Error fetching tables:', error);
          reject('Error fetching tables');
        } else {
          const tables = results.map(table => ({
            id: table.id,
            left: table.x,
            top: table.y,
            size: table.size,
            inside: table.inside === 1,
            reserved: table.reserved === 1,
          }));
          resolve(tables);
        }
      });
    });
  },

  // Method to create a reservation with time overlap check
  createReservation: ({ tableId, quantity, date, location, userId }) => {
    return new Promise((resolve, reject) => {
      // First, check if the table is already reserved for the same date and time (with 1.5-hour window)
      const checkOverlapSql = `
        SELECT * FROM reservations 
        WHERE table_id = ? 
        AND (date BETWEEN ? AND DATE_ADD(?, INTERVAL '1:30' HOUR_MINUTE)
        OR date BETWEEN DATE_SUB(?, INTERVAL '1:30' HOUR_MINUTE) AND ?)
      `;
      db.query(checkOverlapSql, [tableId, date, date, date, date], (error, results) => {
        if (error) {
          return reject('Error checking for overlapping reservations');
        }

        if (results.length > 0) {
          // If there's an overlapping reservation, reject the reservation
          return reject('The table is already reserved for this time period.');
        }

        // If no overlap, proceed to create the reservation
        const sql = 'INSERT INTO reservations (table_id, how_many, date, location, user_id) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [tableId, quantity, date, location, userId], (error, result) => {
          if (error) {
            return reject('Error creating reservation');
          }
          resolve(result);
        });
      });
    });
  },

  // Method to get reservations for a user
  getUserReservations: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.id as reservationId, t.id as tableId, t.x, t.y, t.size, t.inside, r.date, r.how_many
        FROM reservations r
        JOIN tables t ON r.table_id = t.id
        WHERE r.user_id = ?
      `;
      db.query(sql, [userId], (error, results) => {
        if (error) {
          console.error('Error fetching user reservations:', error);
          reject('Error fetching user reservations');
        } else {
          console.log('Fetched user reservations:', results);
          resolve(results);
        }
      });
    });
  },

  // Method to delete a reservation
  deleteReservation: (reservationId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM reservations WHERE id = ?';
      db.query(sql, [reservationId], (error, result) => {
        if (error) {
          console.error('Error deleting reservation:', error);
          reject('Error deleting reservation');
        } else {
          resolve(result);
        }
      });
    });
  }
};

module.exports = tableModel;
