const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Admin = require('./src/models/Admin');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./src/routes/product'); // Import product routes
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

const app = express();
const port = process.env.PORT || 3000;
const adminRoutes = require('./src/routes/admin');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/products', productRoutes); // Product routes

// Start the server
app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor`);
});