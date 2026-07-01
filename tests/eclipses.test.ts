import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("eclipses", () => {
  it("finds the 2024-04-08 total solar eclipse", async () => {
    const res = await request(buildApp()).get("/v1/eclipses/solar?after=2024-04-01T00:00:00Z&count=1");
    expect(res.status).toBe(200);
    const e = res.body.data.eclipses[0];
    expect(e.kind.toLowerCase()).toBe("total");
    expect(e.peak.startsWith("2024-04-08")).toBe(true);
    expect(e.greatestEclipse.lat).toBeTypeOf("number");
  });
  it("finds a lunar eclipse and returns timings", async () => {
    const res = await request(buildApp()).get("/v1/eclipses/lunar?after=2025-03-01T00:00:00Z&count=1");
    const e = res.body.data.eclipses[0];
    expect(e.peak.startsWith("2025-03-14")).toBe(true);
    expect(["total", "partial", "penumbral"]).toContain(e.kind.toLowerCase());
    expect(typeof e.obscuration).toBe("number");
  });
  it("computes local circumstances for a location", async () => {
    const res = await request(buildApp())
      .get("/v1/eclipses/solar/local?after=2024-04-01T00:00:00Z&lat=30.5&lon=-97.7&count=1");
    expect(res.status).toBe(200);
    expect(res.body.data.eclipses[0].peak.time).toBeTypeOf("string");
  });
});
