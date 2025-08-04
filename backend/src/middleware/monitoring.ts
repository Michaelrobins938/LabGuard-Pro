import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

interface RequestMetrics {
  method: string
  path: string
  statusCode: number
  responseTime: number
  timestamp: Date
  ip: string
  userAgent: string
}

class MetricsCollector {
  private metrics: RequestMetrics[] = []
  private readonly maxMetrics = 1000

  addMetric(metric: RequestMetrics) {
    this.metrics.push(metric)
    
    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  getMetrics() {
    return this.metrics
  }

  getStats() {
    const total = this.metrics.length
    if (total === 0) return { total: 0 }

    const statusCodes = this.metrics.reduce((acc, metric) => {
      acc[metric.statusCode] = (acc[metric.statusCode] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const responseTimes = this.metrics.map(m => m.responseTime)
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const maxResponseTime = Math.max(...responseTimes)
    const minResponseTime = Math.min(...responseTimes)

    const methods = this.metrics.reduce((acc, metric) => {
      acc[metric.method] = (acc[metric.method] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      statusCodes,
      responseTime: {
        average: avgResponseTime,
        max: maxResponseTime,
        min: minResponseTime
      },
      methods
    }
  }

  clear() {
    this.metrics = []
  }
}

const metricsCollector = new MetricsCollector()

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const originalSend = res.send

  res.send = function(data) {
    const responseTime = Date.now() - startTime
    
    const metric: RequestMetrics = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    }

    metricsCollector.addMetric(metric)

    // Log request details
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: metric.ip,
      userAgent: metric.userAgent
    })

    return originalSend.call(this, data)
  }

  next()
}

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request Error', {
    method: req.method,
    path: req.path,
    error: error.message,
    stack: error.stack,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  })

  next(error)
}

export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime()

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const duration = seconds * 1000 + nanoseconds / 1000000

    if (duration > 1000) { // Log slow requests (>1s)
      logger.warn('Slow Request', {
        method: req.method,
        path: req.path,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode
      })
    }
  })

  next()
}

export const getMetrics = () => {
  return metricsCollector.getStats()
}

export const getRequestLogs = () => {
  return metricsCollector.getMetrics()
}

export const clearMetrics = () => {
  metricsCollector.clear()
}

export const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    metrics: getMetrics()
  }

  res.json(health)
  next()
}

// Export the monitoring middleware that combines all monitoring functions
export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  requestLogger(req, res, next);
  performanceMonitor(req, res, next);
} 