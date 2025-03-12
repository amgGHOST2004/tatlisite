const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Log the incoming request
    console.log('Login request received:', { username });

    // Find the admin in the `admins` collection
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password (direct comparison)
    if (password !== admin.password) {
      console.log('Invalid password for admin:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign a token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for admin:', username);
    res.json({ token, adminId: admin._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;