// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create a JWT for the user
function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { username, password } = req.body || {};

    // Validate input
    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ success: false, error: "Username is required" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 chars" });
    }

    // Check if user exists
    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ success: false, error: "Username already exists" });
    }

    // Hash password + create user
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.trim(),
      passwordHash,
      role: "user", // default role
    });

    // Return token + user
    const token = signToken(user._id.toString());

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, username: user.username, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (typeof username !== "string" || !username.trim() || typeof password !== "string") {
      return res.status(400).json({ success: false, error: "Username and password required" });
    }

    // Find user
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Return token + user
    const token = signToken(user._id.toString());

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, username: user.username, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
