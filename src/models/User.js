// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Static method for user registration
userSchema.statics.registerUser = async function (username, email, password) {
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error('Bu e-posta zaten kullanılıyor');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new this({ username, email, password: hashedPassword });
  return newUser.save();
};

// Static method for user login
userSchema.statics.loginUser = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Geçersiz e-posta veya şifre');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Geçersiz e-posta veya şifre');
  }
  return jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
};

// Export the User model (check if it already exists)
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
module.exports = User;