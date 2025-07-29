import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'
import authRoutes from './routes/auth.routes'
// import equipmentRoutes from './routes/equipment.routes'
// import calibrationRoutes from './routes/calibration.routes'
// import billingRoutes from './routes/billing.routes'

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

// Routes with database connection
app.use('/api/auth', (req, res, next) => {
  req.prisma = prisma
  next()
}, authRoutes)
// app.use('/api/equipment', equipmentRoutes)
// app.use('/api/calibrations', calibrationRoutes)
// app.use('/api/billing', billingRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    // Start the server first
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })

    // Non-blocking database connection
    prisma.$connect().then(() => {
      logger.info('Database connected successfully')
    }).catch((error) => {
      logger.error('Database connection failed:', error)
      logger.warn('Server running without database - some features may not work')
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