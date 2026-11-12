const router = require("express").Router();
const controller = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { registerRules, loginRules } = require("../validators/validators");

router.post("/register", registerRules, validate, controller.register);
router.post("/login", loginRules, validate, controller.login);
router.get("/me", protect, controller.me);
router.post("/logout", protect, controller.logout);

module.exports = router;
