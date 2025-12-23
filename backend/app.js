const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes.js");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminTaskRoutes = require("./routes/adminTaskRoutes");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(logger);

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    credentials: false,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/tasks", adminTaskRoutes);

// error handler should be LAST
app.use(errorHandler);

module.exports = app;
