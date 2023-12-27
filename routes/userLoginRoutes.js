const express = require("express");
const userController = require("../controller/userLoginController");

const router = express.Router();

router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);
router.get("/users", userController.getAllUsers);


const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  // Verify the token
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = decoded; // Set the decoded user information in the request object
    next();
  });
};

// Protected route
router.get("/protected-route", authenticateUser, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Google Sign-In routes
router.get("/auth/google", userController.googleSignIn);
router.get("/auth/google/callback", userController.googleSignInCallback);

// Google Sign-Up routes
router.get("/auth/google/signup", userController.googleSignUp);
router.get("/auth/google/signup/callback", userController.googleSignUpCallback);

// Admin Signup and Login routes
router.post('/admin/signup', userController.adminSignup);
router.post('/admin/login', userController.adminLogin);

router.post('/signup', userController.Signup);
router.post('/login', userController.Login);

module.exports = router;
