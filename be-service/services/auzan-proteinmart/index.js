const express = require('express');
const router = express.Router();
const productController = require('./controller');

// Define the route for getting products
router.get('/products', async (req, res) => {
  try {
    const {
      category,
      searchTerm
    } = req.query;
    const products = await productController.getProducts({
      category,
      searchTerm
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define the route for getting a single product by ID
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from URL parameters
    const product = await productController.getProductById(productId); // Call a new controller function

    if (!product) {
      // If product is not found, send 404 response
      return res.status(404).send('Product not found');
    }

    // Send the product data as JSON response
    res.json(product);
  } catch (error) {
    // Handle errors
    console.error(`Error fetching product with ID ${req.params.productId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;