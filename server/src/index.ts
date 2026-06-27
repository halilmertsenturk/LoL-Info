import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });
}

import express from 'express';
import cors from 'cors';
import { connectDatabase, disconnectDatabase } from './config/database';
import playerRoutes from './routes/playerRoutes';
import rateLimiter from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import { loadChampionData, checkRiotApiKey, isUsingRiotProxy } from './services/riotApiService';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ==========================================
// Middleware
// ==========================================

// CORS
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parsing (for potential future POST routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', rateLimiter);

// ==========================================
// Routes
// ==========================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'LoL Info API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/health/riot', async (_req, res) => {
  const riotHealth = await checkRiotApiKey();
  res.status(riotHealth.valid ? 200 : 503).json({
    success: riotHealth.valid,
    ...riotHealth,
    proxyMode: isUsingRiotProxy(),
    cacheOnlyMode: process.env.RIOT_CACHE_ONLY === 'true',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', playerRoutes);

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ==========================================
// Startup
// ==========================================

async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();

    // Load champion data from Data Dragon
    await loadChampionData();

    const riotHealth = await checkRiotApiKey();
    if (riotHealth.valid) {
      console.log('✅ Riot API key verified');
    } else {
      console.warn(`⚠️ Riot API key check failed: ${riotHealth.hint}`);
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`🚀 LoL Info API server running on port ${PORT}`);
      console.log(`🌍 CORS origin: ${CLIENT_URL}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('👋 Server shut down');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
