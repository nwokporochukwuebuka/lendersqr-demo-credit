import supertest from "supertest";
import db from "../../db/knex";
import App from "../../app";

const app = new App();

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

const userLogin = {
  email: "test.user1@gmail.com",
  password: "123Strong!",
};

const newUser = {
  firstName: "John",
  lastName: "Doe",
  pin: "1234",
  ...userLogin,
};
let TOKEN = "";
let userWalletId = "";
let receiverWalletId = "";

describe("baseURL health check", () => {
  it("should return a 200", async () => {
    await supertest(app.app).get("/").expect(200);
  });
});

describe("successful user signup", () => {
  it("should return a user", async () => {
    const response = await supertest(app.app)
      .post("/api/v1/auth/register")
      .send(newUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
    expect(response.body.status).toEqual(true);
    expect(response.body.data.user.email).toEqual(newUser.email);

    userWalletId = response.body.data.wallet.id;
  });
});

describe("Failed user signup with existing email", () => {
  it("should return a 400", async () => {
    const response = await supertest(app.app)
      .post("/api/v1/auth/register")
      .send(newUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual(false);
  });
});

describe("successful user login", () => {
  it("should return a token", async () => {
    const response = await supertest(app.app)
      .post("/api/v1/auth/login")
      .send(userLogin)
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(true);

    TOKEN = response.body.data.token.access;
  });
});

describe("failed user login", () => {
  it("should return a 401 response with incorrect email or password", async () => {
    userLogin.password = "Einstein2@";

    const response = await supertest(app.app)
      .post("/api/v1/auth/login")
      .send(userLogin)
      .set("Accept", "application/json");

    expect(response.status).toEqual(401);
    expect(response.body.status).toEqual(false);
  });
});

describe("get wallets of users", () => {
  it("should return all wallets successfully", async () => {
    const response = await supertest(app.app)
      .get("/api/v1/wallets")
      .auth(TOKEN, { type: "bearer" });

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(true);
    expect(response.body.data).toBeInstanceOf(Array);

    const receiverWallet = response.body.data.find(
      (wallet: any) => wallet.id !== userWalletId
    );

    receiverWalletId = receiverWallet.id;
  });
});

describe("fund user wallet", () => {
  it("should credit a user's wallet", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/fund`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({ amount: 5000 });

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(true);
  });
});

describe("successful wallet withdrawal", () => {
  it("should debit a user's wallet", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/withdraw`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({ pin: newUser.pin, amount: 1000 });

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(true);
  });
});

describe("failed wallet withdrawal", () => {
  it("should fail to debit a user's wallet due to insufficient balance", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/withdraw`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({ pin: newUser.pin, amount: 7000 });

    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual(false);
  });
});

describe("failed wallet withdrawal", () => {
  it("should fail to debit a user's wallet due to incorrect pin", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/withdraw`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({ pin: "0000", amount: 7000 });

    expect(response.status).toEqual(403);
    expect(response.body.status).toEqual(false);
  });
});

describe("successful wallet transfer", () => {
  it("should transfer to another user", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/transfer`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({ pin: newUser.pin, amount: 1000, receiverWalletId });

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(true);
  });
});

describe("failed wallet transfer", () => {
  it("should fail to transfer due to insufficient balance", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/transfer`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({ pin: newUser.pin, amount: 7000, receiverWalletId });

    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual(false);
  });
});

describe("failed wallet transfer", () => {
  it("should fail to transfer user's wallet", async () => {
    const response = await supertest(app.app)
      .post(`/api/v1/wallets/transfer`)
      .auth(TOKEN, { type: "bearer" })
      .set("Accept", "application/json")
      .send({
        pin: newUser.pin,
        amount: 7000,
        receiverWalletId: userWalletId,
      });

    expect(response.status).toEqual(400);
    expect(response.body.status).toEqual(false);
  });
});
