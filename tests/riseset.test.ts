import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("riseset", () => {
  it("returns rise/set/transit for the Sun at a mid-latitude", async () => {
    const res = await request(buildApp())
      .get("/v1/riseset?body=sun&lat=23.8&lon=90.4&datetime=2024-06-21T00:00:00Z");
    expect(res.status).toBe(200);
    const day = res.body.data.events[0];
    expect(day.rise).toMatch(/2024-06-2\dT/);
    expect(day.set).not.toBeNull();
    expect(day.transitAltitude).toBeGreaterThan(0);
    expect(day.status).toBe("normal");
  });
  it("flags circumpolar Sun (alwaysUp) at the North Pole in June", async () => {
    const res = await request(buildApp())
      .get("/v1/riseset?body=sun&lat=89.9&lon=0&datetime=2024-06-21T00:00:00Z");
    expect(res.body.data.events[0].status).toBe("alwaysUp");
    expect(res.body.data.events[0].rise).toBeNull();
  });
});
