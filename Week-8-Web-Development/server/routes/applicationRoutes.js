const router = require("express").Router();
const controller = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { body, param } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware");

router.use(protect);
router.post("/", allowRoles("candidate"), body("jobId").isMongoId(), body("coverLetter").optional().isLength({ max: 2000 }), validate, controller.apply);
router.get("/my", allowRoles("candidate"), controller.myApplications);
router.get("/:id", param("id").isMongoId(), validate, controller.getApplication);
router.put("/:id/status", allowRoles("recruiter", "admin"), param("id").isMongoId(), body("status").isIn(["Reviewed", "Shortlisted", "Rejected", "Accepted"]), validate, controller.updateStatus);
router.delete("/:id", param("id").isMongoId(), validate, controller.deleteApplication);

module.exports = router;
