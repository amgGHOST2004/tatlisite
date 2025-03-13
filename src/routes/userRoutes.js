// userRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Keep only one login route
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;