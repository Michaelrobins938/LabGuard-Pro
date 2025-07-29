import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import { logger } from './utils/logger'

const app = express()
const port = process.env.PORT || 3001

// Prisma instance with connection retry
let prisma: PrismaClient
let dbConnected = false

try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.database_PRISMA_DATABASE_URL
      }
    }
  })
  
  // Test database connection
  prisma.$connect()
    .then(() => {
      logger.info('✅ Database connected successfully')
      dbConnected = true
    })
    .catch((error) => {
      logger.error('❌ Database connection failed:', error)
      dbConnected = false
    })
} catch (error) {
  logger.error('Failed to initialize Prisma:', error)
  dbConnected = false
}

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://lab-guard-pro-w6dt.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Health check endpoint - MUST BE SIMPLE
app.get('/health', async (req, res) => {
  try {
    if (dbConnected) {
      // Simple database check
      await prisma.$queryRaw`SELECT 1`
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'Connected'
      })
    } else {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'Disconnected',
        message: 'Server running but database not available'
      })
    }
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Error',
      error: 'Database connection failed'
    })
  }
})

// Routes
app.use('/api/auth', authRoutes)

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error)
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  if (prisma) {
    await prisma.$disconnect()
  }
  process.exit(0)
})

export default app

// For Vercel serverless
export { prisma } 