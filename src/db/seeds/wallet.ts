import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("wallets").del();

  // Inserts seed entries
  await knex("wallets").insert([
    {
      id: "a70e8be2-f963-40b4-8526-2dd5d3272576",
      userId: "9dbc937c-2d35-413b-8745-eeaa05ab5de7",
      balance: 4500.0,
    },
    {
      id: "436fb696-59f1-4553-ae37-f837f3b1d317",
      userId: "73d79af6-5354-465c-b5c6-e8dcef719d7f",
      balance: 1450.0,
    },
    {
      id: "f391114f-da38-4388-ae76-7ec8ec6d2d68",
      userId: "c9c25e68-49a3-41d1-82e0-7617ac2fd898",
    },
  ]);
}
