import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validator";
import { ApiError } from "../utils/errors";

const hasValidationErrors = (error: unknown): error is { errors: ValidationError[] } =>
  Array.isArray((error as { errors?: ValidationError[] })?.errors);

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
};

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (hasValidationErrors(err)) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors
    });
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ message });
};
