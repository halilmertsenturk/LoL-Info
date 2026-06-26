import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/index';

/**
 * Global error handling middleware.
 * Catches ApiError instances and unknown errors, returning consistent JSON.
 */
function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  if (err instanceof ApiError) {
    console.error(`[API Error] ${err.statusCode}: ${err.message}`);
  } else {
    console.error('[Unexpected Error]', err);
  }

  // If it's an operational ApiError, send the known status and message
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // For unexpected errors, send a generic 500
  res.status(500).json({
    success: false,
    error: 'An unexpected internal error occurred.',
  });
}

export default errorHandler;
