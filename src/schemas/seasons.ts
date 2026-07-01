import { z } from "zod";
import { yearField } from "./common";

export const seasonsQuery = z.object({ year: yearField.optional() });
