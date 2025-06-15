const express = require('express');
const ChatbotController = require('./controller');
const router = express.Router();

router.post('/chat', ChatbotController.chat);

router.get('/chatbot-check', (req, res) => {
    res.json({
        status: 'OK',
        service: 'PowerTein AI Chatbot',
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        capabilities: [
            'Protein and nutrition advice',
            'Fitness guidance', 
            'Supplement recommendations',
        ]
    });
});


module.exports = router;