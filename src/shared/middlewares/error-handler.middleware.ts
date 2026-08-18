import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { sendError } from '../utils/response.util.js';
import { logger } from '../utils/logger.js';

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn({ err, statusCode: err.statusCode }, err.message);
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  logger.error({ err }, 'Unhandled Exception caught in global error handler');

  sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
