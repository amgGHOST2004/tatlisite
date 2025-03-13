const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// API endpoint to fetch users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

module.exports = router;