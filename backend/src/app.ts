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

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      id?: string
    }
  }
}

const app = express()

// Enterprise-level CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://lab-guard-pro-w6dt.vercel.app',
      'https://lab-guard-pro-w6dt-*.vercel.app',
      'https://web-*.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin && allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace('*', '.*')
        return new RegExp(pattern).test(origin)
      }
      return allowedOrigin === origin
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
      console.log(`CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400 // 24 hours
}

// Security middleware with enterprise configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

app.use(cors(corsOptions))

// Pre-flight requests
app.options('*', cors(corsOptions))

// Rate limiting with enterprise configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 / 1000) // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
})
app.use(limiter)

// Body parsing middleware with enterprise limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString())
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' })
      throw new Error('Invalid JSON')
    }
  }
}))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Enhanced logging with request ID
app.use(morgan('combined'))

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9)
  res.setHeader('X-Request-ID', req.id)
  next()
})

// Health check endpoint with detailed status
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    requestId: req.id
  })
})

// API routes with proper error handling
app.use('/api/auth', authRoutes)
app.use('/api/equipment', authMiddleware, equipmentRoutes)
app.use('/api/calibration', authMiddleware, calibrationRoutes)
app.use('/api/compliance', authMiddleware, complianceRoutes)
app.use('/api/reports', authMiddleware, reportsRoutes)
app.use('/api/billing', authMiddleware, billingRoutes)
app.use('/api/vector-control', vectorControlRoutes)

// Enhanced 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    requestId: req.id,
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use(errorHandler)

export default app 