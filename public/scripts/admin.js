// Fetch and display orders
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = ''; // Clear previous content

        if (orders.length === 0) {
            orderList.innerHTML = '<p>Henüz sipariş yok.</p>';
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-card';
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
                <button onclick="deleteOrder('${order._id}')" class="delete-btn">Sil</button>
                <hr>
            `;
            orderList.appendChild(orderDiv);
        });
    } catch (error) {
        console.error('Siparişler alınırken hata oluştu:', error);
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<p>Siparişler getirilirken bir hata oluştu. Lütfen tekrar deneyin.</p>';
    }
}

// Delete an order
async function deleteOrder(orderId) {
    if (!confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Sipariş başarıyla silindi!');
            fetchOrders(); // Refresh the order list
        } else {
            alert('Sipariş silinirken hata oluştu.');
        }
    } catch (error) {
        console.error('Sipariş silme hatası:', error);
        alert('Sipariş silinirken bir hata oluştu.');
    }
}

// Fetch orders when the "Siparişler" section is shown
function showSection(section) {
    const sectionElement = document.getElementById(section);
    if (!sectionElement) {
        console.error(`Section ${section} not found!`);
        return;
    }
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    sectionElement.classList.add('active');

    if (section === 'products') fetchProducts();
    if (section === 'orders') fetchOrders(); // Fetch orders when "Siparişler" is shown
}

// Show the dashboard section by default when the page loads
showSection('dashboard');