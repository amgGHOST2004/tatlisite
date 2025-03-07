const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mongoose ayarları
mongoose.set('strictQuery', true);

// MongoDB bağlantısı
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Kullanıcı modeli
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String
}));

// Kayıt endpoint'i
app.post('/api/users/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Kayıt başarılı!' });
    } catch (error) {
        console.error('Kayıt sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.', error: error.message });
    }
});

// Statik dosyaları sunma
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfaya yönlendirme
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});