const {
  register,
  login,
  user,
  volunteers,
  allVolunteers,
} = require("../controllers/usersController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/user", protect, user);
router.get("/volunteers", protect, volunteers);
router.get("/volunteerslist", protect, allVolunteers);

module.exports = router;
