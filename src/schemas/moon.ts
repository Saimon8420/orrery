import { z } from "zod";
import { datetimeField, latField, lonField, elevationField, yearField } from "./common";

export const moonQuery = z.object({
  datetime: datetimeField.optional(),
  lat: latField.optional(),
  lon: lonField.optional(),
  elevation: elevationField.optional(),
}).refine((q) => (q.lat === undefined) === (q.lon === undefined), {
  message: "lat and lon must be provided together",
});

export const phasesQuery = z.object({
  datetime: datetimeField.optional(),
  count: z.coerce.number().int().min(1).max(24).optional(),
  year: yearField.optional(),
});
