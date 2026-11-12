const router = require("express").Router();
const controller = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { jobRules, jobUpdateRules, idRule } = require("../validators/validators");

router.get("/", controller.listJobs);
router.get("/:id", idRule, validate, controller.getJob);
router.post("/", protect, allowRoles("recruiter", "admin"), jobRules, validate, controller.createJob);
router.put("/:id", protect, allowRoles("recruiter", "admin"), idRule, jobUpdateRules, validate, controller.updateJob);
router.delete("/:id", protect, allowRoles("recruiter", "admin"), idRule, validate, controller.deleteJob);

module.exports = router;
