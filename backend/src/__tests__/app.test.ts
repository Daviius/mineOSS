process.env.NODE_ENV = "test";

import request from "supertest";
import { app } from "../app";

describe("app", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
