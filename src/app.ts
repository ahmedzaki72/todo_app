import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { env } from './config/env.js';
import { swaggerDocument } from './config/swagger.js';
import { traceIdMiddleware } from './shared/middlewares/trace-id.middleware.js';
import { requestLoggerMiddleware } from './shared/middlewares/request-logger.middleware.js';
import { errorHandlerMiddleware } from './shared/middlewares/error-handler.middleware.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { todosRoutes } from './modules/todos/todos.routes.js';
import { NotFoundError } from './shared/errors/app-error.js';

const createApp = (): Express => {
  const app = express();

  // Security Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Swagger UI and Dashboard inline assets to render smoothly
    })
  );
  app.use(cors({ origin: env.CORS_ORIGIN }));

  // Static Assets Middleware (for Web Dashboard)
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // Dashboard Direct Route
  app.get('/dashboard', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // Rate Limiter Middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later.',
      },
    },
  });
  app.use('/api', limiter);

  // Body Parser & Context Middlewares
  app.use(express.json());
  app.use(traceIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Swagger Documentation Endpoint
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // API Routes
  app.use('/api/v1', healthRoutes);
  app.use('/api/v1/todos', todosRoutes);

  // Handle 404 Routes
  app.use('*', () => {
    throw new NotFoundError('Endpoint not found');
  });

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
};

export const app = createApp();
