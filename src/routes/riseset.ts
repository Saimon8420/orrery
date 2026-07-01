import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { risesetQuery } from "../schemas/riseset";
import { BODY_KEYS, assertBody } from "../lib/bodies";
import { makeObserver } from "../lib/ephemeris";
import { computeRiseSet } from "../lib/riseset";
import { ok } from "../lib/format";

export const riseset = Router();

riseset.get("/", validateQuery(risesetQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as {
      datetime?: Date; lat: number; lon: number; elevation?: number; body?: string; days?: number;
    };
    const obs = makeObserver(q.lat, q.lon, q.elevation ?? 0);
    const keys = q.body ? [assertBody(q.body)] : BODY_KEYS;
    const days = q.days ?? 1;
    const base = q.datetime ?? new Date();
    const start = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()));

    const results = [];
    for (let d = 0; d < days; d++) {
      const dayStart = new Date(start.getTime() + d * 86400000);
      results.push(...keys.map((k) => computeRiseSet(k, obs, dayStart)));
    }
    res.json(ok({ location: { lat: q.lat, lon: q.lon }, days, events: results }));
  } catch (e) { next(e); }
});
