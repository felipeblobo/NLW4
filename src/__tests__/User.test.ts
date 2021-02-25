import request from "supertest";
import { app } from "../app";

import createConnection from "../database";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  it("Should be able to create a new User", async() => {
    const response = await request(app).post("/users").send({
        email: "user@example.com",
        name: "User Example",
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a User with an existent email", async() => {
    const response = await request(app).post("/users").send({
        email: "user@example.com",
        name: "Fulano de Tal",
    });

    expect(response.status).toBe(400);
  })
});
