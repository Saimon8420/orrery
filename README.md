# Orrery — Astronomy API

A **free, public, no-key REST API** for computational astronomy: geocentric positions for the Sun, Moon, and eight planets; rise/set and twilight times; lunar phases; solar and lunar eclipses (global and local-visibility); the equinoxes and solstices; and conjunction/elongation events.

Powered by [`astronomy-engine`](https://github.com/cosinekitty/astronomy-engine) (high-precision ephemeris). 100% deterministic computation — no API keys, no live data feeds, no tracking.

---

## Base URL

```
https://<your-deployment>/v1
```

Interactive API docs (Scalar) are served at the site root `/`. The machine-readable OpenAPI 3.1 spec is at `/openapi.json`.

---

## Quick start

```bash
curl "https://<your-deployment>/v1/eclipses/solar?after=2024-04-01T00:00:00Z"
```

Returns the next solar eclipse on or after that instant, including its type, path, and peak time.

---

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/v1/positions` | Positions of all 10 bodies at an instant |
| GET | `/v1/positions/:body` | Position of a single body |
| GET | `/v1/riseset` | Rise, set, and transit times for one or all bodies |
| GET | `/v1/twilight` | Civil, nautical, and astronomical twilight times |
| GET | `/v1/moon` | Moon position, phase, illumination, distance |
| GET | `/v1/moon/phases` | Upcoming (or a given year's) primary Moon phases |
| GET | `/v1/eclipses/solar` | Upcoming global solar eclipses |
| GET | `/v1/eclipses/solar/local` | Upcoming solar eclipses visible from a location |
| GET | `/v1/eclipses/lunar` | Upcoming lunar eclipses |
| GET | `/v1/seasons` | Equinoxes and solstices for a year |
| GET | `/v1/events/conjunctions` | Planet-pair conjunctions and Sun-relative events in a window |
| GET | `/v1/events/elongations` | Greatest elongations of Mercury and Venus |
| GET | `/v1/reference/bodies` | List all 10 supported bodies |
| GET | `/v1/reference/bodies/:body` | Reference data for one body |
| GET | `/v1/meta` | Service metadata and the endpoint list |
| GET | `/v1/health` | Health check |

Bodies: `sun`, `moon`, `mercury`, `venus`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`, `pluto`.

### Response envelope

```json
{ "data": { … } }
```

Errors: `{ "error": { "code": "...", "message": "...", "details": [...] } }`.

---

## Conventions

- **Frame** — geocentric, tropical/equatorial **true-of-date** (not J2000). Positions reflect precession and nutation as of the requested instant.
- **Units** — angles in decimal degrees, distances in AU, all timestamps UTC ISO 8601.
- **Year range** — `year` and `datetime` parameters are valid for calendar years **1700–2200**.
- **Location** — `lat`/`lon` in decimal degrees, `elevation` in meters above sea level. Endpoints that depend on an observer (`riseset`, `twilight`, `eclipses/solar/local`) require them; others accept them optionally to return topocentric positions.
- **Conjunction/opposition events** — `separationDeg` on `/v1/events/conjunctions` is the **ecliptic-longitude separation** between the two bodies (the standard almanac convention: 0° at conjunction, 180° at opposition), not the full 3D apparent elongation.

---

## Rate limiting

60 requests/IP/minute by default (`RATE_LIMIT_PER_MINUTE`). Uses Upstash Redis in production (shared across serverless instances) and an in-memory fallback locally. The limiter **fails open** — an Upstash outage or exhausted quota never breaks the API.

### Environment variables (all optional)

```
UPSTASH_REDIS_REST_URL=     # distributed rate limiting (omit → in-memory, fail-open)
UPSTASH_REDIS_REST_TOKEN=
RATE_LIMIT_PER_MINUTE=60
```

---

## Tech stack

- **Node 20 · Express 5 · TypeScript** (compiled to CommonJS).
- **astronomy-engine** — ephemeris.
- **zod** — request validation. **luxon** — timezone-aware datetime parsing.
- **@upstash/ratelimit** + **@upstash/redis** — distributed rate limiting (sliding window, **fail-open**).
- **esbuild** — single-file serverless bundle. **vitest** + **supertest** — tests.
- **Scalar** — interactive docs. **OpenAPI 3.1** spec.

## Local development

```bash
npm install
npm run dev        # tsx watch, http://localhost:4000
npm test           # vitest
npm run build      # tsc → dist/
npm run bundle      # esbuild → serverless bundle
```

---

## Attribution

Computation is powered by [`astronomy-engine`](https://github.com/cosinekitty/astronomy-engine) by Don Cross, MIT licensed.

## License

MIT.
