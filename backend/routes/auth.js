// Auth Routes
// User registration, login, and profile management endpoints

const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const { validateRegister, validateLogin, validationErrors } = require("../middleware/validation");
const authController = require("../controllers/authController");

// Public routes
router.post("/register", validateRegister, validationErrors, authController.register);
router.post("/login", validateLogin, validationErrors, authController.login);

// Protected routes
router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.post("/address", protect, authController.addAddress);

// Admin routes
router.get("/users", protect, admin, authController.getAllUsers);

module.exports = router;
