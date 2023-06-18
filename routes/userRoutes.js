const { register, login, getMe } = require("../controllers/usersController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
