const Application = require("../models/Application");
const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

exports.apply = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.body.jobId, isActive: true });
  if (!job) return res.status(404).json({ success: false, message: "Job not found." });
  if (req.user.role !== "candidate") return res.status(403).json({ success: false, message: "Only candidates can apply." });

  const application = await Application.create({
    job: job._id, applicant: req.user._id, coverLetter: req.body.coverLetter || ""
  });
  sendSuccess(res, { status: 201, message: "Application submitted.", data: { application } });
});

exports.myApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .sort({ createdAt: -1 }).populate("job");
  sendSuccess(res, { data: { applications } });
});

exports.getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate("job").populate("applicant", "name email");
  if (!application) return res.status(404).json({ success: false, message: "Application not found." });
  const owns = application.applicant._id.toString() === req.user._id.toString();
  const ownsJob = application.job && application.job.createdBy.toString() === req.user._id.toString();
  if (!owns && !ownsJob && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied." });
  }
  sendSuccess(res, { data: { application } });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) return res.status(404).json({ success: false, message: "Application not found." });
  const ownsJob = application.job.createdBy.toString() === req.user._id.toString();
  if (!ownsJob && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Access denied." });
  application.status = req.body.status;
  await application.save();
  sendSuccess(res, { message: "Application status updated.", data: { application } });
});

exports.deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ success: false, message: "Application not found." });
  if (application.applicant.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "You can only withdraw your own application." });
  }
  await application.deleteOne();
  sendSuccess(res, { message: "Application withdrawn." });
});
