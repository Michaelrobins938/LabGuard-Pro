import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/error.middleware'
import { authMiddleware } from './middleware/auth.middleware'

// Import routes
import authRoutes from './routes/auth.routes'
import equipmentRoutes from './routes/equipment.routes'
import calibrationRoutes from './routes/calibration.routes'
import complianceRoutes from './routes/compliance.routes'
import reportsRoutes from './routes/reports.routes'
import billingRoutes from './routes/billing.routes'
import vectorControlRoutes from './routes/vector-control.routes'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan('combined'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/equipment', authMiddleware, equipmentRoutes)
app.use('/api/calibration', authMiddleware, calibrationRoutes)
app.use('/api/compliance', authMiddleware, complianceRoutes)
app.use('/api/reports', authMiddleware, reportsRoutes)
app.use('/api/billing', authMiddleware, billingRoutes)
app.use('/api/vector-control', vectorControlRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  })
})

// Error handling middleware
app.use(errorHandler)

export default app 