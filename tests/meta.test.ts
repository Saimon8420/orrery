import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("meta + docs", () => {
  it("returns service metadata with all endpoints", async () => {
    const res = await request(buildApp()).get("/v1/meta");
    expect(res.status).toBe(200);
    expect(res.body.data.bodies).toHaveLength(10);
    expect(res.body.data.endpoints).toContain("/v1/eclipses/solar/local");
    expect(JSON.stringify(res.body.data)).not.toMatch(/coming soon|v2/i);
  });
  it("serves the OpenAPI document", async () => {
    const res = await request(buildApp()).get("/openapi.json");
    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
  });
});
