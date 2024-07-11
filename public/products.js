import './src/toggleSidebar.js';


let allProducts = [];

function formatPrice(price) {
  return `$${(price / 100).toFixed(2)}`;
}

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    allProducts = data.products;
    displayProducts(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    displayErrorMessage('Error fetching products. Please try again later.');
  }
}

function displayProducts(products) {
  const productsContainer = document.querySelector('.products-container');
  productsContainer.innerHTML = '';
  if (products.length === 0) {
    displayErrorMessage('No products match your search criteria.');
    return;
  }

  products.forEach(product => {
    const productElement = document.createElement('article');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <div class="product-container">
        <img src="${product.image}" class="product-img img" alt="${product.name}" />
        <div class="product-icons">
          <a href="product.html?id=${product._id}" class="product-icon">
            <i class="fas fa-search"></i>
          </a>
          
        </div>
      </div>
      <footer>
        <p class="product-name">${product.name}</p>
        <h4 class="product-price">${formatPrice(product.price)}</h4>
      </footer>
    `;
    productsContainer.appendChild(productElement);
  });
}

function displayErrorMessage(message) {
  const productsContainer = document.querySelector('.products-container');
  productsContainer.innerHTML = `
    <div class="error-message">${message}</div>
  `;
}

function filterProducts(event) {
  const searchInput = event.target.value.toLowerCase();
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchInput)
  );
  displayProducts(filteredProducts);
}

document.addEventListener('DOMContentLoaded', fetchProducts);

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', filterProducts);
