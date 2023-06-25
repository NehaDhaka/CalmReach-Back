const knex = require("knex")(require("../knexfile"));
const asyncHandler = require("express-async-handler");

const addContact = asyncHandler(async (req, res) => {
  const { seeker, volunteer } = req.body;
  const data = {
    volunteer_id: volunteer,
    seeker_id: seeker,
  };

  const existingRecord = await knex("contact")
    .where({ volunteer_id: volunteer, seeker_id: seeker })
    .first();

  if (existingRecord) {
    return res.json({ message: "Contact already exists.", status: false });
  } else {
    await knex("contact").insert(data);
    return res.json({ message: "Contact added successfully." });
  }
});

const getContactVolunteers = asyncHandler(async (req, res) => {
  const contactList = await knex("contact")
    .select("contact.volunteer_id", "user.name")
    .join("user", "contact.volunteer_id", "=", "user.id")
    .where("contact.seeker_id", req.body.seeker);

  const data = [];
  for (let i = 0; i < contactList.length; i++) {
    data.push({
      id: contactList[i].volunteer_id,
      name: contactList[i].name,
    });
  }

  res.json(data);
});

const getContactSeekers = asyncHandler(async (req, res) => {
  const contactList = await knex("contact")
    .select("contact.seeker_id", "user.name")
    .join("user", "contact.seeker_id", "=", "user.id")
    .where("contact.volunteer_id", req.body.volunteer);

  const data = [];
  for (let i = 0; i < contactList.length; i++) {
    data.push({
      id: contactList[i].seeker_id,
      name: contactList[i].name,
    });
  }

  res.json(data);
});
module.exports = {
  addContact,
  getContactSeekers,
  getContactVolunteers,
};
