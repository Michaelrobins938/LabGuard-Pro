import app from './app';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger';

const prisma = new PrismaClient();

// Extend Request to include prisma
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

// Middleware to inject prisma into request
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Start the server first
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Non-blocking database connection
    prisma.$connect().then(() => {
      logger.info('Database connected successfully');
    }).catch((error) => {
      logger.error('Database connection failed:', error);
      logger.warn('Server running without database - some features may not work');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 