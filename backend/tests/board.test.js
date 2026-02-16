const request = require("supertest");

const BASE_URL = process.env.TEST_URL || "http://localhost:5000";

describe("Board API", () => {
  let token;

  beforeAll(async () => {
    const user = {
      name: "Board Tester",
      email: `boardtest${Date.now()}@example.com`,
      password: "TestPass123",
    };
    await request(BASE_URL).post("/auth/register").send(user);
    const res = await request(BASE_URL)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });
    token = res.body.token;
  });

  it("should create a board", async () => {
    const res = await request(BASE_URL)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Board" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Board");
  });

  it("should list user boards", async () => {
    const res = await request(BASE_URL)
      .get("/boards")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
