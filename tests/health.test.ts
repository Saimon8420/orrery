import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("health", () => {
  it("returns ok", async () => {
    const res = await request(buildApp()).get("/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
  });
});
