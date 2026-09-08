import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { createApiRouter } from './routes/apiRoutes.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200, // limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);

  // Health Check Endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'air-quality-backend',
      version: '1.0.0'
    });
  });

  // API Routes
  app.use('/api', createApiRouter());

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  // Global Error Handler (Sanitized - no stack traces in response)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Application Error:', err);
    res.status(err.status || 500).json({
      error: 'An internal server error occurred',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
  });

  return app;
}
