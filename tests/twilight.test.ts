import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("twilight", () => {
  it("returns the three twilight bands for a mid-latitude day", async () => {
    const res = await request(buildApp())
      .get("/v1/twilight?lat=23.8&lon=90.4&datetime=2024-03-20T00:00:00Z");
    expect(res.status).toBe(200);
    expect(res.body.data.civil.dawn).not.toBeNull();
    expect(res.body.data.astronomical.dusk).not.toBeNull();
  });
});
