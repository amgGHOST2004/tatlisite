const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  total: { type: Number, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
