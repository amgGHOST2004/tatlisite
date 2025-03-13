const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  image: { type: String, required: true } // Image URL
});

module.exports = mongoose.model('Product', ProductSchema);