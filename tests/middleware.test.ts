import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("validation + errors", () => {
  it("rejects bad datetime with 400 and error envelope", async () => {
    const res = await request(buildApp()).get("/v1/seasons?year=not-a-year");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 (not 500) on malformed JSON body", async () => {
    const res = await request(buildApp())
      .post("/v1/health")
      .set("Content-Type", "application/json")
      .send('{"bad":');
    expect(res.status).toBe(400);
  });
});
