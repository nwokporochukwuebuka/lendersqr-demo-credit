import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.uuid("id").primary();
    table.string("email").notNullable().unique();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("password").notNullable();
    table.string("tranxPin");
    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
