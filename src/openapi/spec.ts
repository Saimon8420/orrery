/** OpenAPI 3.1 spec for Orrery — served at /openapi.json and rendered by Scalar at /. */

const datetimeParam = {
  name: "datetime",
  in: "query" as const,
  required: false,
  description: "ISO 8601 instant (UTC or with offset). Defaults to now.",
  schema: { type: "string" as const },
  example: "2024-04-08T12:00:00Z",
};

const afterParam = {
  name: "after",
  in: "query" as const,
  required: false,
  description: "ISO 8601 instant to search forward from. Defaults to now.",
  schema: { type: "string" as const },
  example: "2024-04-01T00:00:00Z",
};

const latParam = (required = false) => ({
  name: "lat",
  in: "query" as const,
  required,
  description: "Latitude in decimal degrees (−90..90).",
  schema: { type: "number" as const, minimum: -90, maximum: 90 },
  example: 30.5,
});

const lonParam = (required = false) => ({
  name: "lon",
  in: "query" as const,
  required,
  description: "Longitude in decimal degrees (−180..180).",
  schema: { type: "number" as const, minimum: -180, maximum: 180 },
  example: -97.7,
});

const elevationParam = {
  name: "elevation",
  in: "query" as const,
  required: false,
  description: "Observer elevation in meters above sea level.",
  schema: { type: "number" as const },
  example: 200,
};

const yearParam = {
  name: "year",
  in: "query" as const,
  required: false,
  description: "Calendar year (1700–2200).",
  schema: { type: "integer" as const, minimum: 1700, maximum: 2200 },
  example: 2025,
};

const bodyPathParam = {
  name: "body",
  in: "path" as const,
  required: true,
  description: "One of the 10 supported bodies.",
  schema: {
    type: "string" as const,
    enum: ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"],
  },
  example: "mars",
};

const countParam = (max: number, description = "How many results to return.") => ({
  name: "count",
  in: "query" as const,
  required: false,
  description,
  schema: { type: "integer" as const, minimum: 1, maximum: max },
  example: 1,
});

const okResponse = (description: string) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: { data: { type: "object" } },
      },
    },
  },
});

