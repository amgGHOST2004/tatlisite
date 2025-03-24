let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from the backend and render them
async function fetchItems() {
    try {
        const response = await fetch('/api/products'); // Ensure this matches your backend route
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '<p style="color: red;">Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>';
    }
}

// Render products on the page
function renderProducts(products) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Fiyat: ${product.price} TL</p>
            <p>Stok: ${product.stock}</p>
            <img src="${product.image}" alt="${product.name}" width="150">
            <form class="add-to-cart-form" data-product-id="${product._id}">
                <input type="number" name="quantity" min="1" max="${product.stock}" value="1" required>
                <button type="submit">Sepete Ekle</button>
            </form>
        `;
        itemList.appendChild(itemElement);
    });

    // Add event listeners for "Add to Cart" forms
    document.querySelectorAll('.add-to-cart-form').forEach(form => {
        form.addEventListener('submit', addToCart);
    });
}

// Add a product to the cart
function addToCart(event) {
    event.preventDefault();
    const form = event.target;
    const productId = form.dataset.productId;
    const quantity = parseInt(form.quantity.value);

    const product = {
        id: productId,
        name: form.parentElement.querySelector('h3').innerText,
        price: parseFloat(form.parentElement.querySelector('p').innerText.replace('Fiyat: ', '').replace(' TL', '')),
        quantity: quantity,
        image: form.parentElement.querySelector('img').src
    };

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push(product);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ürün sepete eklendi!');
}

// Fetch and render products on page load
fetchItems();