import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express";

export function requestIdMiddleware(
  req: Request & { id?: string },
  res: Response,
  next: NextFunction,
) {
  const id = (req.headers["x-request-id"] as string) || uuidv4();
  req.id = id;
  res.setHeader("x-request-id", id);
  next();
}
