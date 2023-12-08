const express = require('express');
const userController = require('../controller/userLoginController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users', userController.getAllUsers);

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
  
    // Verify the token
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      req.user = decoded; // Set the decoded user information in the request object
      next();
    });
  };
  
  // Protected route example
  router.get('/protected-route', authenticateUser, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });

module.exports = router;
