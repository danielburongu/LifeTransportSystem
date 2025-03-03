const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Validate JWT_SECRET at startup
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["patient", "police", "hospital_staff", "ambulance_driver"])
      .withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("🔍 Register validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, password, role, location } = req.body;
      console.log("🔍 Register request received:", { name, email, phone, role, location });

      // Check if user already exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`🔍 Register failed: User already exists with email ${email}`);
        return res.status(400).json({ message: "❌ User with this email already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        location,
      });

      await newUser.save();
      console.log(`✅ User registered successfully: ${email}`);

      // Generate JWT Token
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "✅ Registration successful! Redirecting to login...",
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      });
    } catch (error) {
      console.error("❌ Register error:", error.message, error.stack);
      res.status(500).json({ message: "❌ Server Error during registration", error: error.message });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("🔍 Login validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      console.log("🔍 Login request received:", { email });

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        console.log(`🔍 Login failed: No user found with email ${email}`);
        return res.status(400).json({ message: "❌ No user found with this email" });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`🔍 Login failed: Password mismatch for email ${email}`);
        return res.status(400).json({ message: "❌ Incorrect password" });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log(`✅ Login successful for email ${email}`);
      res.json({
        message: "✅ Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("❌ Login error:", error.message, error.stack);
      res.status(500).json({ message: "❌ Server Error during login", error: error.message });
    }
  }
);

module.exports = router;