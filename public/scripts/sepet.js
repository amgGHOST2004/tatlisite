let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsDiv = document.getElementById('cartItems');
const totalAmountSpan = document.getElementById('totalAmount');
const paymentMethodSelect = document.getElementById('paymentMethod');
const paymentSection = document.getElementById('paymentSection');
const payButton = document.getElementById('payButton');

// Render cart items
function renderCart() {
    cartItemsDiv.innerHTML = '';
    let totalAmount = 0;
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <p>${item.name} - ${item.price} TL x ${item.quantity}</p>
            <button onclick="removeFromCart(${index})">Kaldır</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
        totalAmount += item.price * item.quantity;
    });
    totalAmountSpan.textContent = totalAmount;
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Handle payment method change
paymentMethodSelect.addEventListener('change', () => {
    if (paymentMethodSelect.value === 'Paid') {
        paymentSection.style.display = 'block'; // Show payment section for "Ön Ödeme"
    } else {
        paymentSection.style.display = 'none'; // Hide payment section for "Kapıda Ödeme"
    }
});

// Handle online payment
payButton.addEventListener('click', async () => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Example: Integrate Stripe or another payment gateway
    try {
        const response = await fetch('/api/payments/create-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: totalAmount })
        });
        const { sessionId } = await response.json();

        // Redirect to the payment gateway (e.g., Stripe Checkout)
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
        console.error('Payment error:', error);
        alert('Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Submit order
document.getElementById('orderForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const address = document.getElementById('address').value;
    const paymentMethod = paymentMethodSelect.value;
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (paymentMethod === 'Paid') {
        alert('Lütfen önce online ödeme yapın.');
        return;
    }

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerName,
                address,
                paymentMethod,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                totalAmount
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Sipariş başarıyla gönderildi!');
            localStorage.removeItem('cart');
            window.location.href = '/';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Sipariş gönderilirken bir hata oluştu:', error);
        alert('Sipariş gönderilirken bir hata oluştu.');
    }
});

renderCart();