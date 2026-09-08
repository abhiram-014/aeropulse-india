import dotenv from 'dotenv';
import { createApp } from './app.js';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  AIR QUALITY INSIGHT PLATFORM - BACKEND RUNNING   `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Data Mode:   ${process.env.DATA_MODE || 'demo'}`);
  console.log(`  Port:        http://localhost:${PORT}`);
  console.log(`  Health:      http://localhost:${PORT}/health`);
  console.log(`  API Base:    http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
