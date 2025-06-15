require('dotenv').config();
require('./database');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authService = require('./services/rifqi-auth');
const chatbotService = require('./services/rifqi-chatbot');
const calculatorService = require('./services/radit-calculator');
const proteinmartService = require('./services/auzan-proteinmart');
const forumService = require('./services/ribka-forum');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Powertein API' });
});
app.use('/auth', authService);
app.use('/chatbot', chatbotService);
app.use('/calculator', calculatorService);
app.use('/forum', forumService);
app.use('/auzan-proteinmart', proteinmartService);

// Start server : http://localhost:5000/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});