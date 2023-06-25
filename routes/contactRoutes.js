const {
  addContact,
  getContactSeekers,
  getContactVolunteers,
} = require("../controllers/contactsController");
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/addContact", protect, addContact);
router.post("/getVolunteers", protect, getContactVolunteers);
router.post("/getSeekers", protect, getContactSeekers);

module.exports = router;
