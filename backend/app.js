const express = require("express");
const app = express();
const taskRoutes = require("./routes/taskRoutes.js");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const helmet = require("helmet");

app.use(express.json());



app.use(logger);
app.use(errorHandler);
app.use(helmet());



const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);





app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api/tasks", taskRoutes);



module.exports = app;
