const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const auth = require('../middleware/auth');

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