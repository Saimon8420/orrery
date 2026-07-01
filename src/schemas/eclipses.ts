import { z } from "zod";
import { datetimeField, yearField, latField, lonField, elevationField } from "./common";

export const eclipseQuery = z.object({
  after: datetimeField.optional(),
  year: yearField.optional(),
  count: z.coerce.number().int().min(1).max(10).optional(),
});

export const localEclipseQuery = z.object({
  after: datetimeField.optional(),
  count: z.coerce.number().int().min(1).max(10).optional(),
  lat: latField,
  lon: lonField,
  elevation: elevationField.optional(),
});
