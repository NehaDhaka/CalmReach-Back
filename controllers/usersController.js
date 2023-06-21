const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");

const register = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    tagOption: Joi.string().required(),
    userRole: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const { name, email, password, tagOption, userRole } = req.body;

  const existingUser = await knex("user")
    .select()
    .where("email", email)
    .first();

  if (existingUser) {
    return res.json({
      message:
        "An account with this email address already exists. Consider signing in.",
      status: false,
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    name: name,
    email: email,
    password: hashedPassword,
    tag: tagOption,
    user_role: userRole,
  };

  knex("user")
    .insert(user)
    .then(async (result) => {
      return await knex("user")
        .select("id", "name", "email")
        .where("id", result[0])
        .first();
    })
    .then((createdUser) => {
      const userData = {
        _id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        token: generateToken(createdUser.id, createdUser.user_role),
      };

      res.status(201).json({ userData });
    })
    .catch((err) => {
      res.status(500).send("Unable to create new user /n" + err);
    });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await knex("user")
    .select()
    .where("email", email)
    .first();

  if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
    res.json({
      _id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      token: generateToken(existingUser.id, existingUser.user_role),
    });
  } else {
    return res.json({
      message: "Invalid Credentials.",
      status: false,
    });
  }
});

const user = asyncHandler(async (req, res) => {
  const { id, name, email, user_role, tag } = await knex("user")
    .select()
    .where("id", req.user.id)
    .first();
  res.status(200).json({
    id,
    name,
    email,
    user_role,
    tag,
  });
});

const volunteers = asyncHandler(async (req, res) => {
  const userTag = await knex("user")
    .select("tag")
    .where("id", req.user.id)
    .first();

  const volunteerList = await knex("user")
    .select("id", "name", "tag")
    .where("user_role", "volunteer")
    .andWhere("tag", userTag.tag);

  res.json(volunteerList);
});

const allVolunteers = asyncHandler(async (req, res) => {
  const volunteerList = await knex("user").select("id", "name");

  res.json(volunteerList);
});

const generateToken = (id, userRole) => {
  return jwt.sign({ id, userRole }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  register,
  login,
  user,
  volunteers,
  allVolunteers,
};
