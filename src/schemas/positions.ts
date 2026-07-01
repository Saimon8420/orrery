import { z } from "zod";
import { datetimeField, latField, lonField, elevationField } from "./common";

export const positionsQuery = z
  .object({
    datetime: datetimeField.optional(),
    lat: latField.optional(),
    lon: lonField.optional(),
    elevation: elevationField.optional(),
  })
  .refine((q) => (q.lat === undefined) === (q.lon === undefined), {
    message: "lat and lon must be provided together",
  });
