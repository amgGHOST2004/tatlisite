let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsDiv = document.getElementById('cartItems');
const totalAmountSpan = document.getElementById('totalAmount');

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

// Submit order
document.getElementById('orderForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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