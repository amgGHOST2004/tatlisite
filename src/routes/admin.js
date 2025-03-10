const express = require('express');
const auth = require('../middleware/auth'); // Middleware'ı import et
const router = express.Router();

// Admin paneli route'u (sadece yetkilendirilmiş kullanıcılar erişebilir)
router.get('/posts', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('İlanları getirme hatası:', error);
        res.status(500).json({ message: 'İlanlar getirilirken bir hata oluştu' });
    }
});

module.exports = router;