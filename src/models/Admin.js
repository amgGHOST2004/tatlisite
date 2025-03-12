const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store password in plain text
});

const Admin = mongoose.model('Admin', adminSchema, 'admins'); // Explicitly specify the collection name

module.exports = Admin;