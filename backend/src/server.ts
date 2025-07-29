import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { logger } from './utils/logger'
import { PrismaClient } from '@prisma/client'

const PORT = process.env.PORT || 3001
const prisma = new PrismaClient()

async function startServer() {
  try {
    // Test database connection with timeout
    const dbTimeout = setTimeout(() => {
      logger.warn('Database connection timeout - starting server anyway')
      startExpressServer()
    }, 5000) // 5 second timeout

    try {
      await prisma.$connect()
      clearTimeout(dbTimeout)
      logger.info('Database connected successfully')
    } catch (dbError) {
      clearTimeout(dbTimeout)
      logger.error('Database connection failed:', dbError)
      logger.warn('Starting server without database connection - some features may not work')
    }

    startExpressServer()
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

function startExpressServer() {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`)
    logger.info(`📊 Health check: http://localhost:${PORT}/health`)
    logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
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