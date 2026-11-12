const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  coverLetter: { type: String, trim: true, maxlength: 2000, default: "" },
  status: { type: String, enum: ["Pending", "Reviewed", "Shortlisted", "Rejected", "Accepted"], default: "Pending" }
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
