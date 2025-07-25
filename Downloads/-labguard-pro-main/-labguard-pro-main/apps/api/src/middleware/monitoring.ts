import { Request, Response, NextFunction } from 'express'
import * as Sentry from '@sentry/node'
import { createPrometheusMetrics } from './prometheus'

const metrics = createPrometheusMetrics()

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  // Track request metrics
  metrics.httpRequestsTotal.inc({
    method: req.method,
    route: req.route?.path || req.path,
    status_code: res.statusCode
  })

  res.on('finish', () => {
    const duration = Date.now() - startTime
    
    // Track response time
    metrics.httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path },
      duration / 1000
    )

    // Track errors
    if (res.statusCode >= 400) {
      Sentry.captureException(new Error(`HTTP ${res.statusCode}: ${req.path}`))
    }
  })

  next()
}

// Database performance monitoring
export class DatabaseMonitor {
  static trackQuery(query: string, duration: number) {
    metrics.dbQueryDuration.observe({ query_type: this.getQueryType(query) }, duration)
    
    if (duration > 1000) { // Slow query alert
      Sentry.captureMessage(`Slow query detected: ${query}`, 'warning')
    }
  }

  static trackConnection(pool: any) {
    setInterval(() => {
      metrics.dbConnectionsActive.set(pool.totalCount)
      metrics.dbConnectionsIdle.set(pool.idleCount)
    }, 10000)
  }

  private static getQueryType(query: string): string {
    const upperQuery = query.toUpperCase()
    if (upperQuery.startsWith('SELECT')) return 'SELECT'
    if (upperQuery.startsWith('INSERT')) return 'INSERT'
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE'
    if (upperQuery.startsWith('DELETE')) return 'DELETE'
    return 'OTHER'
  }
}

// Business metrics tracking
export class BusinessMetrics {
  static trackCalibration(status: 'completed' | 'failed' | 'overdue') {
    metrics.calibrationsTotal.inc({ status })
  }

  static trackAIUsage(type: 'compliance' | 'biomni', cost: number) {
    metrics.aiRequestsTotal.inc({ type })
    metrics.aiCostTotal.inc({ type }, cost)
  }

  static trackUserActivity(action: string, userId: string) {
    metrics.userActionsTotal.inc({ action })
    // Track for customer success
  }

  static trackEquipmentStatus(status: 'active' | 'inactive' | 'maintenance') {
    metrics.equipmentStatus.inc({ status })
  }

  static trackSubscriptionEvent(event: 'created' | 'updated' | 'cancelled') {
    metrics.subscriptionEvents.inc({ event })
  }
}

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  }

  res.status(200).json(health)
}

// Metrics endpoint for Prometheus
export const metricsEndpoint = (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain')
  res.end(metrics.registry.metrics())
} 