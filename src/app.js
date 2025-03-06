require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectToDatabase } = require('./db-connections');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure sessions
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/api/users', userRoutes);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});