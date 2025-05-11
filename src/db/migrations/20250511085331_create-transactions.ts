import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table: Knex.TableBuilder) => {
    table.uuid("id").primary();
    table
      .uuid("walletId")
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table
      .uuid("receiverWalletId")
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table.enum("type", ["deposit", "withdrawal", "transfer"]).notNullable();
    table.decimal("amount", 18, 2).notNullable();
    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}
