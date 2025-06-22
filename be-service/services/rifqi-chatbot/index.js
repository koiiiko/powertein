const express = require('express');
const ChatbotController = require('./controller');
const router = express.Router();

router.post('/chat', ChatbotController.chat);

// Untuk cek status apakah layanan berfungsi atau tidak
router.get('/chatbot-check', (req, res) => {
    res.json({
        status: 'OK',
        service: 'PowerTein AI Chatbot',
        model: 'llama3-70b-8192',
    });
});


module.exports = router;