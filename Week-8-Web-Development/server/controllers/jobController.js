const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

exports.listJobs = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const filter = { isActive: true };

  if (req.query.type) filter.type = req.query.type;
  if (req.query.workMode) filter.workMode = req.query.workMode;
  if (req.query.location) filter.location = new RegExp(req.query.location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (req.query.skill) filter.skills = { $in: [new RegExp(req.query.skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")] };

  if (req.query.search) {
    const safe = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = ["title", "company", "description", "location", "skills"].map((field) => ({ [field]: new RegExp(safe, "i") }));
  }

  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, deadline: { deadline: 1, createdAt: -1 } };
  const sort = sortMap[req.query.sort] || sortMap.newest;
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).populate("createdBy", "name"),
    Job.countDocuments(filter)
  ]);

  sendSuccess(res, {
    data: { jobs },
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, isActive: true }).populate("createdBy", "name");
  if (!job) return res.status(404).json({ success: false, message: "Job not found." });
  sendSuccess(res, { data: { job } });
});

exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, createdBy: req.user._id });
  sendSuccess(res, { status: 201, message: "Job created.", data: { job } });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || !job.isActive) return res.status(404).json({ success: false, message: "Job not found." });
  if (req.user.role !== "admin" && job.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only update jobs you created." });
  }
  const allowed = ["title", "company", "location", "type", "workMode", "description", "skills", "salary", "deadline", "isActive"];
  for (const key of allowed) if (req.body[key] !== undefined) job[key] = req.body[key];
  await job.save();
  sendSuccess(res, { message: "Job updated.", data: { job } });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || !job.isActive) return res.status(404).json({ success: false, message: "Job not found." });
  if (req.user.role !== "admin" && job.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only delete jobs you created." });
  }
  job.isActive = false;
  await job.save();
  sendSuccess(res, { message: "Job archived." });
});
