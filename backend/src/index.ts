import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'
import authRoutes from './routes/auth.routes'

const app = express()
const prisma = new PrismaClient()

// Extend Request to include prisma
declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient
    }
  }
}

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check - NO DATABASE DEPENDENCY
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Routes with database connection
app.use('/api/auth', (req, res, next) => {
  req.prisma = prisma
  next()
}, authRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error)
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  })
})

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    // Start server first, then test database connection
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })

    // Test database connection with timeout
    setTimeout(async () => {
      try {
        await prisma.$connect()
        logger.info('Database connected successfully')
      } catch (error) {
        logger.error('Database connection failed:', error)
        logger.warn('Server running without database connection')
      }
    }, 1000)
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

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