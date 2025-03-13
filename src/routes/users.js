const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Define the User model
const User = mongoose.model('User', userSchema, 'users');

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