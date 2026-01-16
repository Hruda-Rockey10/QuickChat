import request from "supertest";
import { app, server } from "../index";
import { producer, consumer } from "../config/kafka.config";
import redis from "../config/redis.config";

describe("Server Smoke Test", () => {
  afterAll(async () => {
    // Clean up connections to allow Jest to exit gracefully
    await producer.disconnect();
    await consumer.disconnect();
    redis.disconnect();
    server.close();
  });

  it("should return 200 OK and welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("QuickChat Server V1 is Running! 🚀");
  });
});
