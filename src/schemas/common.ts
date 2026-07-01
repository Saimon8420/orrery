import { z } from "zod";
import { DateTime } from "luxon";

/** Remove keys whose value is an empty string so `.optional()` works. */
export function stripEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export const datetimeField = z
  .string()
  .refine((s) => DateTime.fromISO(s, { setZone: true }).isValid, {
    message: "datetime must be a valid ISO 8601 string",
  })
  .refine(
    (s) => {
      const y = DateTime.fromISO(s, { setZone: true }).toUTC().year;
      return y >= 1700 && y <= 2200;
    },
    { message: "datetime year must be between 1700 and 2200" },
  )
  .transform((s) => DateTime.fromISO(s, { setZone: true }).toUTC().toJSDate());

export const yearField = z.coerce
  .number()
  .int()
  .min(1700, "year must be >= 1700")
  .max(2200, "year must be <= 2200");

export const latField = z.coerce.number().min(-90).max(90);
export const lonField = z.coerce.number().min(-180).max(180);
export const elevationField = z.coerce.number().min(-500).max(100000);
