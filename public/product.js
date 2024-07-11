import './src/toggleSidebar.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    fetchPayPalClientId();
});

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function formatPrice(price) {
    return (price / 100).toFixed(2);
}

function loadPayPalSDK(clientId) {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.onload = () => {
        const productId = getProductIdFromUrl();
        if (productId) {
            fetchProduct(productId);
        } else {
            displayErrorMessage('Product not found.');
        }
    };
    document.head.appendChild(script);
}

async function fetchProduct(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/products/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const { product } = await response.json();
        displayProduct(product);
        setupPayPalButton(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        displayErrorMessage('Error fetching product. Please try again later.');
    }
}

function displayProduct(product) {
    const productImage = document.querySelector('.single-product-img');
    const productTitle = document.querySelector('.single-product-title');
    const productCompany = document.querySelector('.single-product-company');
    const productPrice = document.querySelector('.single-product-price');
    const productDesc = document.querySelector('.single-product-desc');

    productImage.src = product.image;
    productImage.alt = product.name;
    productTitle.textContent = product.name;
    productCompany.textContent = `by ${product.company}`;
    productPrice.textContent = `$${formatPrice(product.price)}`;
    productDesc.textContent = product.description;
}

function displayErrorMessage(message) {
    const productContainer = document.querySelector('.single-product-center');
    productContainer.innerHTML = `
    <div class="error-message">${message}</div>
  `;
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function setupPayPalButton(product) {
    paypal.Buttons({
        createOrder: async function (data, actions) {
            const response = await fetch('http://localhost:5000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [product],
                    total: product.price,
                    name: product.name
                }),
            });
            const orderData = await response.json();
            if (!orderData.orderId) {
                throw new Error('Order ID not returned from API');
            }
            return orderData.orderId;
        },
        onApprove: async function (data, actions) {
            const response = await fetch('http://localhost:5000/api/v1/orders/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: data.orderID,
                    name: product.name,
                    total: product.price
                }),
            });
            const captureData = await response.json();
            if (captureData.capture.statusCode === 201) {
                showModal('success-modal');
            } else {
                showModal('error-modal');
            }
        },
        onError: function (err) {
            console.error('PayPal error:', err);
            showModal('error-modal');
        }
    }).render('#paypal-button-container');
}

async function fetchPayPalClientId() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/orders/config/paypal');
        if (!response.ok) {
            throw new Error('Failed to fetch PayPal client ID');
        }
        const { clientId } = await response.json();
        loadPayPalSDK(clientId);
    } catch (error) {
        console.error('Error fetching PayPal client ID:', error);
    }
}
