const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");

const register = asyncHandler(async (req, res, next) => {
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
        token: generateToken(createdUser.id),
      };

      res.status(201).json({ userData });
    })
    .catch((err) => {
      res.status(500).send("Unable to create new user /n" + err);
    });
});

const login = asyncHandler(async (req, res, next) => {
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
      token: generateToken(existingUser.id),
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

const getMe = asyncHandler(async (req, res, next) => {
  const { id, name, email } = await knex("user")
    .select()
    .where("id", req.user.id)
    .first();
  res.status(200).json({
    id,
    name,
    email,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  register,
  login,
  getMe,
};
