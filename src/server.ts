import { buildApp } from "./app";

const port = Number(process.env.PORT ?? 4000);
buildApp().listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Orrery listening on http://localhost:${port}`);
});
