const {
  register,
  login,
  user,
  volunteers,
  contacts,
} = require("../controllers/usersController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/user", protect, user);
router.get("/volunteers", protect, volunteers);
router.get("/contacts", protect, contacts);

module.exports = router;
