const { body, param } = require("express-validator");

exports.registerRules = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters."),
  body("email").trim().isEmail().normalizeEmail().withMessage("Enter a valid email."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  body("role").optional().isIn(["candidate", "recruiter"]).withMessage("Role must be candidate or recruiter.")
];

exports.loginRules = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").notEmpty()
];

exports.jobRules = [
  body("title").trim().isLength({ min: 3, max: 120 }),
  body("company").trim().isLength({ min: 2, max: 100 }),
  body("location").trim().isLength({ min: 2, max: 100 }),
  body("type").optional().isIn(["Internship", "Full-time", "Part-time", "Contract"]),
  body("workMode").optional().isIn(["Remote", "On-site", "Hybrid"]),
  body("description").trim().isLength({ min: 10, max: 5000 }),
  body("skills").optional().isArray({ max: 30 })
];

exports.jobUpdateRules = [
  body("title").optional().trim().isLength({ min: 3, max: 120 }),
  body("company").optional().trim().isLength({ min: 2, max: 100 }),
  body("location").optional().trim().isLength({ min: 2, max: 100 }),
  body("type").optional().isIn(["Internship", "Full-time", "Part-time", "Contract"]),
  body("workMode").optional().isIn(["Remote", "On-site", "Hybrid"]),
  body("description").optional().trim().isLength({ min: 10, max: 5000 }),
  body("skills").optional().isArray({ max: 30 })
];

exports.idRule = [param("id").isMongoId().withMessage("Invalid ID.")];
