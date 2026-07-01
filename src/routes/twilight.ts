import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { twilightQuery } from "../schemas/twilight";
import { makeObserver } from "../lib/ephemeris";
import { computeTwilight } from "../lib/twilight";
import { ok } from "../lib/format";

export const twilight = Router();

twilight.get("/", validateQuery(twilightQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { datetime?: Date; lat: number; lon: number; elevation?: number };
    const base = q.datetime ?? new Date();
    const start = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()));
    const obs = makeObserver(q.lat, q.lon, q.elevation ?? 0);
    res.json(ok({ location: { lat: q.lat, lon: q.lon }, ...computeTwilight(obs, start) }));
  } catch (e) { next(e); }
});
