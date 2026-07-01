import { describe, it, expect } from "vitest";
import { geoEcliptic } from "../src/lib/ephemeris";

describe("ephemeris", () => {
  it("computes Sun tropical longitude at J2000", () => {
    const { lon } = geoEcliptic("sun", new Date("2000-01-01T12:00:00Z"));
    expect(lon).toBeGreaterThan(279.5);
    expect(lon).toBeLessThan(281);
  });
});
