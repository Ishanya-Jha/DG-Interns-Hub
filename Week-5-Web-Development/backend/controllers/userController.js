const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        console.error("Profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-passwordHash")
            .sort({ createdAt: -1 });

        res.json({
            message: "Users fetched successfully",
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get users error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getProfile,
    getAllUsers,
    deleteUser
};