const errorResponse = {
  description: "Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {},
            },
          },
        },
      },
    },
  },
};

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Orrery API",
    version: "1.0.0",
    description:
      "A free, public, no-key Astronomy API. Geocentric positions for the Sun, Moon, and eight planets; " +
      "rise/set and twilight times; lunar phases; solar and lunar eclipses (global and local-visibility); " +
      "the four seasonal cross-quarter instants; and conjunction/elongation events.\n\n" +
      "**Engine:** astronomy-engine (high-precision ephemeris). **Frame:** geocentric, tropical/equatorial " +
      "true-of-date. **Units:** degrees, AU, UTC ISO 8601 timestamps.",
    license: { name: "MIT" },
  },
  servers: [{ url: "/", description: "This server" }],
  tags: [
    { name: "Positions", description: "Body positions (ecliptic/equatorial/horizontal)" },
    { name: "Rise/Set", description: "Rise, set, and transit times" },
    { name: "Twilight", description: "Civil/nautical/astronomical twilight" },
    { name: "Moon", description: "Moon position and phases" },
    { name: "Eclipses", description: "Solar and lunar eclipses" },
    { name: "Seasons", description: "Equinoxes and solstices" },
    { name: "Events", description: "Conjunctions and greatest elongations" },
    { name: "Reference", description: "Static body reference data" },
    { name: "Meta", description: "Service metadata" },
    { name: "Health", description: "Health check" },
  ],
  paths: {
    "/v1/positions": {
      get: {
        tags: ["Positions"],
        summary: "Positions of all 10 bodies at an instant",
        description: "Returns geocentric (or topocentric, if lat/lon given) positions for the Sun, Moon, and all eight planets.",
        parameters: [datetimeParam, latParam(false), lonParam(false), elevationParam],
        responses: { "200": okResponse("Positions of all bodies"), "400": errorResponse },
      },
    },
    "/v1/positions/{body}": {
      get: {
        tags: ["Positions"],
        summary: "Position of a single body at an instant",
        parameters: [bodyPathParam, datetimeParam, latParam(false), lonParam(false), elevationParam],
        responses: { "200": okResponse("Position of the requested body"), "400": errorResponse },
      },
    },
    "/v1/riseset": {
      get: {
        tags: ["Rise/Set"],
        summary: "Rise, set, and transit times for one or all bodies",
        description: "Requires an observer location. Omit `body` to get rise/set for all 10 bodies. `days` returns multiple consecutive days.",
        parameters: [
          datetimeParam,
          latParam(true),
          lonParam(true),
          elevationParam,
          {
            name: "body",
            in: "query" as const,
            required: false,
            description: "Restrict to a single body. Omit for all bodies.",
            schema: { type: "string" as const },
            example: "mars",
          },
          {
            name: "days",
            in: "query" as const,
            required: false,
            description: "Number of consecutive days to compute (1–30).",
            schema: { type: "integer" as const, minimum: 1, maximum: 30 },
            example: 1,
          },
        ],
        responses: { "200": okResponse("Rise/set/transit events"), "400": errorResponse },
      },
    },
    "/v1/twilight": {
      get: {
        tags: ["Twilight"],
        summary: "Civil, nautical, and astronomical twilight times",
        parameters: [datetimeParam, latParam(true), lonParam(true), elevationParam],
        responses: { "200": okResponse("Twilight times"), "400": errorResponse },
      },
    },
    "/v1/moon": {
      get: {
        tags: ["Moon"],
        summary: "Moon position, phase, illumination, and distance",
        parameters: [datetimeParam, latParam(false), lonParam(false), elevationParam],
        responses: { "200": okResponse("Moon data"), "400": errorResponse },
      },
    },
    "/v1/moon/phases": {
      get: {
        tags: ["Moon"],
        summary: "Upcoming (or a given year's) primary Moon phases",
        parameters: [
          datetimeParam,
          countParam(24, "How many phase events to return."),
          yearParam,
        ],
        responses: { "200": okResponse("Moon phase events"), "400": errorResponse },
      },
    },
    "/v1/eclipses/solar": {
      get: {
        tags: ["Eclipses"],
        summary: "Upcoming global solar eclipses",
        parameters: [afterParam, yearParam, countParam(10)],
        responses: { "200": okResponse("Solar eclipses"), "400": errorResponse },
      },
    },
    "/v1/eclipses/solar/local": {
      get: {
        tags: ["Eclipses"],
        summary: "Upcoming solar eclipses visible from a location",
        parameters: [afterParam, countParam(10), latParam(true), lonParam(true), elevationParam],
        responses: { "200": okResponse("Locally-visible solar eclipses"), "400": errorResponse },
      },
    },
    "/v1/eclipses/lunar": {
      get: {
        tags: ["Eclipses"],
        summary: "Upcoming lunar eclipses",
        parameters: [afterParam, yearParam, countParam(10)],
        responses: { "200": okResponse("Lunar eclipses"), "400": errorResponse },
      },
    },
    "/v1/seasons": {
      get: {
        tags: ["Seasons"],
        summary: "Equinoxes and solstices for a year",
        parameters: [yearParam],
        responses: { "200": okResponse("Season instants"), "400": errorResponse },
      },
    },
    "/v1/events/conjunctions": {
      get: {
        tags: ["Events"],
        summary: "Planet-pair conjunctions and Sun-relative events in a window",
        description:
          "`separationDeg` is the ecliptic-longitude separation between the two bodies (standard almanac " +
          "convention: 0° at conjunction, 180° at opposition), not the full 3D apparent elongation.",
        parameters: [
          {
            name: "from",
            in: "query" as const,
            required: false,
            description: "Start of the search window. Defaults to now.",
            schema: { type: "string" as const },
            example: "2024-04-01T00:00:00Z",
          },
          {
            name: "to",
            in: "query" as const,
            required: false,
            description: "End of the search window (capped at 5 years after `from`).",
            schema: { type: "string" as const },
            example: "2025-04-01T00:00:00Z",
          },
        ],
        responses: { "200": okResponse("Conjunction events"), "400": errorResponse },
      },
    },
    "/v1/events/elongations": {
      get: {
        tags: ["Events"],
        summary: "Greatest elongations of Mercury and Venus",
        parameters: [afterParam, countParam(12, "How many elongation events to return.")],
        responses: { "200": okResponse("Elongation events"), "400": errorResponse },
      },
    },
    "/v1/reference/bodies": {
      get: {
        tags: ["Reference"],
        summary: "List all 10 supported bodies",
        responses: { "200": okResponse("Body reference list") },
      },
    },
    "/v1/reference/bodies/{body}": {
      get: {
        tags: ["Reference"],
        summary: "Look up one body's reference data",
        parameters: [bodyPathParam],
        responses: { "200": okResponse("Body reference entry"), "400": errorResponse },
      },
    },
    "/v1/meta": {
      get: {
        tags: ["Meta"],
        summary: "Service metadata",
        responses: { "200": okResponse("Service metadata") },
      },
    },
    "/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: { "200": okResponse("Health status") },
      },
    },
  },
} as const;
