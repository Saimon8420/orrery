import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { moonQuery, phasesQuery } from "../schemas/moon";
import { makeObserver } from "../lib/ephemeris";
import { computeMoon, upcomingPhases } from "../lib/moon";
import { ok } from "../lib/format";

export const moon = Router();

moon.get("/", validateQuery(moonQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { datetime?: Date; lat?: number; lon?: number; elevation?: number };
    const date = q.datetime ?? new Date();
    const obs = q.lat !== undefined ? makeObserver(q.lat, q.lon!, q.elevation ?? 0) : undefined;
    res.json(ok(computeMoon(date, obs)));
  } catch (e) { next(e); }
});

moon.get("/phases", validateQuery(phasesQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { datetime?: Date; count?: number; year?: number };
    if (q.year !== undefined) {
      const from = new Date(Date.UTC(q.year, 0, 1));
      const all = upcomingPhases(from, 60).filter((e) => new Date(e.datetime).getUTCFullYear() === q.year);
      res.json(ok({ year: q.year, phases: all }));
      return;
    }
    const from = q.datetime ?? new Date();
    res.json(ok({ phases: upcomingPhases(from, q.count ?? 4) }));
  } catch (e) { next(e); }
});
