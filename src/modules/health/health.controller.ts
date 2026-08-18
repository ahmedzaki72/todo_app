import { Request, Response } from 'express';
import { sendSuccess } from '../../shared/utils/response.util.js';

export class HealthController {
  public checkHealth = (_req: Request, res: Response): void => {
    sendSuccess(
      res,
      {
        status: 'UP',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      'Service is healthy'
    );
  };
}
