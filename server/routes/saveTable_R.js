const express = require('express');
const router = express.Router();
const tableModel = require('../models/saveTable_M');
const db = require('../db');  // Ensure db is imported

// Endpoint to update a table's position
router.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { left, top } = req.body;
    const updatedTableData = { x: left, y: top };
    await tableModel.updateTable(id, updatedTableData);
    res.status(200).json({ message: 'Table updated successfully' });
  } catch (error) {
    console.error('Failed to update table:', error);
    res.status(500).json({ error: 'Failed to update table' });
  }
});

// Endpoint to delete a table
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await tableModel.deleteTable(id);
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Failed to delete table:', error);
    res.status(500).json({ error: 'Failed to delete table' });
  }
});

// Endpoint to get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await tableModel.getTablePositions();
    res.status(200).json(tables);
  } catch (error) {
    console.error('Failed to get tables data:', error);
    res.status(500).json({ error: 'Failed to get tables data' });
  }
});

// Endpoint to get available tables for a specific date and location
router.get('/available', async (req, res) => {
  try {
    const { location, date } = req.query;
    const tables = await tableModel.getAvailableTables(location, date);
    res.status(200).json(tables);
  } catch (error) {
    console.error('Failed to get available tables:', error);
    res.status(500).json({ error: 'Failed to get available tables' });
  }
});

// Endpoint to get reservations for a specific user
router.get('/user-reservations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const reservations = await tableModel.getUserReservations(userId);
    console.log('Reservations for user:', userId, reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Failed to get user reservations:', error);
    res.status(500).json({ error: 'Failed to get user reservations' });
  }
});

// Endpoint to create a reservation
router.post('/reserve', async (req, res) => {
  try {
    const { tableId, quantity, date, location, userId } = req.body;

    await tableModel.createReservation({
      tableId,
      quantity,
      date,
      location,
      userId,
    });

    res.status(200).json({ message: 'Reservation created successfully' });
  } catch (error) {
    console.error('Failed to create reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Endpoint to delete a reservation
router.delete('/reservation/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    await tableModel.deleteReservation(reservationId);
    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Failed to cancel reservation:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

// Endpoint to fetch reservations with filters
router.get('/reservations', async (req, res) => {
  try {
    const { year, month, startDate, endDate } = req.query;

    let sql = `
      SELECT r.id as reservationId, t.size, r.date, r.how_many, r.location, u.email as userEmail
      FROM reservations r
      JOIN tables t ON r.table_id = t.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    // Filter by year and month if provided
    if (year) {
      sql += ` AND YEAR(r.date) = ?`;
      params.push(year);
    }
    if (month) {
      sql += ` AND MONTH(r.date) = ?`;
      params.push(month);
    }

    // Filter by date range if startDate and endDate are provided
    if (startDate && endDate) {
      sql += ` AND r.date BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)`;
      params.push(startDate, endDate);
    }
    

    // Query the database
    db.query(sql, params, (error, results) => {
      if (error) {
        console.error('Failed to fetch reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});




// Endpoint to create new tables
router.post('/create', async (req, res) => {
  try {
    const tables = req.body;

    if (!Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({ error: 'Invalid table data: Expected an array of tables.' });
    }

    const createdTableIds = [];
    for (const table of tables) {
      const { left, top, size, inside } = table;

      if (left == null || top == null || size == null || inside == null) {
        return res.status(400).json({ error: 'Missing required table data.' });
      }

      const createdTableId = await tableModel.createTable({ left, top, size, inside });
      createdTableIds.push(createdTableId);
    }

    res.status(201).json({ message: 'Tables created successfully', tableIds: createdTableIds });
  } catch (error) {
    console.error('Failed to create tables:', error);
    res.status(500).json({ error: 'Failed to create tables' });
  }
});

module.exports = router;
