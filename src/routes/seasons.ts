import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { seasonsQuery } from "../schemas/seasons";
import { computeSeasons } from "../lib/seasons";
import { ok } from "../lib/format";

export const seasons = Router();

seasons.get("/", validateQuery(seasonsQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { year?: number };
    const year = q.year ?? new Date().getUTCFullYear();
    res.json(ok(computeSeasons(year)));
  } catch (e) { next(e); }
});
