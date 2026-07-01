import { Router } from "express";
import { validateQuery } from "../middleware/validate";
import { conjunctionsQuery, elongationsQuery } from "../schemas/events";
import { sunRelativeEvents, planetPairConjunctions, greatestElongations } from "../lib/events";
import { ok } from "../lib/format";

export const events = Router();

events.get("/conjunctions", validateQuery(conjunctionsQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { from?: Date; to?: Date };
    const from = q.from ?? new Date();
    const to = q.to ?? new Date(from.getTime() + 365 * 86400000);
    // cap span at 5 years
    const capped = new Date(Math.min(to.getTime(), from.getTime() + 5 * 365 * 86400000));
    const all = [...planetPairConjunctions(from, capped), ...sunRelativeEvents(from, capped)]
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
    res.json(ok({ from: from.toISOString(), to: capped.toISOString(), events: all }));
  } catch (e) { next(e); }
});

events.get("/elongations", validateQuery(elongationsQuery), (_req, res, next) => {
  try {
    const q = res.locals.query as { after?: Date; count?: number };
    res.json(ok({ elongations: greatestElongations(q.after ?? new Date(), q.count ?? 3) }));
  } catch (e) { next(e); }
});
