const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Yetkilendirme hatası: Token bulunamadı' });
    }

    try {
        const decoded = jwt.verify(token, 'gizliAnahtar');
        req.adminId = decoded.id; // Token'dan çözülen bilgiyi request'e ekle
        next(); // Bir sonraki middleware veya route'a geç
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz token' });
    }
};

module.exports = auth;