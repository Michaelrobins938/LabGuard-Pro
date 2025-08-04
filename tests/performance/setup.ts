import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll } from '@jest/globals';

// Global setup for performance tests
const prisma = new PrismaClient();

// Performance monitoring utilities
export class PerformanceMonitor {
  private startTime: number = 0;
  private metrics: Map<string, any> = new Map();

  start(label: string): void {
    this.startTime = performance.now();
    this.metrics.set(label, { startTime: this.startTime });
  }

  end(label: string): number {
    const endTime = performance.now();
    const metric = this.metrics.get(label);
    
    if (!metric) {
      throw new Error(`No metric found for label: ${label}`);
    }

    const duration = endTime - metric.startTime;
    this.metrics.set(label, { ...metric, endTime, duration });
    
    return duration;
  }

  getMetric(label: string): any {
    return this.metrics.get(label);
  }

  getAllMetrics(): Map<string, any> {
    return this.metrics;
  }

  clear(): void {
    this.metrics.clear();
  }

  // Memory monitoring
  static getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  // CPU monitoring
  static getCpuUsage(): NodeJS.CpuUsage {
    return process.cpuUsage();
  }

  // Generate performance report
  generateReport(): string {
    const metrics = Array.from(this.metrics.entries());
    let report = '\n📊 Performance Report\n';
    report += '=' .repeat(50) + '\n';

    metrics.forEach(([label, metric]) => {
      if (metric.duration !== undefined) {
        report += `${label}: ${metric.duration.toFixed(2)}ms\n`;
      }
    });

    const memory = PerformanceMonitor.getMemoryUsage();
    report += '\n💾 Memory Usage:\n';
    report += `   RSS: ${(memory.rss / 1024 / 1024).toFixed(2)}MB\n`;
    report += `   Heap Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)}MB\n`;
    report += `   Heap Total: ${(memory.heapTotal / 1024 / 1024).toFixed(2)}MB\n`;
    report += `   External: ${(memory.external / 1024 / 1024).toFixed(2)}MB\n`;

    return report;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Database utilities for performance tests
export class TestDatabase {
  static async createTestLaboratory(name: string = 'Performance Test Lab'): Promise<string> {
    const laboratory = await prisma.laboratory.create({
      data: {
        name: `${name} ${Date.now()}`,
        email: `perf-test-${Date.now()}@example.com`,
        planType: 'ENTERPRISE'
      }
    });
    return laboratory.id;
  }

  static async cleanupTestData(laboratoryId: string): Promise<void> {
    // Clean up in dependency order
    await prisma.mosquitoPool.deleteMany({
      where: { laboratoryId }
    });
    
    await prisma.pCRBatch.deleteMany({
      where: { laboratoryId }
    });
    
    await prisma.surveillanceAlert.deleteMany({
      where: { laboratoryId }
    });
    
    await prisma.trapLocation.deleteMany({
      where: { laboratoryId }
    });
    
    await prisma.weatherData.deleteMany({
      where: { laboratoryId }
    });
    
    await prisma.laboratory.delete({
      where: { id: laboratoryId }
    });
  }

  static async getDbSize(): Promise<{ tables: Array<{ name: string; size: string; rows: number }> }> {
    // This would work on PostgreSQL
    try {
      const result = await prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          attname,
          n_distinct,
          correlation
        FROM pg_stats 
        WHERE schemaname = 'public'
        ORDER BY tablename, attname;
      ` as any[];

      return {
        tables: result.map(row => ({
          name: row.tablename,
          size: 'N/A', // Would need specific queries for size
          rows: row.n_distinct || 0
        }))
      };
    } catch (error) {
      // Fallback for other databases
      return { tables: [] };
    }
  }
}

// Load testing utilities
export class LoadTester {
  private concurrentOperations: Array<Promise<any>> = [];
  private results: Array<{ success: boolean; duration: number; error?: string }> = [];

  async runConcurrentOperations<T>(
    operationFactory: () => Promise<T>,
    concurrency: number,
    duration: number = 10000
  ): Promise<{
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageResponseTime: number;
    throughput: number;
    errorRate: number;
  }> {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    this.results = [];
    this.concurrentOperations = [];

    // Start concurrent operations
    for (let i = 0; i < concurrency; i++) {
      this.startContinuousOperations(operationFactory, endTime);
    }

    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, duration));

    // Wait for remaining operations to complete
    await Promise.allSettled(this.concurrentOperations);

    // Calculate metrics
    const totalOperations = this.results.length;
    const successfulOperations = this.results.filter(r => r.success).length;
    const failedOperations = totalOperations - successfulOperations;
    const averageResponseTime = this.results.reduce((sum, r) => sum + r.duration, 0) / totalOperations;
    const throughput = (totalOperations / duration) * 1000; // operations per second
    const errorRate = failedOperations / totalOperations;

    return {
      totalOperations,
      successfulOperations,
      failedOperations,
      averageResponseTime,
      throughput,
      errorRate
    };
  }

  private async startContinuousOperations<T>(
    operationFactory: () => Promise<T>,
    endTime: number
  ): Promise<void> {
    while (Date.now() < endTime) {
      const operationStart = Date.now();
      
      try {
        const operation = operationFactory();
        this.concurrentOperations.push(operation);
        
        await operation;
        
        this.results.push({
          success: true,
          duration: Date.now() - operationStart
        });
      } catch (error) {
        this.results.push({
          success: false,
          duration: Date.now() - operationStart,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

// API testing utilities
export class APITester {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5001') {
    this.baseUrl = baseUrl;
  }

  async testEndpoint(
    path: string,
    method: string = 'GET',
    body?: any,
    headers?: Record<string, string>
  ): Promise<{
    status: number;
    responseTime: number;
    responseSize: number;
    success: boolean;
  }> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const responseText = await response.text();
      const responseTime = performance.now() - startTime;
      const responseSize = new Blob([responseText]).size;

      return {
        status: response.status,
        responseTime,
        responseSize,
        success: response.ok
      };
    } catch (error) {
      return {
        status: 0,
        responseTime: performance.now() - startTime,
        responseSize: 0,
        success: false
      };
    }
  }

  async measureEndpointPerformance(
    path: string,
    requests: number = 100,
    concurrency: number = 10
  ): Promise<{
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    throughput: number;
    successRate: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  }> {
    const loadTester = new LoadTester();
    
    const results = await loadTester.runConcurrentOperations(
      () => this.testEndpoint(path),
      concurrency,
      Math.max(requests / concurrency * 100, 5000) // Ensure enough time
    );

    // Get response times for percentile calculations
    const responseTimes = loadTester.results
      .filter(r => r.success)
      .map(r => r.duration)
      .sort((a, b) => a - b);

    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);

    return {
      averageResponseTime: results.averageResponseTime,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      throughput: results.throughput,
      successRate: 1 - results.errorRate,
      p95ResponseTime: responseTimes[p95Index] || 0,
      p99ResponseTime: responseTimes[p99Index] || 0
    };
  }
}

// Browser automation utilities
export class BrowserTester {
  static async measurePageLoadTime(url: string, options: {
    mobile?: boolean;
    throttling?: 'fast3g' | 'slow3g' | 'offline';
    viewport?: { width: number; height: number };
  } = {}): Promise<{
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
  }> {
    // This would be implemented with Puppeteer or Playwright
    // For now, return simulated metrics
    return {
      loadTime: Math.random() * 3000 + 1000,
      firstContentfulPaint: Math.random() * 1500 + 500,
      largestContentfulPaint: Math.random() * 2500 + 1000,
      cumulativeLayoutShift: Math.random() * 0.1,
      timeToInteractive: Math.random() * 2000 + 1500
    };
  }
}

// Global test setup
beforeAll(async () => {
  console.log('🚀 Starting Performance Test Suite');
  console.log('Setting up test environment...');
  
  // Ensure database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }

  // Set up performance monitoring
  performanceMonitor.clear();
  console.log('✅ Performance monitoring initialized');

  // Set Node.js performance settings for tests
  if (typeof global.gc === 'function') {
    global.gc();
    console.log('✅ Garbage collection triggered');
  }

  console.log('✅ Performance test environment ready\n');
});

afterAll(async () => {
  console.log('\n🏁 Performance Test Suite Complete');
  
  // Generate final performance report
  const report = performanceMonitor.generateReport();
  console.log(report);

  // Cleanup
  await prisma.$disconnect();
  console.log('✅ Database disconnected');
  console.log('✅ Performance test cleanup complete');
});

// Export utilities for use in tests
export { LoadTester, APITester, BrowserTester, TestDatabase };