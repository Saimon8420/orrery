import { Router } from "express";
import { BODY_KEYS, BODY_REFS, assertBody } from "../lib/bodies";
import { ok } from "../lib/format";

export const reference = Router();

reference.get("/bodies", (_req, res) => {
  res.json(ok(BODY_KEYS.map((k) => BODY_REFS[k])));
});

reference.get("/bodies/:body", (req, res, next) => {
  try {
    const key = assertBody(req.params.body);
    res.json(ok(BODY_REFS[key]));
  } catch (e) {
    next(e);
  }
});
