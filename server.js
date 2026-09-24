require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas via .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully to Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define Product Model
const Product = mongoose.model('Product', {
  name: String,
  price: Number,
  image: String,
  description: String,
  rating: Number,
  numb: Number
});

// Root route to prevent "Cannot GET /" on Render
app.get('/', (req, res) => {
  res.json({ message: "E-Commerce API is running successfully! 🚀" });
});

// GET Products for storefront
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST Product from Admin Panel
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product created!", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// DELETE Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
