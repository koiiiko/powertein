const express = require('express');
const AuthController = require('./controller');
const router = express.Router();
const AuthMiddleware = require('./middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', AuthMiddleware, AuthController.getProfile);
router.post('/logout', AuthMiddleware, AuthController.logout);

router.get('/auth-check', (req, res) => {
  res.json({ status: 'OK', service: 'Auth Service' });
});

module.exports = router;