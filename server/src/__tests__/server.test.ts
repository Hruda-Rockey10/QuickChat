import request from "supertest";
import { app } from "../index";

describe("Server Smoke Test", () => {
  it("should return 200 OK and welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("QuickChat Server V1 is Running! 🚀");
  });
});
