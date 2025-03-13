const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Define the User model
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;