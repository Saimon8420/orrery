import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("positions", () => {
  it("returns all bodies with a full position object", async () => {
    const res = await request(buildApp()).get("/v1/positions?datetime=2024-01-01T00:00:00Z");
    expect(res.status).toBe(200);
    expect(res.body.data.bodies).toHaveLength(10);
    const mars = res.body.data.bodies.find((b: any) => b.body === "mars");
    expect(mars.eclipticLongitude).toBeGreaterThanOrEqual(0);
    expect(mars.magnitude).toBeTypeOf("number");
    expect(mars.constellation).toBeTypeOf("string");
    expect(mars.altitude).toBeUndefined();
  });
  it("adds alt/az when a location is given", async () => {
    const res = await request(buildApp())
      .get("/v1/positions/moon?datetime=2024-01-01T00:00:00Z&lat=23.8&lon=90.4");
    expect(res.status).toBe(200);
    expect(res.body.data.position.altitude).toBeTypeOf("number");
    expect(res.body.data.position.aboveHorizon).toBeTypeOf("boolean");
  });
  it("rejects a datetime whose year is outside 1700-2200", async () => {
    const res = await request(buildApp()).get("/v1/positions?datetime=1600-01-01T00:00:00Z");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
