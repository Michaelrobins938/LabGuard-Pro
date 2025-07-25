import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { logger } from './utils/logger'
import { PrismaClient } from '@prisma/client'

const PORT = process.env.PORT || 3001
const prisma = new PrismaClient()

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    logger.info('Database connected successfully')

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📊 Health check: http://localhost:${PORT}/health`)
      logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

startServer() 