import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { stripEmpty } from "../schemas/common";
import { ApiError } from "./errorHandler";

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.query = schema.parse(stripEmpty(req.query as Record<string, unknown>));
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        next(new ApiError("VALIDATION_ERROR", "Invalid query parameters", 400, e.flatten().fieldErrors));
      } else {
        next(e);
      }
    }
  };
}
