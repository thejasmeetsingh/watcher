import { Knex } from "knex";

const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable("todo", (table) => {
    table
      .uuid("id", {
        primaryKey: true,
      })
      .notNullable()
      .defaultTo(knex.fn.uuid());
    table
      .datetime("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .datetime("modified_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.uuid("user_id").notNullable();
    table.uuid("movie_id").notNullable();
    table.boolean("is_completed").notNullable().defaultTo(false);

    table.unique(["user_id", "movie_id"], {
      indexName: "user_unique_movie",
      useConstraint: true,
    });
  });
};

const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable("todo");
};

export { up, down };
