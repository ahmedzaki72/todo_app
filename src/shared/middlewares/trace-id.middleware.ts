import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { requestContext } from '../context/request-context.js';

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const traceId = (req.headers['x-trace-id'] as string) || randomUUID();

  res.setHeader('x-trace-id', traceId);

  requestContext.run({ traceId }, () => {
    next();
  });
};
