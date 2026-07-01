import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("reference", () => {
  it("lists all 10 bodies", async () => {
    const res = await request(buildApp()).get("/v1/reference/bodies");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
  });
  it("400s on unknown body with valid list", async () => {
    const res = await request(buildApp()).get("/v1/reference/bodies/vulcan");
    expect(res.status).toBe(400);
    expect(res.body.error.details.validBodies).toContain("mars");
  });
});
