const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Make sure this path is correct

console.log('Auth middleware:', auth); // Add this line for debugging
// Admin login
router.post('/login', async (req, res) => {
  // Your login logic here
});

// Check authentication
router.get('/check-auth', auth, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

// Create a new admin (you might want to protect this route or remove it in production)
router.post('/create', async (req, res) => {
  // Your create admin logic here
});

module.exports = router;

