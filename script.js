// Use your actual Render URL correctly (only declare it once)
const API_URL = 'https://my-ecom-store-lj9c.onrender.com/api/products';

// --- STOREFRONT LOGIC (index.html) ---
async function loadStoreProducts() {
  const grid = document.getElementById('storeProductGrid');
  if (!grid) return;

  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    if (products.length === 0) {
      grid.innerHTML = '<p>No products available right now. Check back later!</p>';
      return;
    }

    grid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <p>⭐ ${product.rating || 'N/A'}</p>
        <p>${product.numb || 'N/A'}</p>
        <div class="price">₹${product.price}</div>
        <button onclick="addToCart('${product._id}')">Add to Cart</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error fetching products:', error);
    grid.innerHTML = '<p>Unable to connect to server. Ensure backend is running.</p>';
  }
}

function addToCart(productId) {
  alert(`Product ${productId} added to cart!`);
}

// --- ADMIN DASHBOARD LOGIC (admin.html) ---
async function loadAdminProducts() {
  const grid = document.getElementById('adminProductGrid');
  if (!grid) return;

  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    if (products.length === 0) {
      grid.innerHTML = '<p>No products added yet.</p>';
      return;
    }

    grid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <p>⭐ ${product.rating || 'N/A'}</p>
        <p>${product.numb || 'N/A'}</p>
        <div class="price">₹${product.price}</div>
        <button class="btn btn-delete" onclick="deleteProduct('${product._id}')" style="background-color: #e74c3c; color: white;">Delete Product</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading admin products:', error);
    grid.innerHTML = '<p>Failed to load products from database.</p>';
  }
}

// Handle Add Product Form Submission
const productForm = document.getElementById('productForm');
if (productForm) {
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ratingInput = document.getElementById('productRating');

    const newProduct = {
      name: document.getElementById('productName').value,
      price: Number(document.getElementById('productPrice').value),
      image: document.getElementById('productImage').value,
      description: document.getElementById('productDesc').value,
      rating: ratingInput ? Number(ratingInput.value) : 0,
      numb: document.getElementById('productNumb').value
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        alert('Product added successfully!');
        productForm.reset();
        loadAdminProducts(); // Refresh list immediately
      } else {
        alert('Failed to save product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error connecting to backend server.');
    }
  });
}

// Delete Product Function
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Product deleted!');
      loadAdminProducts(); // Refresh list immediately
    } else {
      alert('Failed to delete product.');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error connecting to backend server.');
  }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadStoreProducts();
  loadAdminProducts();
});
