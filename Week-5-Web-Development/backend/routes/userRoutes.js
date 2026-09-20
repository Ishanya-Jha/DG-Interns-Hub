const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getProfile,
    getAllUsers,
    deleteUser
} = require("../controllers/userController");

const router = express.Router();

// Normal authenticated user
router.get("/profile", protect, getProfile);

// Admin-only routes
router.get("/admin/users", protect, adminOnly, getAllUsers);
router.delete("/admin/users/:id", protect, adminOnly, deleteUser);

module.exports = router;