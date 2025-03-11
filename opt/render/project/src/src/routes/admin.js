const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); // Adjust the path as necessary

// Your existing code...

router.get('/check-auth', auth, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});

// Rest of your code...

module.exports = router;