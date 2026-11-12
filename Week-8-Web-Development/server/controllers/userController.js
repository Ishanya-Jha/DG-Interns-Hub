const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

exports.getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { user: req.user } });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "location", "bio"];
  const updates = {};
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password");
  sendSuccess(res, { message: "Profile updated.", data: { user } });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  sendSuccess(res, { message: "Account deactivated." });
});
