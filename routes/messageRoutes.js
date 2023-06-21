const {
  addMessage,
  getAllMessage,
} = require("../controllers/messagesController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;
