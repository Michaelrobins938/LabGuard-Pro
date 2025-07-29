import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/error.middleware'
import { requestLogger, performanceMonitor } from './middleware/monitoring'
import authRoutes from './routes/auth.routes'
import equipmentRoutes from './routes/equipment.routes'
import calibrationRoutes from './routes/calibration.routes'
import billingRoutes from './routes/billing.routes'

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging and monitoring
app.use(requestLogger)
app.use(performanceMonitor)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/calibrations', calibrationRoutes)
app.use('/api/billing', billingRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    logger.info('Database connected successfully')

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
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