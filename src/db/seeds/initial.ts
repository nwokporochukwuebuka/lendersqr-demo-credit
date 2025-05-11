import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // // Deletes ALL existing entries
  // await knex("table_name").del();
  // // Inserts seed entries
  // await knex("table_name").insert([
  //     { id: 1, colName: "rowValue1" },
  //     { id: 2, colName: "rowValue2" },
  //     { id: 3, colName: "rowValue3" }
  // ]);
  // Deletes ALL existing entries
  //   await knex("users").del();
  //   await knex("wallets").del();
  //   await knex("transactions").del();
  //   // Inserts seed entries
  //   await knex("users").insert([
  //   ])
}
