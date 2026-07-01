import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("sky events", () => {
  it("lists greatest elongations for Mercury and Venus", async () => {
    const res = await request(buildApp()).get("/v1/events/elongations?after=2025-01-01T00:00:00Z&count=2");
    expect(res.status).toBe(200);
    const bodies = res.body.data.elongations.map((e: any) => e.body);
    expect(bodies).toContain("venus");
    expect(res.body.data.elongations[0].maxElongationDeg).toBeGreaterThan(0);
  });
  it("includes a Mars opposition in early 2025", async () => {
    const res = await request(buildApp())
      .get("/v1/events/conjunctions?from=2025-01-01T00:00:00Z&to=2025-02-01T00:00:00Z");
    expect(res.status).toBe(200);
    const mars = res.body.data.events.find((e: any) => e.type === "opposition" && e.bodies.includes("mars"));
    expect(mars).toBeTruthy();
    expect(mars.datetime.startsWith("2025-01-16")).toBe(true);
  });
});
