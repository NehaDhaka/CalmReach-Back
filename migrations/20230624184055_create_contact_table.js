/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("contact", (table) => {
    table.increments("id").primary();
    table
      .integer("volunteer_id")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("seeker_id")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE")
      .notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("contact");
};
