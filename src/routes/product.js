// src/routes/product.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product'); // Import the Product model

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Ürün ekleme (Ad, fiyat, stok, resim)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, stock, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const newProduct = new Product({ name, stock, price, image: imageUrl });
    await newProduct.save();
    res.status(201).json({ message: 'Ürün başarıyla eklendi!', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Ürün eklenirken hata oluştu.', error: error.message });
  }
});

// ✅ Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ürünler alınırken hata oluştu.', error });
  }
});

// ✅ Ürün silme
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
    res.json({ message: 'Ürün başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Ürün silinirken hata oluştu.', error });
  }
});

module.exports = router;