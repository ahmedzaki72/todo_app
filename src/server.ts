import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if connections are hanging
  setTimeout(() => {
    logger.error('Forced shutdown due to hanging connections.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: Error) => {
  logger.error({ err: reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ err: error }, 'Uncaught Exception! Shutting down process...');
  process.exit(1);
});
