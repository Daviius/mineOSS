import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors";

export interface AuthRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  sub: string;
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization token"));
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, "JWT secret is not configured");
    }

    const payload = jwt.verify(token, secret) as JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    next(new ApiError(401, "Unauthorized"));
  }
};
