import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("moon", () => {
  it("reports moon detail", async () => {
    const res = await request(buildApp()).get("/v1/moon?datetime=2024-01-25T17:54:00Z");
    expect(res.status).toBe(200);
    expect(res.body.data.phase).toBe("Full");
    expect(res.body.data.illuminatedFraction).toBeGreaterThan(0.99);
    expect(res.body.data.libration.longitude).toBeTypeOf("number");
  });
  it("lists upcoming quarters including a Full Moon", async () => {
    const res = await request(buildApp()).get("/v1/moon/phases?datetime=2024-01-01T00:00:00Z&count=4");
    expect(res.body.data.phases).toHaveLength(4);
    expect(res.body.data.phases.map((p: any) => p.phase)).toContain("Full Moon");
  });
});
