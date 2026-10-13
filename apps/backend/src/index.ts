import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[VibeSpace Backend] Server running on http://localhost:${PORT}`);
  console.log(`[VibeSpace Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n[VibeSpace Backend] Received ${signal}. Closing HTTP server...`);
  server.close(() => {
    console.log('[VibeSpace Backend] HTTP server closed gracefully.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
