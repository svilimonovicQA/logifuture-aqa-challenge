const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userInfoRoutes = require("./routes/userInfo");
const walletRoutes = require("./routes/wallet");
/**
 * Express server setup with routes for authentication and user operations.
 * @module server
 * @requires routes/auth - Routes related to login operations
 * @requires routes/userInfo - Routes related to user information operations
 * @requires routes/wallet - Routes related to wallet operations
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", authRoutes);
app.use("/user/info", userInfoRoutes);
app.use("/wallet", walletRoutes);

module.exports = app;
