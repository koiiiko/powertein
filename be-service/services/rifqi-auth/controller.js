const jwt = require('jsonwebtoken');
const AuthModel = require('./model');
const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  // POST /auth/register
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'Username, email, and password are required' 
        });
      }

      // Create user
      const result = await AuthModel.createUser(username, email, password);

      res.status(201).json({
        message: 'User created successfully',
        userId: result.userId
      });

    } catch (error) {
      console.error('Register error:', error);
      
      if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Server error' });
    }
  }

  // POST /auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      // Find user
      const user = await AuthModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await AuthModel.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // GET /auth/profile
  static async getProfile(req, res) {
    try {
      const user = await AuthModel.findUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });

    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // POST /auth/logout
  static async logout(req, res) {
    res.json({
      message: 'Logout successful. Please remove token from client.'
    });
  }
}

module.exports = AuthController;