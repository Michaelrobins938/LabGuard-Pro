import React, { useRef, useEffect, useCallback } from 'react';

// Create a proper performance polyfill
const createPerformancePolyfill = () => {
  const startTime = Date.now();
  
  return {
    now: () => Date.now() - startTime,
    mark: (name: string) => console.debug(`Performance mark: ${name}`),
    measure: (name: string, start?: string, end?: string) => console.debug(`Performance measure: ${name}`),
    getEntriesByType: (type: string) => [],
    getEntriesByName: (name: string) => [],
    clearMarks: (name?: string) => {},
    clearMeasures: (name?: string) => {}
  };
};

// Use proper performance API
const perf = typeof window !== 'undefined' && window.performance ? window.performance : createPerformancePolyfill();

export const PerformanceMonitor = {
  measureApiCall: async <T,>(name: string, apiCall: () => Promise<T>): Promise<T> => {
    const start = perf.now();
    try {
      const result = await apiCall();
      const duration = perf.now() - start;
      console.debug(`API call ${name} took ${duration}ms`);
      return result;
    } catch (error) {
      const duration = perf.now() - start;
      console.error(`API call ${name} failed after ${duration}ms`);
      throw error;
    }
  },

  measureRender: (name: string, renderFn: () => void): void => {
    const start = perf.now();
    renderFn();
    const duration = perf.now() - start;
    console.debug(`Render ${name} took ${duration}ms`);
  },

  measureDbQuery: async <T,>(name: string, query: () => Promise<T>): Promise<T> => {
    const start = perf.now();
    try {
      const result = await query();
      const duration = perf.now() - start;
      console.debug(`DB query ${name} took ${duration}ms`);
      return result;
    } catch (error) {
      const duration = perf.now() - start;
      console.error(`DB query ${name} failed after ${duration}ms`);
      throw error;
    }
  },

  measureFileOp: async <T,>(name: string, operation: () => Promise<T>): Promise<T> => {
    const start = perf.now();
    try {
      const result = await operation();
      const duration = perf.now() - start;
      console.debug(`File operation ${name} took ${duration}ms`);
      return result;
    } catch (error) {
      const duration = perf.now() - start;
      console.error(`File operation ${name} failed after ${duration}ms`);
      throw error;
    }
  },

  recordMemoryUsage: (): void => {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      console.debug('Memory usage:', memory);
    }
  },

  recordNetworkUsage: (): void => {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      console.debug('Network info:', (navigator as any).connection);
    }
  }
};

export function usePerformanceMonitoring() {
  const measurementsRef = useRef<{ [key: string]: number[] }>({});

  const measure = useCallback(async (name: string, operation: () => Promise<any>) => {
    const start = perf.now();
    try {
      const result = await operation();
      const duration = perf.now() - start;
      
      if (!measurementsRef.current[name]) {
        measurementsRef.current[name] = [];
      }
      measurementsRef.current[name].push(duration);
      
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const getAverageTime = useCallback((name: string): number => {
    const measurements = measurementsRef.current[name];
    if (!measurements || measurements.length === 0) return 0;
    return measurements.reduce((a, b) => a + b, 0) / measurements.length;
  }, []);

  const clearMeasurements = useCallback((name?: string) => {
    if (name) {
      delete measurementsRef.current[name];
    } else {
      measurementsRef.current = {};
    }
  }, []);

  return {
    measure,
    getAverageTime,
    clearMeasurements,
    measurements: measurementsRef.current
  };
}

// Fix the React component
export const PerformanceMonitorComponent: React.FC = () => {
  const [metrics, setMetrics] = React.useState({
    apiCalls: 0,
    averageApiTime: 0,
    dbQueries: 0,
    averageDbTime: 0,
    renders: 0,
    averageRenderTime: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      PerformanceMonitor.recordMemoryUsage();
      PerformanceMonitor.recordNetworkUsage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="performance-monitor">
      <h3>Performance Metrics</h3>
      <div>API Calls: {metrics.apiCalls} (avg: {metrics.averageApiTime.toFixed(2)}ms)</div>
      <div>DB Queries: {metrics.dbQueries} (avg: {metrics.averageDbTime.toFixed(2)}ms)</div>
      <div>Renders: {metrics.renders} (avg: {metrics.averageRenderTime.toFixed(2)}ms)</div>
    </div>
  );
};

export default PerformanceMonitor; 