import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../src/app";

describe("seasons", () => {
  it("returns the four 2025 season moments", async () => {
    const res = await request(buildApp()).get("/v1/seasons?year=2025");
    expect(res.status).toBe(200);
    expect(res.body.data.marchEquinox.startsWith("2025-03-20")).toBe(true);
    expect(res.body.data.juneSolstice.startsWith("2025-06-2")).toBe(true);
    expect(res.body.data.decemberSolstice.startsWith("2025-12-2")).toBe(true);
  });
});
