import { z } from "zod";
import { datetimeField, latField, lonField, elevationField } from "./common";

export const twilightQuery = z.object({
  datetime: datetimeField.optional(),
  lat: latField,
  lon: lonField,
  elevation: elevationField.optional(),
});
