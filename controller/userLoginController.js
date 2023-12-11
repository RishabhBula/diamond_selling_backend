const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../model/dbConnection');

const userController = {};

userController.signup = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the database
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error during signup:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// userController.login = (req, res) => {
//   const { username, password } = req.body;

//   // Retrieve user from the database
//   const sql = 'SELECT * FROM users WHERE username = ?';
//   db.query(sql, [username], async (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     const user = results[0];

//     // Compare the provided password with the hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', {
//       expiresIn: '1h',
//     });

//     res.json({ token });
//     console.log(token)
//   });
// };

userController.login = (req, res) => {
    const { username, password } = req.body;
  
    // Retrieve user from the database
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const user = results[0];
  
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      },
      );
      const option = {
        secure: true,
        httpOnly: true,
        sameSite: "none"
      }
  
      // Set the token as an HTTP cookie
      res.cookie('token', token, option, { httpOnly: true, maxAge: 3600000 }); // maxAge is set to 1 hour in milliseconds
  
      res.json({ message: 'Login successful' });
    });
  };

  userController.getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM users';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      res.json(results);
    });
  };

module.exports = userController;
