require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const authLimiter = require("./middleware/rateLimiter");
const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Allow frontend requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
    res.json({
        message: "SecureAuth Dashboard API is running"
    });
});
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});