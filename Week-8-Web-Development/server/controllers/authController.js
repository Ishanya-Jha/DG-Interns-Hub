const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

function issueToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: "Email is already registered." });

  // Public registration intentionally cannot create admin accounts.
  const user = await User.create({ name, email, password, role: role || "candidate" });
  const safeUser = await User.findById(user._id).select("-password");
  sendSuccess(res, { status: 201, message: "Account created.", data: { user: safeUser, token: issueToken(user) } });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !user.isActive || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }
  const safeUser = await User.findById(user._id).select("-password");
  sendSuccess(res, { message: "Login successful.", data: { user: safeUser, token: issueToken(user) } });
});

exports.me = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { user: req.user } });
});

exports.logout = (req, res) => {
  // JWT access tokens are stateless. The client must discard its token.
  sendSuccess(res, { message: "Logged out. Discard the access token on the client." });
};
