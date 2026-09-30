require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;


// Connect database
connectDB();


// Middleware
app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Week 6 Authentication API is running"
    });
});


// Authentication routes
app.use("/api/auth", authRoutes);


// Protected dashboard route
app.get("/api/dashboard", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Dashboard access granted",
            user
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});