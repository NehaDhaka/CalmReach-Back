const {
  register,
  login,
  user,
  volunteers,
  allVolunteers,
} = require("../controllers/usersController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/user", protect, user);
router.get("/volunteers", protect, volunteers);
router.get("/volunteerslist", protect, allVolunteers);

module.exports = router;
