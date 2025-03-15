require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectToDatabase } = require('./db-connections');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const orderRouter = require('./routes/order');
const path = require('path');
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Admin dashboard route
app.get('/admin-dashboard', adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
});

// Catch-all route for admin pages
app.get('/admin*', (req, res) => {
  res.redirect('/admin-login.html');
});
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
