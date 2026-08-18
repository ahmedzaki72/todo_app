import pino from 'pino';
import { env } from '../../config/env.js';
import { getTraceId } from '../context/request-context.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  mixin() {
    const traceId = getTraceId();
    return traceId ? { traceId } : {};
  },
  transport:
    env.NODE_ENV === 'development'
      ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        },
      }
      : undefined,
});
