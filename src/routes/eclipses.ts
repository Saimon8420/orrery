import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { eclipseQuery, localEclipseQuery } from "../schemas/eclipses";
import { makeObserver } from "../lib/ephemeris";
import { nextSolarGlobal, nextLunar, solarLocal } from "../lib/eclipses";
import { ok } from "../lib/format";

export const eclipses = Router();

function startFrom(q: { after?: Date; year?: number }): Date {
  if (q.year !== undefined) return new Date(Date.UTC(q.year, 0, 1));
  return q.after ?? new Date();
}
function withinYear<T extends { peak: string }>(rows: T[], year?: number): T[] {
  if (year === undefined) return rows;
  return rows.filter((r) => new Date(r.peak).getUTCFullYear() === year);
}

eclipses.get("/solar/local", validateQuery(localEclipseQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { after?: Date; count?: number; lat: number; lon: number; elevation?: number };
    const obs = makeObserver(q.lat, q.lon, q.elevation ?? 0);
    res.json(ok({ location: { lat: q.lat, lon: q.lon }, eclipses: solarLocal(q.after ?? new Date(), obs, q.count ?? 1) }));
  } catch (e) { next(e); }
});

eclipses.get("/solar", validateQuery(eclipseQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { after?: Date; year?: number; count?: number };
    const count = q.year !== undefined ? 6 : q.count ?? 1;
    const rows = withinYear(nextSolarGlobal(startFrom(q), count), q.year);
    res.json(ok({ eclipses: rows }));
  } catch (e) { next(e); }
});

eclipses.get("/lunar", validateQuery(eclipseQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { after?: Date; year?: number; count?: number };
    const count = q.year !== undefined ? 6 : q.count ?? 1;
    const rows = withinYear(nextLunar(startFrom(q), count), q.year);
    res.json(ok({ eclipses: rows }));
  } catch (e) { next(e); }
});
