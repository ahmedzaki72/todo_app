import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      userAgent: req.get('user-agent'),
    }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
