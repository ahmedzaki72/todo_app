import { Response } from 'express';
import { getTraceId } from '../context/request-context.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    traceId?: string;
    timestamp: string;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      traceId: getTraceId(),
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_SERVER_ERROR',
  details?: unknown
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      traceId: getTraceId(),
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};
