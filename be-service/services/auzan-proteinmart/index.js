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

module.exports = router;