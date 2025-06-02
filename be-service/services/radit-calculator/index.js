const express = require('express');
const router = express.Router();
const calculatorController = require('./controller');

// Define the POST route for calculating protein needs
router.post('/calculate', (req, res) => {
    const { gender, age, height, weight, activityLevel } = req.body;

    // Call the controller function to perform the calculation
    const result = calculatorController.calculateProtein(gender, age, height, weight, activityLevel);

    res.json({ proteinNeeded: result });
});

module.exports = router;
//Code here