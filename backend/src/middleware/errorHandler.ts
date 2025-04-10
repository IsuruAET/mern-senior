import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface ErrorResponse {
  success: boolean;
  status: number;
  message: string;
  errors?: any;
  stack?: string;
}

export class AppError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorResponse: ErrorResponse = {
    success: false,
    status: err instanceof AppError ? err.statusCode : 500,
    message: err.message || "Internal Server Error",
  };

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    errorResponse.status = 400;
    errorResponse.message = "Validation failed";
    errorResponse.errors = err.errors;
  }

  // Handle AppError with additional errors
  if (err instanceof AppError && err.errors) {
    errorResponse.errors = err.errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
};
