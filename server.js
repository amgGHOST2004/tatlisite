// server.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/product');
const adminRoutes = require('./src/routes/admin');
const adminRoutes = require('../../../../src/routes/admin');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

router.post('/login', async (req, res) => {
  // ... authentication logic
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// In admin-login.html
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  // ... fetch logic
  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('adminToken', token);
    window.location.href = '/admin-dashboard.html';
  }
});

// In admin-dashboard.html
const adminToken = localStorage.getItem('adminToken');
if (!adminToken) {
  window.location.href = '/admin-login.html';
}

// Use the token for authenticated requests
fetch('/api/admin/some-protected-route', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});


// Default route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Start the server
app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor`);
});

async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    // ... rest of the function
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// For adding a product
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });
    // ... handle the response
  } catch (error) {
    console.error('Error adding product:', error);
  }
});

