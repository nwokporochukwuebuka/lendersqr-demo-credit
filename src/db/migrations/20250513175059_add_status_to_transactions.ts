import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", (table: Knex.TableBuilder) => {
    table
      .enum("status", ["success", "failed", "pending", "reversed"])
      .notNullable()
      .defaultTo("pending");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", (table: Knex.TableBuilder) => {
    table.dropColumn("status");
  });
}
