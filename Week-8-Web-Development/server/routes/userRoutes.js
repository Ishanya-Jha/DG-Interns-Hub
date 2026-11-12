const router = require("express").Router();
const controller = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);
router.delete("/profile", controller.deleteProfile);

module.exports = router;
