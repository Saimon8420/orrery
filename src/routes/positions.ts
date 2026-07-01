import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { positionsQuery } from "../schemas/positions";
import { BODY_KEYS, assertBody } from "../lib/bodies";
import { computePosition } from "../lib/positions";
import { makeObserver } from "../lib/ephemeris";
import { ok } from "../lib/format";

export const positions = Router();

positions.get("/", validateQuery(positionsQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { datetime?: Date; lat?: number; lon?: number; elevation?: number };
    const date = q.datetime ?? new Date();
    const obs = q.lat !== undefined ? makeObserver(q.lat, q.lon!, q.elevation ?? 0) : undefined;
    res.json(ok({ datetime: date.toISOString(), bodies: BODY_KEYS.map((k) => computePosition(k, date, obs)) }));
  } catch (e) { next(e); }
});

positions.get("/:body", validateQuery(positionsQuery), (req, res, next) => {
  try {
    const key = assertBody(req.params.body as string);
    const q = res.locals.query as { datetime?: Date; lat?: number; lon?: number; elevation?: number };
    const date = q.datetime ?? new Date();
    const obs = q.lat !== undefined ? makeObserver(q.lat, q.lon!, q.elevation ?? 0) : undefined;
    res.json(ok({ datetime: date.toISOString(), position: computePosition(key, date, obs) }));
  } catch (e) { next(e); }
});
