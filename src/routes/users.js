// users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const jwt = require('jsonwebtoken');

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
    if (!username || !email) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

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

// ✅ Kullanıcı kaydı (Register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const token = await User.registerUser(username, email, password);
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi!', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Kullanıcı girişi (Login)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Expect username and password
    if (!username || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const token = await User.loginUser(username, password);
    res.json({ message: 'Giriş başarılı!', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;