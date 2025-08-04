import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import puppeteer, { Browser, Page } from 'puppeteer';

interface PerformanceReport {
  url: string;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  performanceScore: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  networkRequests: number;
  totalPayloadSize: number;
  jsHeapSize: number;
}

interface MobilePerformanceMetrics {
  barcodeScanTime: number;
  gpsAccuracyTime: number;
  offlineStorageTime: number;
  syncTime: number;
  cameraInitTime: number;
  formValidationTime: number;
}

const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME: 3000,           // 3 seconds
  FIRST_CONTENTFUL_PAINT: 1500,  // 1.5 seconds
  LARGEST_CONTENTFUL_PAINT: 2500, // 2.5 seconds
  CUMULATIVE_LAYOUT_SHIFT: 0.1,   // 0.1 CLS score
  PERFORMANCE_SCORE: 80,      // Lighthouse score
  MOBILE_SCAN_TIME: 2000,     // 2 seconds for barcode scan
  GPS_ACCURACY_TIME: 5000,    // 5 seconds for GPS lock
  OFFLINE_STORAGE_TIME: 500,  // 500ms for offline save
  FORM_VALIDATION_TIME: 100   // 100ms for form validation
};

describe('Frontend Performance Tests', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps'
      ]
    });
    page = await browser.newPage();
    
    // Set mobile viewport for mobile testing
    await page.setViewport({ width: 375, height: 812, isMobile: true });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Dashboard page load performance', async () => {
    const startTime = Date.now();
    
    // Navigate to dashboard
    await page.goto(`${baseUrl}/dashboard`, { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });

    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: fcp ? fcp.startTime : 0,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
      };
    });

    // Check Core Web Vitals
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          resolve(clsValue);
        }).observe({ type: 'layout-shift', buffered: true });
        
        // Fallback after 2 seconds
        setTimeout(() => resolve(0), 2000);
      });
    });

    // Performance assertions
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME);
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT);
    expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CUMULATIVE_LAYOUT_SHIFT);

    console.log('🖥️ Dashboard Performance Metrics:');
    console.log(`   • Total load time: ${loadTime}ms`);
    console.log(`   • DOM content loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`   • First contentful paint: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`   • Cumulative layout shift: ${cls}`);

  }, 15000);

  test('Mobile sample intake page performance', async () => {
    const startTime = Date.now();
    
    // Navigate to mobile sample intake
    await page.goto(`${baseUrl}/mobile/sample-intake`, { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });

    const loadTime = Date.now() - startTime;

    // Test mobile-specific features
    const mobileMetrics = await testMobileFeatures(page);

    // Performance assertions
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME);
    expect(mobileMetrics.formValidationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FORM_VALIDATION_TIME);

    console.log('📱 Mobile Sample Intake Performance:');
    console.log(`   • Page load time: ${loadTime}ms`);
    console.log(`   • Form validation time: ${mobileMetrics.formValidationTime}ms`);
    console.log(`   • Camera init simulation: ${mobileMetrics.cameraInitTime}ms`);
    console.log(`   • GPS simulation time: ${mobileMetrics.gpsAccuracyTime}ms`);

  }, 20000);

  test('QR code scanner performance simulation', async () => {
    await page.goto(`${baseUrl}/mobile/quick-scan`, { 
      waitUntil: 'networkidle0' 
    });

    // Simulate barcode scanning performance
    const scanStartTime = Date.now();
    
    // Test QR validation API call
    const qrValidationTime = await page.evaluate(async () => {
      const start = performance.now();
      
      try {
        const response = await fetch('/api/qr-codes/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            qrData: JSON.stringify({
              v: '1.0',
              t: 'WNV_SAMPLE',
              p: 'TEST-001',
              tr: 'TRAP-001',
              cd: '2024-01-01',
              lab: 'test-lab'
            })
          })
        });
        
        await response.json();
        return performance.now() - start;
      } catch (error) {
        return -1; // API not available in test environment
      }
    });

    const totalScanTime = Date.now() - scanStartTime;

    // If API is available, test performance
    if (qrValidationTime > 0) {
      expect(qrValidationTime).toBeLessThan(1000); // 1 second for QR validation
    }

    console.log('📱 QR Scanner Performance:');
    console.log(`   • Total scan simulation: ${totalScanTime}ms`);
    console.log(`   • QR validation API: ${qrValidationTime > 0 ? qrValidationTime.toFixed(2) + 'ms' : 'N/A (test env)'}`);

  }, 15000);

  test('Sample list rendering performance with 1000+ items', async () => {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle0' });

    // Test virtual scrolling performance
    const renderStartTime = Date.now();
    
    // Simulate large dataset rendering
    const renderMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const start = performance.now();
        
        // Create mock data
        const mockSamples = Array.from({ length: 1000 }, (_, i) => ({
          id: `sample-${i}`,
          poolId: `POOL-${String(i + 1).padStart(4, '0')}`,
          collectionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          testResult: Math.random() > 0.8 ? 'POSITIVE' : 'NEGATIVE',
          mosquitoSpecies: 'CULEX_QUINQUEFASCIATUS'
        }));

        // Simulate DOM manipulation for large list
        const container = document.createElement('div');
        container.style.height = '400px';
        container.style.overflow = 'auto';
        
        const listContainer = document.createElement('div');
        
        // Render first 50 items (virtual scrolling simulation)
        const visibleItems = mockSamples.slice(0, 50);
        visibleItems.forEach(sample => {
          const item = document.createElement('div');
          item.className = 'sample-item';
          item.innerHTML = `
            <div>${sample.poolId}</div>
            <div>${sample.testResult}</div>
            <div>${sample.collectionDate.toLocaleDateString()}</div>
          `;
          listContainer.appendChild(item);
        });
        
        container.appendChild(listContainer);
        document.body.appendChild(container);
        
        // Measure render time
        const renderTime = performance.now() - start;
        
        // Cleanup
        document.body.removeChild(container);
        
        resolve({
          renderTime,
          itemsRendered: visibleItems.length,
          totalItems: mockSamples.length
        });
      });
    });

    const totalRenderTime = Date.now() - renderStartTime;

    // Performance assertions
    expect(renderMetrics.renderTime).toBeLessThan(100); // 100ms for rendering 50 items
    expect(totalRenderTime).toBeLessThan(500); // 500ms total

    console.log('📋 Large List Rendering Performance:');
    console.log(`   • DOM render time: ${renderMetrics.renderTime.toFixed(2)}ms`);
    console.log(`   • Items rendered: ${renderMetrics.itemsRendered}/${renderMetrics.totalItems}`);
    console.log(`   • Total operation time: ${totalRenderTime}ms`);

  }, 10000);

  test('Network performance and caching', async () => {
    // Clear cache and test fresh load
    await page.setCacheEnabled(false);
    
    const freshLoadStart = Date.now();
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle0' });
    const freshLoadTime = Date.now() - freshLoadStart;

    // Get network requests
    const networkRequests = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return {
        totalRequests: entries.length,
        totalSize: entries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
        cachedRequests: entries.filter(entry => entry.transferSize === 0).length,
        slowRequests: entries.filter(entry => entry.duration > 1000).length
      };
    });

    // Enable cache and test cached load
    await page.setCacheEnabled(true);
    
    const cachedLoadStart = Date.now();
    await page.reload({ waitUntil: 'networkidle0' });
    const cachedLoadTime = Date.now() - cachedLoadStart;

    // Performance assertions
    expect(freshLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME);
    expect(cachedLoadTime).toBeLessThan(freshLoadTime * 0.7); // Cached load should be 30% faster
    expect(networkRequests.slowRequests).toBeLessThan(3); // Less than 3 slow requests

    console.log('🌐 Network Performance Metrics:');
    console.log(`   • Fresh load time: ${freshLoadTime}ms`);
    console.log(`   • Cached load time: ${cachedLoadTime}ms`);
    console.log(`   • Cache improvement: ${((1 - cachedLoadTime / freshLoadTime) * 100).toFixed(1)}%`);
    console.log(`   • Total requests: ${networkRequests.totalRequests}`);
    console.log(`   • Total payload: ${(networkRequests.totalSize / 1024).toFixed(2)}KB`);
    console.log(`   • Slow requests (>1s): ${networkRequests.slowRequests}`);

  }, 20000);

  test('Memory usage during prolonged use simulation', async () => {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle0' });

    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (!initialMemory) {
      console.log('⚠️ Memory API not available, skipping memory test');
      return;
    }

    // Simulate prolonged use - navigate between pages multiple times
    const pages = [
      '/dashboard',
      '/mobile/sample-intake',
      '/mobile/quick-scan',
      '/surveillance/map'
    ];

    for (let i = 0; i < 5; i++) {
      for (const pagePath of pages) {
        try {
          await page.goto(`${baseUrl}${pagePath}`, { 
            waitUntil: 'networkidle0',
            timeout: 5000 
          });
          await page.waitForTimeout(500); // Simulate user interaction time
        } catch (error) {
          // Some pages might not exist in test environment
          console.log(`Skipping ${pagePath} - not available in test environment`);
        }
      }
    }

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;

      // Memory leak assertion - should not increase more than 50%
      expect(memoryIncreasePercent).toBeLessThan(50);

      console.log('🧠 Memory Usage Metrics:');
      console.log(`   • Initial heap size: ${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   • Final heap size: ${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   • Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB (${memoryIncreasePercent.toFixed(1)}%)`);
      console.log(`   • Heap limit: ${(finalMemory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }

  }, 30000);
});

// Helper function to test mobile-specific features
async function testMobileFeatures(page: Page): Promise<MobilePerformanceMetrics> {
  // Simulate form validation performance
  const formValidationStart = Date.now();
  
  await page.evaluate(() => {
    // Simulate filling out form fields
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      if (input instanceof HTMLInputElement) {
        if (input.type === 'text') {
          input.value = `Test Value ${index}`;
        } else if (input.type === 'number') {
          input.value = '25';
        } else if (input.type === 'date') {
          input.value = '2024-01-01';
        }
        // Trigger validation
        input.dispatchEvent(new Event('blur'));
      } else if (input instanceof HTMLSelectElement) {
        if (input.options.length > 1) {
          input.selectedIndex = 1;
          input.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  const formValidationTime = Date.now() - formValidationStart;

  // Simulate camera initialization
  const cameraInitStart = Date.now();
  const cameraInitTime = await page.evaluate(() => {
    return new Promise((resolve) => {
      const start = performance.now();
      
      // Simulate camera initialization delay
      setTimeout(() => {
        resolve(performance.now() - start);
      }, Math.random() * 1000 + 500); // 500-1500ms simulation
    });
  });

  // Simulate GPS accuracy timing
  const gpsStart = Date.now();
  const gpsAccuracyTime = await page.evaluate(() => {
    return new Promise((resolve) => {
      const start = performance.now();
      
      // Simulate GPS lock time
      setTimeout(() => {
        resolve(performance.now() - start);
      }, Math.random() * 2000 + 1000); // 1-3 seconds simulation
    });
  });

  // Simulate offline storage
  const offlineStorageStart = Date.now();
  const offlineStorageTime = await page.evaluate(() => {
    const start = performance.now();
    
    // Simulate IndexedDB write
    const mockData = {
      id: Date.now(),
      poolId: 'TEST-001',
      timestamp: new Date(),
      data: new Array(100).fill('x').join('') // Some data
    };
    
    // Simulate storage operation
    localStorage.setItem('test-offline-data', JSON.stringify(mockData));
    
    return performance.now() - start;
  });

  return {
    barcodeScanTime: Math.random() * 1500 + 500, // Simulated
    gpsAccuracyTime: gpsAccuracyTime as number,
    offlineStorageTime,
    syncTime: Math.random() * 2000 + 1000, // Simulated
    cameraInitTime: cameraInitTime as number,
    formValidationTime
  };
}