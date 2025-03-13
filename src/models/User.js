// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Kullanıcı adı zorunludur'], 
    unique: true, 
    trim: true, 
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'] 
  },
  email: { 
    type: String, 
    required: [true, 'E-posta zorunludur'], 
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçersiz e-posta adresi'] 
  },
  password: { 
    type: String, 
    required: [true, 'Şifre zorunludur'], 
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'] 
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

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
  // Validate input fields
  if (!username || !email || !password) {
    throw new Error('Tüm alanlar zorunludur');
  }

  // Check if the email or username already exists
  const existingUser = await this.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Bu e-posta veya kullanıcı adı zaten kullanılıyor');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save the new user
  const newUser = new this({ username, email, password: hashedPassword });
  await newUser.save();

  // Generate a JWT token for the new user
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
  return token;
};

// Static method for user login
userSchema.statics.loginUser = async function (identifier, password) {
  // Validate input fields
  if (!identifier || !password) {
    throw new Error('Tüm alanlar zorunludur');
  }

  // Find the user by email or username
  const user = await this.findOne({
    $or: [
      { email: identifier }, // Check if identifier matches email
      { username: identifier }, // Check if identifier matches username
    ],
  });

  // If user not found, throw an error
  if (!user) {
    throw new Error('Geçersiz kullanıcı adı/e-posta veya şifre');
  }

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Geçersiz kullanıcı adı/e-posta veya şifre');
  }

  // Generate a JWT token for the logged-in user
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
  return token;
};

// Export the User model (check if it already exists)
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
module.exports = User;