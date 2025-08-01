// Memory optimization for Vercel
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_OPTIONS = '--max-old-space-size=1024'
}

// Ensure Prisma client is generated
if (process.env.NODE_ENV === 'production') {
  const { execSync } = require('child_process')
  try {
    execSync('npx prisma generate', { stdio: 'inherit' })
  } catch (error) {
    console.log('Prisma generate already completed')
  }
}

import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import equipmentRoutes from './routes/equipment.routes'
import calibrationRoutes from './routes/calibration.routes'
import complianceRoutes from './routes/compliance.routes'
import { logger } from './utils/logger'

const app = express()

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

// Simple health check endpoint - NO DATABASE DEPENDENCY
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  })
})

// Initialize Prisma only when needed
let prisma: PrismaClient | null = null

const getPrisma = () => {
  if (!prisma) {
    try {
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.database_PRISMA_DATABASE_URL
          }
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      })
    } catch (error) {
      logger.error('Failed to initialize Prisma:', error)
      return null
    }
  }
  return prisma
}

// Routes with database connection
app.use('/api/auth', (req, res, next) => {
  const prismaInstance = getPrisma()
  if (!prismaInstance) {
    return res.status(503).json({ 
      error: 'Database connection not available' 
    })
  }
  req.prisma = prismaInstance
  next()
}, authRoutes)

app.use('/api/equipment', (req, res, next) => {
  const prismaInstance = getPrisma()
  if (!prismaInstance) {
    return res.status(503).json({ 
      error: 'Database connection not available' 
    })
  }
  req.prisma = prismaInstance
  next()
}, equipmentRoutes)

app.use('/api/calibration', (req, res, next) => {
  const prismaInstance = getPrisma()
  if (!prismaInstance) {
    return res.status(503).json({ 
      error: 'Database connection not available' 
    })
  }
  req.prisma = prismaInstance
  next()
}, calibrationRoutes)

app.use('/api/compliance', (req, res, next) => {
  const prismaInstance = getPrisma()
  if (!prismaInstance) {
    return res.status(503).json({ 
      error: 'Database connection not available' 
    })
  }
  req.prisma = prismaInstance
  next()
}, complianceRoutes)

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error)
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  })
})

export default app 