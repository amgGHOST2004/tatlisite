const express = require('express');
const Product = require('./models/Product'); // Adjust the path to your Product model

const app = express();
const PORT = process.env.PORT || 3000;

// Route to fetch and display products
app.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.render('index', { products }); // Render the index.ejs file with products data
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/home', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.render('home', { products }); // Render the home.ejs file with products data
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});