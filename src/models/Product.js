// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Price in TL
  stock: { type: Number, required: true }, // Stock quantity
  image: { type: String, required: true }, // URL of the product image
});

module.exports = mongoose.model('Product', productSchema);