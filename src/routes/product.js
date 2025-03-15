const express = require('express');
const Product = require('../models/product.js');
const router = express.Router();

// Tüm ürünleri getir
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu.' });
    }
});

module.exports = router;