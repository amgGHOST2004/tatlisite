const express = require('express');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const router = express.Router();
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// Check authentication
router.get('/check-auth', auth, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

// Create a new admin (you might want to protect this route or remove it in production)
router.post('/create', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = new Admin({ username, password });
        await admin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
});
module.exports = router;

