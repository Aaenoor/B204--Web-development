import './src/toggleSidebar.js';


async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5000/api/v1/products/uploadImage', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.image;
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
    }
}

async function addProduct(product) {
    try {
        const response = await fetch('http://localhost:5000/api/v1/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('Error response from server:', data);
            throw new Error(data.message || 'Failed to add product');
        }

        alert('Product added successfully!');
        document.getElementById('add-product-form').reset();
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product. Please try again.');
    }
}

async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/orders');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayOrders(data.orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        displayErrorMessage('Error fetching orders. Please try again later.');
    }
}

function displayOrders(orders) {
    const orderHistoryTable = document.querySelector('.order-history-table tbody');
    orderHistoryTable.innerHTML = '';

    orders.forEach(order => {
        const orderRow = document.createElement('tr');
        orderRow.innerHTML = `
      <td>${order.name}</td>
      <td>${formatPrice(order.price)}</td>
      <td>${order.amount}</td>
      <td><i class="fas fa-check"></i></td>
    `;
        orderHistoryTable.appendChild(orderRow);
    });
}

function formatPrice(price) {
    return `$${(price / 100).toFixed(2)}`;
}

function displayErrorMessage(message) {
    const orderHistorySection = document.querySelector('.dashboard-section');
    orderHistorySection.innerHTML = `
    <div class="error-message">${message}</div>
  `;
}

document.getElementById('add-product-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];
    const company = document.getElementById('company').value;

    let imageUrl = '/public/uploads/example.jpeg';
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    const product = {
        name,
        price,
        description,
        image: imageUrl,
        company,
    };

    await addProduct(product);
});

document.addEventListener('DOMContentLoaded', fetchOrders);
