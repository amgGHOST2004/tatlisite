async function fetchOrders() {
    try {
        const response = await fetch('/api/orders'); // Fetch orders from the backend
        const orders = await response.json();
        const ordersDiv = document.getElementById('orders');
        ordersDiv.innerHTML = ''; // Clear previous content

        if (orders.length === 0) {
            ordersDiv.innerHTML = '<p>Henüz sipariş yok.</p>';
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');
            orderDiv.innerHTML = `
                <h3>${order.customerName}</h3>
                <p><strong>Adres:</strong> ${order.address}</p>
                <p><strong>Ödeme Yöntemi:</strong> ${order.paymentMethod}</p>
                <p><strong>Toplam Tutar:</strong> ${order.totalAmount} TL</p>
                <h4>Ürünler:</h4>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.productId.name} - ${item.quantity} adet</li>
                    `).join('')}
                </ul>
                <hr>
            `;
            ordersDiv.appendChild(orderDiv);
        });
    } catch (error) {
        console.error('Siparişler getirilirken bir hata oluştu:', error);
        const ordersDiv = document.getElementById('orders');
        ordersDiv.innerHTML = '<p>Siparişler getirilirken bir hata oluştu. Lütfen tekrar deneyin.</p>';
    }
}

fetchOrders();