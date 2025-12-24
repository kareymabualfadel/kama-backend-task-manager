const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const taskRoutes = require("./routes/taskRoutes.js");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminTaskRoutes = require("./routes/adminTaskRoutes");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---- Security headers ----
// IMPORTANT for your current setup (HTTP only):
// Helmet's CSP can include `upgrade-insecure-requests` which forces the browser
// to request https:// for your JS/CSS, causing ERR_CONNECTION_REFUSED.
// So we disable CSP for now. Later, when you add HTTPS via reverse proxy,
// we can re-enable CSP properly.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json());
app.use(logger);

// ---- CORS ----
// If frontend is served by the SAME Express (same-origin), CORS is not needed.
// But keeping it open is fine for your pentest lab setup.
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// ---- Serve frontend static files ----
const FRONTEND_DIR = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND_DIR));

// ---- API routes ----
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/tasks", adminTaskRoutes);

// ---- Pages ----
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "login.html"));
});

// ---- Catch-all (non-API) ----
// Works without the "*" path-to-regexp crash.
// If someone requests /index.html or /admin.html it will be served by static().
// Anything else non-API -> send login.html (you can switch to index.html if you want).
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "login.html"));
});

// error handler LAST
app.use(errorHandler);

module.exports = app;
