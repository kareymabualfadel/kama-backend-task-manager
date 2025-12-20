const jwt = require("jsonwebtoken");

function login(req, res) {
  const { username } = req.body || {};

  // Minimal auth: no DB, no password
  if (!username || typeof username !== "string") {
    return res.status(400).json({
      success: false,
      error: "Username required",
    });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({
    success: true,
    token,
  });
}

module.exports = { login };
