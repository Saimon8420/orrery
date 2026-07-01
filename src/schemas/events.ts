import { z } from "zod";
import { datetimeField } from "./common";

export const conjunctionsQuery = z.object({
  from: datetimeField.optional(),
  to: datetimeField.optional(),
}).refine((q) => !q.from || !q.to || q.to > q.from, { message: "to must be after from" });

export const elongationsQuery = z.object({
  after: datetimeField.optional(),
  count: z.coerce.number().int().min(1).max(12).optional(),
});
