// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Price in TL
  image: { type: String, required: true }, // URL of the product image
});

module.exports = mongoose.model('Product', productSchema);