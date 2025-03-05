import { Request, Response, NextFunction } from "express";
import { sendError } from "./resHandler";
import { ServerLogs } from "../../models/server-logs.model";
import logger from "../logger";

/**
 * Global Error Handler Middleware
 */
export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`);
  if (err instanceof CustomError) {
    return sendError(res, err.statusCode, err.message, err.errorDetails);
  }

  // Log 500 errors in MongoDB
  if (err.statusCode === 500 || !err.statusCode) {
    try {
      await ServerLogs.create({
        message: err.message || "Unknown Error",
        stack: err.stack || "No stack trace",
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        query: req.query,
      });
    } catch (dbError) {
      console.error("❌ Failed to log error to MongoDB:", dbError);
      logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`);
    }
  }

  return sendError(
    res,
    500,
    "Internal Server Error",
    process.env.NODE_ENV === "development" ? err.stack : null
  );
};

export class CustomError extends Error {
  statusCode: number;
  errorDetails?: any;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errorDetails: any = null,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
