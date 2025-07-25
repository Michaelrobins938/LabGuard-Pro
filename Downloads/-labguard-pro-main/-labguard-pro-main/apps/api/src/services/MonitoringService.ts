import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { logger } from '../utils/logger';

// Initialize Prometheus metrics
collectDefaultMetrics({ register });

export class MonitoringService {
  // Request metrics
  private requestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private requestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  });

  // Business metrics
  private calibrationCounter = new Counter({
    name: 'calibrations_total',
    help: 'Total number of calibrations performed',
    labelNames: ['status', 'result'],
  });

  private equipmentGauge = new Gauge({
    name: 'equipment_total',
    help: 'Total number of equipment items',
    labelNames: ['status'],
  });

  private userGauge = new Gauge({
    name: 'users_total',
    help: 'Total number of users',
    labelNames: ['role'],
  });

  private subscriptionGauge = new Gauge({
    name: 'subscriptions_total',
    help: 'Total number of subscriptions',
    labelNames: ['status', 'plan'],
  });

  // AI metrics
  private aiRequestCounter = new Counter({
    name: 'ai_requests_total',
    help: 'Total number of AI requests',
    labelNames: ['service', 'status'],
  });

  private aiRequestDuration = new Histogram({
    name: 'ai_request_duration_seconds',
    help: 'AI request duration in seconds',
    labelNames: ['service'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  });

  // Database metrics
  private databaseQueryCounter = new Counter({
    name: 'database_queries_total',
    help: 'Total number of database queries',
    labelNames: ['operation', 'table'],
  });

  private databaseQueryDuration = new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  });

  // Cache metrics
  private cacheHitCounter = new Counter({
    name: 'cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_type'],
  });

  private cacheMissCounter = new Counter({
    name: 'cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_type'],
  });

  // Error metrics
  private errorCounter = new Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'service'],
  });

  // Custom business metrics
  private complianceScoreHistogram = new Histogram({
    name: 'compliance_score',
    help: 'Distribution of compliance scores',
    labelNames: ['equipment_type'],
    buckets: [0, 25, 50, 75, 85, 90, 95, 100],
  });

  private overdueCalibrationsGauge = new Gauge({
    name: 'overdue_calibrations',
    help: 'Number of overdue calibrations',
    labelNames: ['laboratory_id'],
  });

  private activeUsersGauge = new Gauge({
    name: 'active_users',
    help: 'Number of active users in the last 24 hours',
  });

  constructor() {
    // Register all metrics
    register.registerMetric(this.requestCounter);
    register.registerMetric(this.requestDuration);
    register.registerMetric(this.calibrationCounter);
    register.registerMetric(this.equipmentGauge);
    register.registerMetric(this.userGauge);
    register.registerMetric(this.subscriptionGauge);
    register.registerMetric(this.aiRequestCounter);
    register.registerMetric(this.aiRequestDuration);
    register.registerMetric(this.databaseQueryCounter);
    register.registerMetric(this.databaseQueryDuration);
    register.registerMetric(this.cacheHitCounter);
    register.registerMetric(this.cacheMissCounter);
    register.registerMetric(this.errorCounter);
    register.registerMetric(this.complianceScoreHistogram);
    register.registerMetric(this.overdueCalibrationsGauge);
    register.registerMetric(this.activeUsersGauge);

    logger.info('Monitoring service initialized');
  }

  // Request monitoring
  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    this.requestCounter.inc({ method, route, status_code: statusCode.toString() });
    this.requestDuration.observe({ method, route }, duration);
  }

  // Business metrics
  recordCalibration(status: string, result: string) {
    this.calibrationCounter.inc({ status, result });
  }

  updateEquipmentCount(status: string, count: number) {
    this.equipmentGauge.set({ status }, count);
  }

  updateUserCount(role: string, count: number) {
    this.userGauge.set({ role }, count);
  }

  updateSubscriptionCount(status: string, plan: string, count: number) {
    this.subscriptionGauge.set({ status, plan }, count);
  }

  // AI metrics
  recordAIRequest(service: string, status: string, duration: number) {
    this.aiRequestCounter.inc({ service, status });
    this.aiRequestDuration.observe({ service }, duration);
  }

  // Database metrics
  recordDatabaseQuery(operation: string, table: string, duration: number) {
    this.databaseQueryCounter.inc({ operation, table });
    this.databaseQueryDuration.observe({ operation, table }, duration);
  }

  // Cache metrics
  recordCacheHit(cacheType: string) {
    this.cacheHitCounter.inc({ cache_type: cacheType });
  }

  recordCacheMiss(cacheType: string) {
    this.cacheMissCounter.inc({ cache_type: cacheType });
  }

  // Error metrics
  recordError(type: string, service: string) {
    this.errorCounter.inc({ type, service });
  }

  // Business metrics
  recordComplianceScore(equipmentType: string, score: number) {
    this.complianceScoreHistogram.observe({ equipment_type: equipmentType }, score);
  }

  updateOverdueCalibrations(laboratoryId: string, count: number) {
    this.overdueCalibrationsGauge.set({ laboratory_id: laboratoryId }, count);
  }

  updateActiveUsers(count: number) {
    this.activeUsersGauge.set(count);
  }

  // Get metrics for Prometheus
  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Check if metrics are being collected
      const metrics = await this.getMetrics();
      return metrics.length > 0;
    } catch (error) {
      logger.error('Monitoring health check failed:', error);
      return false;
    }
  }

  // Custom metrics collection
  async collectCustomMetrics() {
    try {
      // This would typically query your database for business metrics
      // For now, we'll just log that metrics are being collected
      logger.debug('Collecting custom metrics...');
      
      // Example: Update equipment counts
      // const equipmentCounts = await prisma.equipment.groupBy({
      //   by: ['status'],
      //   _count: { id: true }
      // });
      
      // equipmentCounts.forEach(({ status, _count }) => {
      //   this.updateEquipmentCount(status, _count.id);
      // });
      
    } catch (error) {
      logger.error('Error collecting custom metrics:', error);
    }
  }

  // Alerting thresholds
  private readonly ALERT_THRESHOLDS = {
    HIGH_ERROR_RATE: 0.05, // 5% error rate
    HIGH_RESPONSE_TIME: 2, // 2 seconds
    LOW_CACHE_HIT_RATE: 0.8, // 80% cache hit rate
    HIGH_OVERDUE_CALIBRATIONS: 10, // 10 overdue calibrations
  };

  // Check alerting conditions
  async checkAlertConditions(): Promise<Array<{ severity: string; message: string; value: number }>> {
    const alerts: Array<{ severity: string; message: string; value: number }> = [];

    try {
      // Get current metrics
      const metrics = await this.getMetrics();
      
      // Parse metrics to check thresholds
      // This is a simplified example - in production you'd use a proper metrics parser
      
      // Example alert checks:
      // - High error rate
      // - High response time
      // - Low cache hit rate
      // - High number of overdue calibrations
      
      logger.debug('Checking alert conditions...');
      
    } catch (error) {
      logger.error('Error checking alert conditions:', error);
    }

    return alerts;
  }

  // Performance monitoring middleware
  createPerformanceMiddleware() {
    return (req: any, res: any, next: any) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = (Date.now() - start) / 1000; // Convert to seconds
        const method = req.method;
        const route = req.route?.path || req.path;
        const statusCode = res.statusCode;
        
        this.recordRequest(method, route, statusCode, duration);
        
        // Check for slow requests
        if (duration > this.ALERT_THRESHOLDS.HIGH_RESPONSE_TIME) {
          logger.warn(`Slow request detected: ${method} ${route} took ${duration}s`);
        }
      });
      
      next();
    };
  }

  // Database monitoring wrapper
  wrapDatabaseOperation<T>(operation: string, table: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    
    return fn()
      .then((result) => {
        const duration = (Date.now() - start) / 1000;
        this.recordDatabaseQuery(operation, table, duration);
        return result;
      })
      .catch((error) => {
        this.recordError('database', operation);
        throw error;
      });
  }

  // AI request monitoring wrapper
  wrapAIRequest<T>(service: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    
    return fn()
      .then((result) => {
        const duration = (Date.now() - start) / 1000;
        this.recordAIRequest(service, 'success', duration);
        return result;
      })
      .catch((error) => {
        const duration = (Date.now() - start) / 1000;
        this.recordAIRequest(service, 'error', duration);
        this.recordError('ai', service);
        throw error;
      });
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService(); 