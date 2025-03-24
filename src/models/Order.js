const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ['Paid', 'Door Pay'], required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product model
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);