import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import tracksRoutes from './routes/tracks.routes.js';
import todosRoutes from './routes/todos.routes.js';
import syncRoutes from './routes/sync.routes.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/sync', syncRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'vibespace-backend',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

export default app;
