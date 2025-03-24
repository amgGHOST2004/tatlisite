const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the Order model exists
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Create a new order
router.post('/orders', async (req, res) => {
    const { customerName, address, paymentMethod, items, totalAmount } = req.body;
    try {
        const newOrder = new Order({ customerName, address, paymentMethod, items, totalAmount });
        await newOrder.save();
        res.status(201).json({ message: 'Sipariş başarıyla oluşturuldu!' });
    } catch (error) {
        console.error('Sipariş oluşturulurken bir hata oluştu:', error);
        res.status(500).json({ message: 'Sipariş oluşturulurken bir hata oluştu.', error: error.message });
    }
});

// Get all orders (Admin Dashboard)
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('items.productId'); // Populate product details
        res.json(orders); // Return orders as JSON
    } catch (error) {
        console.error('Siparişler getirilirken bir hata oluştu:', error);
        res.status(500).json({ message: 'Siparişler getirilirken bir hata oluştu.', error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Yetersiz stok.' });
    }

    const order = new Order({
      user: req.user._id,
      product: productId,
      quantity,
      totalPrice: product.price * quantity
    });

    await order.save();

    // Update product stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Sipariş oluşturulamadı.', error });
  }
});

module.exports = router;