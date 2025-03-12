// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Admin = require('./src/models/Admin'); // Ensure Admin model is imported
const jwt = require('jsonwebtoken'); // Import jwt for token generation

// Make sure your .env file has a JWT_SECRET defined
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in the environment variables');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const adminRoutes = require('./src/routes/admin');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mongoose settings
mongoose.set('strictQuery', true);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User model
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
  })
);

// Register endpoint
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Kayıt başarılı!' });
  } catch (error) {
    console.error('Kayıt sırasında bir hata oluştu:', error);
    res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.', error: error.message });
  }
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }
    res.status(200).json({ message: 'Giriş başarılı!' });
  } catch (error) {
    console.error('Giriş sırasında bir hata oluştu:', error);
    res.status(500).json({ message: 'Giriş sırasında bir hata oluştu.', error: error.message });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mount admin routes
app.use('/api/admin', adminRoutes);

// Step 5: Test route for admin login
app.get('/api/admin/test-login', async (req, res) => {
  try {
    // Simulate a login request
    const testAdmin = {
      username: 'admin',
      password: 'Efeyim123!',
    };

    // Find the admin in the `admins` collection
    const admin = await Admin.findOne({ username: testAdmin.username });
    if (!admin) {
      return res.status(400).json({ message: 'Test admin not found' });
    }

    // Validate password (direct comparison)
    if (testAdmin.password !== admin.password) {
      return res.status(400).json({ message: 'Invalid test credentials' });
    }

    // Create and sign a token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Test login successful', token, adminId: admin._id });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ message: 'Test login failed', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});