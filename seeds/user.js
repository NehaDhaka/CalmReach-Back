/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user").del();
  await knex("user").insert([
    {
      name: "Neha Dhaka",
      email: "nehadhaka43@gmail.com",
      password: "password0508",
      tag: "Stress Management",
      user_role: "volunteer",
    },
    {
      name: "Uttam Dhaka",
      email: "uttamdhaka2002@gmail.com",
      password: "password0506",
      tag: "Stress Management",
      user_role: "seeker",
    },
    {
      name: "Karuna Dhaka",
      email: "karunadhaka1979@gmail.com",
      password: "password0310",
      tag: "Stress Management",
      user_role: "seeker",
    },
  ]);
};
