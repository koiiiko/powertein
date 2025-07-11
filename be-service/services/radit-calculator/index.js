const express = require('express');
const router = express.Router();

// Define the POST route for calculating protein needs
const calculatorController = require('./controller'); // Assuming controller.js exists and exports calculation logic

router.get('/protein/:userId', calculatorController.getProtein);

router.post('/calculate', calculatorController.calculateProtein);
module.exports = router;