const express = require('express');
const Product = require('../models/Product'); // Ensure the Product model exists
const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products); // Return products as JSON
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
});

module.exports = router;