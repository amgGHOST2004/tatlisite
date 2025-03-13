// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
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
  if (!username || !email || !password) {
    throw new Error('Tüm alanlar zorunludur');
  }

  const existingUser = await this.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Bu e-posta veya kullanıcı adı zaten kullanılıyor');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new this({ username, email, password: hashedPassword });
  return newUser.save();
};

// Static method for user login
userSchema.statics.loginUser = async function (identifier, password) {
  if (!identifier || !password) {
    throw new Error('Tüm alanlar zorunludur');
  }

  // Check if the identifier is an email or username
  const user = await this.findOne({
    $or: [
      { email: identifier }, // Check if identifier matches email
      { username: identifier }, // Check if identifier matches username
    ],
  });

  if (!user) {
    throw new Error('Geçersiz kullanıcı adı/e-posta veya şifre');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Geçersiz kullanıcı adı/e-posta veya şifre');
  }

  return jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
};

// Export the User model (check if it already exists)
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
module.exports = User;