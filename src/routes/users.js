const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Kullanıcı modelini içe aktar
const Product = require('../models/Product'); // Ürün modelini içe aktar

// ✅ Tüm kullanıcıları getir
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcıları alırken hata oluştu', error });
  }
});

// ✅ Kullanıcı güncelleme (isim ve e-posta değiştir)
router.put('/:id', async (req, res) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı güncellenirken hata oluştu.', error });
  }
});

// ✅ Kullanıcı silme
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı silinirken hata oluştu.', error });
  }
});

// 📌 Multer ile resim yükleme ayarları
const storage = multer.diskStorage({
  destination: './uploads/', // Resimler "uploads" klasörüne kaydedilecek
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ✅ Ürün ekleme (Ad, fiyat, stok, resim)
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, stock, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Resim yolu
    const newProduct = new Product({ name, stock, price, image: imageUrl });
    await newProduct.save();
    res.status(201).json({ message: 'Ürün başarıyla eklendi!', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Ürün eklenirken hata oluştu.', error: error.message });
  }
});

// ✅ Tüm ürünleri getir
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ürünler alınırken hata oluştu.', error });
  }
});

module.exports = router;
