const request = require("supertest");

const BASE_URL = process.env.TEST_URL || "http://localhost:5000";

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "TestPass123",
  };

  it("should register a new user", async () => {
    const res = await request(BASE_URL).post("/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("id");
  });

  it("should login with valid credentials", async () => {
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject invalid credentials", async () => {
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({ email: testUser.email, password: "wrong" });
    expect(res.status).toBe(400);
  });
});
