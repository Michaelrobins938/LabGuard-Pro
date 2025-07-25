import React from 'react'

// Performance monitoring utility
interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  metadata?: Record<string, unknown>
}

interface PerformanceObserver {
  name: string
  callback: (metric: PerformanceMetric) => void
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []
  private isEnabled: boolean = process.env.NODE_ENV === 'production'

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals()
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number, unit: string = 'ms', metadata?: Record<string, unknown>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata,
    }

    this.metrics.push(metric)
    this.notifyObservers(metric)

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    if (this.isEnabled) {
      console.log(`Performance Metric: ${name} = ${value}${unit}`)
    }
  }

  // Measure execution time of a function
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.recordMetric(name, duration)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordMetric(`${name}_error`, duration, 'ms', { error: error.message })
      throw error
    }
  }

  // Measure execution time of a synchronous function
  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start
      this.recordMetric(name, duration)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordMetric(`${name}_error`, duration, 'ms', { error: error.message })
      throw error
    }
  }

  // Add an observer for performance metrics
  addObserver(name: string, callback: (metric: PerformanceMetric) => void) {
    this.observers.push({ name, callback })
  }

  // Remove an observer
  removeObserver(name: string) {
    this.observers = this.observers.filter(obs => obs.name !== name)
  }

  // Notify all observers of a new metric
  private notifyObservers(metric: PerformanceMetric) {
    this.observers.forEach(observer => {
      try {
        observer.callback(metric)
      } catch (error) {
        console.error(`Error in performance observer ${observer.name}:`, error)
      }
    })
  }

  // Get metrics by name
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name)
    }
    return [...this.metrics]
  }

  // Get average metric value
  getAverageMetric(name: string): number | null {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return null

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0)
    return sum / metrics.length
  }

  // Get metrics summary
  getSummary(): Record<string, { count: number; average: number; min: number; max: number }> {
    const summary: Record<string, { count: number; average: number; min: number; max: number }> = {}
    
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, average: 0, min: Infinity, max: -Infinity }
      }
      
      const stats = summary[metric.name]
      stats.count++
      stats.min = Math.min(stats.min, metric.value)
      stats.max = Math.max(stats.max, metric.value)
      stats.average = (stats.average * (stats.count - 1) + metric.value) / stats.count
    })

    return summary
  }

  // Initialize Web Vitals monitoring
  private initializeWebVitals() {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry
          this.recordMetric('LCP', lastEntry.startTime, 'ms')
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        console.warn('LCP monitoring not supported:', error)
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime, 'ms')
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        console.warn('FID monitoring not supported:', error)
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries() as any[]
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          this.recordMetric('CLS', clsValue, 'score')
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('CLS monitoring not supported:', error)
      }
    }

    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.recordMetric('PageLoad', loadTime, 'ms')
    })

    // DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      const domReadyTime = performance.now()
      this.recordMetric('DOMReady', domReadyTime, 'ms')
    })
  }

  // Enable/disable monitoring
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  // Clear all metrics
  clear() {
    this.metrics = []
  }

  // Export metrics for analysis
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for common performance measurements
export const performance = {
  // Measure API call performance
  async measureApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    return performanceMonitor.measureAsync(`api_${name}`, apiCall)
  },

  // Measure component render time
  measureRender(name: string, renderFn: () => void) {
    return performanceMonitor.measureSync(`render_${name}`, renderFn)
  },

  // Measure database query performance
  async measureDbQuery<T>(name: string, query: () => Promise<T>): Promise<T> {
    return performanceMonitor.measureAsync(`db_${name}`, query)
  },

  // Measure file operation performance
  async measureFileOp<T>(name: string, operation: () => Promise<T>): Promise<T> {
    return performanceMonitor.measureAsync(`file_${name}`, operation)
  },

  // Record memory usage
  recordMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      performanceMonitor.recordMetric('MemoryUsed', memory.usedJSHeapSize, 'bytes')
      performanceMonitor.recordMetric('MemoryTotal', memory.totalJSHeapSize, 'bytes')
      performanceMonitor.recordMetric('MemoryLimit', memory.jsHeapSizeLimit, 'bytes')
    }
  },

  // Record network performance
  recordNetworkPerformance() {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        performanceMonitor.recordMetric('NetworkSpeed', connection.downlink, 'Mbps')
        performanceMonitor.recordMetric('NetworkLatency', connection.rtt, 'ms')
      }
    }
  },
}

// React hook for measuring component performance
export function usePerformanceMeasurement(name: string) {
  const startTime = React.useRef<number>(0)

  React.useEffect(() => {
    startTime.current = performance.now()
    
    return () => {
      const duration = performance.now() - startTime.current
      performanceMonitor.recordMetric(`component_${name}`, duration)
    }
  }, [name])

  return {
    measure: (operationName: string) => {
      const start = performance.now()
      return () => {
        const duration = performance.now() - start
        performanceMonitor.recordMetric(`component_${name}_${operationName}`, duration)
      }
    }
  }
}

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function WithPerformanceMonitoring(props: P) {
    usePerformanceMeasurement(componentName)
    return <Component {...props} />
  }
}

// Export the monitor instance and utilities
export default performanceMonitor 