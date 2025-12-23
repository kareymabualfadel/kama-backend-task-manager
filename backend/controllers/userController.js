const bcrypt = require("bcrypt");
const User = require("../models/User");

// GET /api/admin/users
async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("_id username role createdAt");
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users
async function createUser(req, res, next) {
  try {
    const { username, password, role } = req.body || {};

    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ success: false, error: "Username is required" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 chars" });
    }

    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ success: false, error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.trim(),
      passwordHash,
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).json({
      success: true,
      data: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/users/:id
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body || {};

    const update = {};

    if (username !== undefined) {
      if (typeof username !== "string" || !username.trim()) {
        return res.status(400).json({ success: false, error: "Username must be non-empty" });
      }
      update.username = username.trim();
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ success: false, error: "Password must be at least 6 chars" });
      }
      update.passwordHash = await bcrypt.hash(password, 12);
    }

    if (role !== undefined) {
      update.role = role === "admin" ? "admin" : "user";
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select("_id username role");

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid user id" });
    }
    next(err);
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid user id" });
    }
    next(err);
  }
}

module.exports = { listUsers, createUser, updateUser, deleteUser };
