const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
/**
 * Routes related to login operations.
 * @module routes/auth
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", authRoutes);

module.exports = app;
