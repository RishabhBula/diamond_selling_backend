const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../model/dbConnection");
const passport = require("passport");

const userController = {};

userController.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error during signup:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const option = {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    };

    // Set the token as an HTTP cookie
    res.cookie("token", token, option, { httpOnly: true, maxAge: 3600000 }); // maxAge is set to 1 hour in milliseconds

    res.json({ message: "Login successful" });
  });
};

userController.getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
};

userController.googleSignUp = passport.authenticate("google-signup", {
  scope: ["profile", "email"],
});

(userController.googleSignUpCallback = passport.authenticate("google-signup", {
  failureRedirect: "/",
})),
  (req, res) => {
    res.redirect("/profile");
  };

userController.googleSignIn = passport.authenticate("google", {
  scope: ["profile", "email"],
});

(userController.googleSignInCallback = passport.authenticate("google", {
  failureRedirect: "/",
})),
  (req, res) => {
    res.redirect("/profile");
  };

// Admin Signup
userController.adminSignup = (req, res) => {
  const { username, password } = req.body;

  // Perform validation and error handling as needed

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Insert admin into the database
    const sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
    db.query(sql, [username, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "Admin signup successful" });
    });
  });
};

// Admin Login
// userController.adminLogin = (req, res) => {
//   const { username, password } = req.body;

//   // Retrieve admin from the database
//   const sql = "SELECT * FROM admins WHERE username = ?";
//   db.query(sql, [username], async (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const admin = results[0];

//     // Compare the provided password with the hashed password
//     const isPasswordValid = await bcrypt.compare(password, admin.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { adminId: admin.id, username: admin.username },
//       "your_secret_key",
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.json({ token });
//   });
// };


userController.adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Retrieve admin from the database
  const sql = 'SELECT * FROM admins WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const admin = results[0];

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin.id, username: admin.username }, 'your_secret_key', {
      expiresIn: '1h',
    });

    // Set the token as an HTTP cookie
    res.cookie('adminToken', token, { httpOnly: true, maxAge: 3600000 }); // maxAge is set to 1 hour in milliseconds

    // Send a success message
    res.json({ message: 'Admin login successful' });
  });
};


// ///////////////////////////////////////////////////////

// Signup
userController.Signup = async (req, res) => {
  const { userType, companyName, firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;
  console.log(userType, companyName, firstName, lastName, email, phoneNumber, password, confirmPassword)
  if (!password || typeof password !== 'string') {
    
    return res.status(400).json({ error: 'Invalid password' });
  }
  // Check if passwords match
  if (password !== confirmPassword) {
    console.log("not matched")
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Hash the password
    console.log('Before hashing - password:', password);
    const hashedpwd = await bcrypt.hash(password, 10);
    console.log('After hashing - hash:', hashedpwd);

    // Insert customer into the database
    const sql = 'INSERT INTO user (userType, companyName, firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [userType, companyName, firstName, lastName, email, phoneNumber, hashedpwd], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'signup successful' });
    });
  } catch (error) {
    console.error('Hashing error:', error);
    return res.status(500).json({ error: 'Internal Server Error (hash)' });
  }
};

// Login
userController.Login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email,password)
  // Perform validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid password' });
  }

  try {
    // Retrieve customer from the database
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const customer = results[0];

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, customer.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: customer.id, email: customer.email }, 'your_secret_key', {
        expiresIn: '1h',
      });
       // Set the token as a cookie
       res.cookie('jwtToken', token, { httpOnly: true });
      res.json({ message: 'login successful' });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = userController;
