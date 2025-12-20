const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const taskRoutes = require("./routes/taskRoutes.js");
const authRoutes = require("./routes/authRoutes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Parse JSON
app.use(express.json());

// Logging + security headers
app.use(logger);
app.use(helmet());

// CORS (must be BEFORE routes)
app.use(
  cors({
    origin: [
      "http://192.168.28.158:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler should be LAST
app.use(errorHandler);

module.exports = app;
