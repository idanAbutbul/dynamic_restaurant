const express = require('express');
const router = express.Router();
const FormModel = require('../models/form_M');

router.post('/submit', async (req, res) => {
  try {
    const formData = req.body;
    await FormModel.saveForm(formData);
    res.status(200).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Failed to save form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
