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

// A ready-built app instance as the default export, so the module works as a
// serverless-function entry point (Vercel requires the default export to be a
// function/server) as well as via buildApp() in tests and local dev.
export const app = buildApp();
export default app;
