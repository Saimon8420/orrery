import express from "express";
import path from "node:path";
import { api } from "./routes";
import { rateLimit } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { docsRouter } from "./openapi/docs";

export function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use("/v1", rateLimit, api);

  // OpenAPI spec at /openapi.json; the docs page itself is served as a static
  // file (public/index.html + public/scalar.js) so it never depends on the
  // serverless function. On Vercel /public is served automatically; this
  // covers local dev.
  app.use(docsRouter);
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use(errorHandler);
  return app;
}
