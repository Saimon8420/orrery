import { Router } from "express";
import { reference } from "./reference";
import { positions } from "./positions";
import { riseset } from "./riseset";
import { twilight } from "./twilight";
import { moon } from "./moon";
import { eclipses } from "./eclipses";
import { seasons } from "./seasons";
import { events } from "./events";
import { meta } from "./meta";

export const api = Router();

api.get("/health", (_req, res) => {
  res.json({ data: { status: "ok", service: "orrery" } });
});

api.use("/reference", reference);
api.use("/positions", positions);
api.use("/riseset", riseset);
api.use("/twilight", twilight);
api.use("/moon", moon);
api.use("/eclipses", eclipses);
api.use("/seasons", seasons);
api.use("/events", events);
api.use("/meta", meta);
