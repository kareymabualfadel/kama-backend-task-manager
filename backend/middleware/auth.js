// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes: requires a valid JWT + existing user in DB
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }

    // payload should include user id in `sub` (recommended) OR fallback to `id` if you used that before
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.sub || payload.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
      });
    }

    // Load user from DB (role is trusted only from DB, not from token)
    const user = await User.findById(userId).select("_id username role");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User no longer exists",
      });
    }

    req.user = user; // attach authenticated user (from DB)
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}

// Role guard: only allow a specific role (ex: "admin")
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
      });
    }

    next();
  };
}

module.exports = { protect, requireRole };
