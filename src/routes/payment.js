const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

// Create a payment session
router.post('/payments/create-session', async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'try',
                        product_data: {
                            name: 'Sepet Toplamı'
                        },
                        unit_amount: amount * 100 // Stripe expects the amount in cents
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success.html`,
            cancel_url: `${process.env.FRONTEND_URL}/sepet.html`
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Payment session creation error:', error);
        res.status(500).json({ message: 'Payment session creation failed.' });
    }
});

module.exports = router;