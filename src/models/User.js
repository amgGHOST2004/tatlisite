const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Kullanıcı modelini içe aktar
const Product = require('../models/Product'); // Ürün modelini içe aktar
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Kullanıcı kaydı (Register)
userSchema.statics.registerUser = async function (username, email, password) {
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error('Bu e-posta zaten kullanılıyor');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new this({ username, email, password: hashedPassword });
  return newUser.save();
};

// ✅ Kullanıcı girişi (Login)
userSchema.statics.loginUser = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Geçersiz e-posta veya şifre');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Geçersiz e-posta veya şifre');
  }
  return jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
};

// Remove this line as it's redundant
// const User = mongoose.model('User', userSchema, 'users');

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