import { Router } from "express";
import { BODY_KEYS } from "../lib/bodies";
import { ok } from "../lib/format";

export const meta = Router();

meta.get("/", (_req, res) => {
  res.json(ok({
    service: "Orrery",
    description: "Free public Astronomy Pro API — positions, rise/set, eclipses, seasons, conjunctions.",
    version: "1.0.0",
    engine: "astronomy-engine",
    bodies: BODY_KEYS,
    frame: "geocentric, tropical/equatorial true-of-date",
    yearRange: { min: 1700, max: 2200 },
    attribution: "Powered by astronomy-engine (Don Cross, MIT).",
    endpoints: [
      "/v1/positions", "/v1/positions/{body}",
      "/v1/riseset", "/v1/twilight",
      "/v1/moon", "/v1/moon/phases",
      "/v1/eclipses/solar", "/v1/eclipses/solar/local", "/v1/eclipses/lunar",
      "/v1/seasons", "/v1/events/conjunctions", "/v1/events/elongations",
      "/v1/reference/bodies", "/v1/reference/bodies/{body}", "/v1/meta", "/v1/health",
    ],
  }));
});
