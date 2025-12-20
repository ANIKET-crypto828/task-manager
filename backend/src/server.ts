import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './socket';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { rateLimit } from './middleware/rateLimit.middleware';
import { logger } from './utils/logger';
import { connectDatabase } from './utils/database';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const { io, userSockets } = initializeSocket(httpServer);

// Make io and userSockets available to routes
app.set('io', io);
app.set('userSockets', userSockets);

// Trust proxy (important for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'https://task-manager-frontend-sandy-theta.vercel.app/',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use(rateLimit());

// Request logging
app.use((req, res, next) => {
  logger.request(req);
  next();
});

// API routes
app.use('/api/v1', routes);
app.use('/api/v1/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Task Manager API'
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Socket.io ready for connections`);
      logger.info(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN || 'https://task-manager-frontend-sandy-theta.vercel.app/'}`);
      logger.info(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;