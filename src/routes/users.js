const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Kullanıcı modelini içe aktar

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

module.exports = router;
