const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Admin = require('./src/models/Admin');
const jwt = require('jsonwebtoken');
const userRoutes = require('./src/routes/users');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

const app = express();
const port = process.env.PORT || 3000;
const adminRoutes = require('./src/routes/admin');

app.use(cors());
app.use(bodyParser.json());

mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.post('/api/products', async (req, res) => {
  try {
    const { name, stock } = req.body;
    const newProduct = new Product({ name, stock });
    await newProduct.save();
    res.status(201).json({ message: 'Ürün başarıyla eklendi!' });
  } catch (error) {
    res.status(500).json({ message: 'Ürün eklenirken hata oluştu.', error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ürünler alınırken hata oluştu.', error });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ürün silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Ürün silinirken hata oluştu.', error });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Siparişler alınırken hata oluştu.', error });
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor`);
});
