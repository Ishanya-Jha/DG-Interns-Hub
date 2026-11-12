const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120, index: "text" },
  company: { type: String, required: true, trim: true, maxlength: 100, index: "text" },
  location: { type: String, required: true, trim: true, maxlength: 100, index: true },
  type: { type: String, enum: ["Internship", "Full-time", "Part-time", "Contract"], default: "Internship", index: true },
  workMode: { type: String, enum: ["Remote", "On-site", "Hybrid"], default: "Remote", index: true },
  description: { type: String, required: true, maxlength: 5000 },
  skills: [{ type: String, trim: true, maxlength: 40 }],
  salary: { type: String, trim: true, maxlength: 80, default: "Not disclosed" },
  deadline: { type: Date, default: null, index: true },
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

jobSchema.index({ title: "text", company: "text", location: "text", skills: "text" });
jobSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
