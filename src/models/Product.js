const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Product', ProductSchema);
