const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth'); // Import auth middleware
const Admin = require('../models/Admin'); // Import the Admin model

// Example route to check authentication
router.get('/check-auth', auth, async (req, res) => {
  try {
    // Your route logic here
    res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/check-auth', auth, async (req, res) => {
  try {
    // Your route logic here
    res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and sign a token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, adminId: admin._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Check authentication
router.get('/check-auth', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Authenticated', adminId: admin.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new admin (you might want to protect this route or remove it in production)
router.post('/create', async (req, res) => {
    try {
        const { username, password } = req.body;

        let admin = await Admin.findOne({ username });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin = new Admin({
            username,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

