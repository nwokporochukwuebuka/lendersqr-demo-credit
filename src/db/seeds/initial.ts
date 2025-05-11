import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  //   // Inserts seed entries
  await knex("users").insert([
    {
      id: "9dbc937c-2d35-413b-8745-eeaa05ab5de7",
      email: "john@gmail.com",
      firstName: "John",
      lastName: "Doe",
      password: "$2a$12$lmawAloytR.wiuUO4S1GF.AwepQV91QmgVMBr81EYvXGUjkk3bLYG", // Einstein2@
      tranxPin: "$2a$14$sPmVIx7Jh9xPfh2EmqHj2OIuiA9E4XVbCmQcF6exn.UrPKHnDhRZC", // 1234
      //   createdAt: "2025-04-28 05:20:00.126",
      //   updatedAt: "2025-04-28 05:20:00.126",
    },
    {
      id: "73d79af6-5354-465c-b5c6-e8dcef719d7f",
      email: "jane@gmail.com",
      firstName: "Jane",
      lastName: "Doe",
      password: "$2a$12$FinCDONocdpTFyHsXis8tuY8ndWwJwhkWbC5YSKrQndRvCrOCilsm", // FileOpen@1234
      tranxPin: "$2a$14$s3QD.jIocmf46/Nu4n3BGuZ7GeHl67lffLd0iHqvyw2Jg3MyYIf0u", // 5678
      //   createdAt: "2025-04-28 06:20:00.126",
      //   updatedAt: "2025-04-28 06:20:00.126",
    },
    {
      id: "c9c25e68-49a3-41d1-82e0-7617ac2fd898",
      email: "joe@gmail.com",
      firstName: "Joe",
      lastName: "Bloggs",
      password: "$2a$12$yLPE7GY5fVxpFSEURjJN/uRVwh77ENP8V2i1hre7jyqqS7iTCa9R2", // JoeBloggs@2
      tranxPin: "$2a$14$cH9hCNZgBPftZ1xLx5tR5.n1l2WoWbuz1evZwRJobaWnwjXWEKkQK", //4567
      //   createdAt: "2025-04-28 07:20:00.126",
      //   updatedAt: "2025-04-28 07:20:00.126",
    },
  ]);
}
