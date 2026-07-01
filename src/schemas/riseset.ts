import { z } from "zod";
import { datetimeField, latField, lonField, elevationField } from "./common";

export const risesetQuery = z.object({
  datetime: datetimeField.optional(),
  lat: latField,
  lon: lonField,
  elevation: elevationField.optional(),
  body: z.string().optional(),
  days: z.coerce.number().int().min(1).max(30).optional(),
});
