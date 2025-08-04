#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance test runner configuration
const PERFORMANCE_CONFIG = {
  testSuites: [
    {
      name: 'Database Performance',
      files: ['bulk-sample-processing.test.ts'],
      timeout: 300000, // 5 minutes
      maxMemory: '2GB'
    },
    {
      name: 'Frontend Performance',
      files: ['frontend-performance.test.ts'],
      timeout: 600000, // 10 minutes
      maxMemory: '1GB'
    }
  ],
  reports: {
    outputDir: './tests/performance/reports',
    formats: ['html', 'json', 'junit']
  },
  thresholds: {
    responseTime: 1000,     // ms
    throughput: 50,         // requests/sec
    errorRate: 0.05,        // 5%
    memoryUsage: 512,       // MB
    loadTime: 3000          // ms
  }
};

class PerformanceTestRunner {
  constructor(config) {
    this.config = config;
    this.results = [];
    this.startTime = Date.now();
  }

  async run() {
    console.log('🚀 LabGuard-Pro Performance Test Suite');
    console.log('=' .repeat(60));
    console.log(`Started at: ${new Date().toISOString()}`);
    console.log(`Test suites: ${this.config.testSuites.length}`);
    console.log('');

    // Ensure reports directory exists
    this.ensureReportsDirectory();

    // Set environment variables
    this.setupEnvironment();

    // Run each test suite
    for (const suite of this.config.testSuites) {
      console.log(`\n📋 Running ${suite.name}...`);
      const result = await this.runTestSuite(suite);
      this.results.push(result);
    }

    // Generate summary report
    await this.generateSummaryReport();

    // Check thresholds and exit
    this.checkThresholdsAndExit();
  }

  ensureReportsDirectory() {
    const reportDir = this.config.reports.outputDir;
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
      console.log(`✅ Created reports directory: ${reportDir}`);
    }
  }

  setupEnvironment() {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.TEST_MODE = 'performance';
    process.env.JEST_TIMEOUT = '300000';
    
    // Database URL for tests (use separate test database)
    if (!process.env.TEST_DATABASE_URL) {
      process.env.TEST_DATABASE_URL = 'postgresql://test:test@localhost:5432/labguard_test';
    }

    // Frontend URL for browser tests
    if (!process.env.TEST_FRONTEND_URL) {
      process.env.TEST_FRONTEND_URL = 'http://localhost:3000';
    }

    console.log('✅ Environment configured for performance testing');
  }

  async runTestSuite(suite) {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const jestArgs = [
        '--config', './tests/performance/performance.config.js',
        '--testTimeout', suite.timeout.toString(),
        '--maxWorkers', '1',
        '--forceExit',
        '--detectOpenHandles',
        '--testNamePattern', suite.name.replace(/\s+/g, '.*'),
        ...suite.files.map(file => `./tests/performance/${file}`)
      ];

      console.log(`   Running: jest ${jestArgs.join(' ')}`);

      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let stdout = '';
      let stderr = '';

      jest.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        // Show real-time output for important messages
        if (output.includes('Performance') || output.includes('PASS') || output.includes('FAIL')) {
          process.stdout.write(output);
        }
      });

      jest.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        // Show errors immediately
        if (output.includes('ERROR') || output.includes('TIMEOUT')) {
          process.stderr.write(output);
        }
      });

      jest.on('close', (code) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        const result = {
          suite: suite.name,
          exitCode: code,
          duration,
          stdout,
          stderr,
          success: code === 0,
          timestamp: new Date().toISOString()
        };

        console.log(`   ${result.success ? '✅' : '❌'} ${suite.name} - ${(duration / 1000).toFixed(2)}s`);
        
        if (!result.success) {
          console.log(`   Error output: ${stderr.substring(0, 500)}...`);
        }

        resolve(result);
      });

      jest.on('error', (error) => {
        console.error(`   ❌ Failed to start ${suite.name}:`, error);
        resolve({
          suite: suite.name,
          exitCode: 1,
          duration: Date.now() - startTime,
          stdout: '',
          stderr: error.message,
          success: false,
          timestamp: new Date().toISOString()
        });
      });
    });
  }

  async generateSummaryReport() {
    const totalDuration = Date.now() - this.startTime;
    const successfulSuites = this.results.filter(r => r.success).length;
    const failedSuites = this.results.filter(r => !r.success).length;

    const summary = {
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date().toISOString(),
      totalDuration,
      totalSuites: this.results.length,
      successfulSuites,
      failedSuites,
      successRate: (successfulSuites / this.results.length) * 100,
      results: this.results,
      config: this.config,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
        cpus: require('os').cpus().length
      }
    };

    // Save JSON report
    const jsonReport = path.join(this.config.reports.outputDir, 'performance-summary.json');
    fs.writeFileSync(jsonReport, JSON.stringify(summary, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(summary);
    const htmlReportPath = path.join(this.config.reports.outputDir, 'performance-summary.html');
    fs.writeFileSync(htmlReportPath, htmlReport);

    // Console summary
    console.log('\n📊 Performance Test Summary');
    console.log('=' .repeat(60));
    console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`Test Suites: ${successfulSuites}/${this.results.length} passed`);
    console.log(`Success Rate: ${summary.successRate.toFixed(1)}%`);
    console.log(`Reports saved to: ${this.config.reports.outputDir}`);

    if (failedSuites > 0) {
      console.log('\n❌ Failed Suites:');
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`   • ${result.suite}: Exit code ${result.exitCode}`);
      });
    }
  }

  generateHTMLReport(summary) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LabGuard-Pro Performance Test Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .metric {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #333;
        }
        .metric-label {
            color: #666;
            margin-top: 5px;
        }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
        .results {
            padding: 30px;
        }
        .suite {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        .suite-header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .suite-title {
            font-weight: bold;
            color: #333;
        }
        .suite-status {
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-size: 0.9em;
        }
        .status-success { background: #28a745; }
        .status-failed { background: #dc3545; }
        .suite-details {
            padding: 20px;
            background: white;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            margin-bottom: 0;
            border-bottom: none;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            color: #666;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 LabGuard-Pro Performance Report</h1>
            <p>West Nile Virus Laboratory Management System</p>
            <p>Generated on ${new Date(summary.endTime).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value ${summary.successRate === 100 ? 'success' : summary.successRate >= 80 ? 'warning' : 'danger'}">
                    ${summary.successRate.toFixed(1)}%
                </div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(summary.totalDuration / 1000).toFixed(1)}s</div>
                <div class="metric-label">Total Duration</div>
            </div>
            <div class="metric">
                <div class="metric-value success">${summary.successfulSuites}</div>
                <div class="metric-label">Passed Suites</div>
            </div>
            <div class="metric">
                <div class="metric-value ${summary.failedSuites > 0 ? 'danger' : 'success'}">${summary.failedSuites}</div>
                <div class="metric-label">Failed Suites</div>
            </div>
        </div>
        
        <div class="results">
            <h2>Test Suite Results</h2>
            ${summary.results.map(result => `
                <div class="suite">
                    <div class="suite-header">
                        <div class="suite-title">${result.suite}</div>
                        <div class="suite-status ${result.success ? 'status-success' : 'status-failed'}">
                            ${result.success ? 'PASSED' : 'FAILED'}
                        </div>
                    </div>
                    <div class="suite-details">
                        <div class="detail-row">
                            <span>Duration:</span>
                            <span>${(result.duration / 1000).toFixed(2)}s</span>
                        </div>
                        <div class="detail-row">
                            <span>Exit Code:</span>
                            <span>${result.exitCode}</span>
                        </div>
                        <div class="detail-row">
                            <span>Timestamp:</span>
                            <span>${new Date(result.timestamp).toLocaleString()}</span>
                        </div>
                        ${!result.success && result.stderr ? `
                        <div class="detail-row">
                            <span>Error Output:</span>
                            <span style="color: #dc3545; font-family: monospace; font-size: 0.9em;">
                                ${result.stderr.substring(0, 200)}${result.stderr.length > 200 ? '...' : ''}
                            </span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>Report generated by LabGuard-Pro Performance Test Suite</p>
            <p>Node.js ${summary.environment.nodeVersion} • ${summary.environment.platform} ${summary.environment.arch}</p>
        </div>
    </div>
</body>
</html>`;
  }

  checkThresholdsAndExit() {
    const failedSuites = this.results.filter(r => !r.success).length;
    const successRate = (this.results.filter(r => r.success).length / this.results.length) * 100;

    console.log('\n🎯 Threshold Check');
    console.log('=' .repeat(60));

    let allThresholdsPassed = true;

    // Check success rate threshold
    const minSuccessRate = 90; // 90% minimum
    if (successRate < minSuccessRate) {
      console.log(`❌ Success rate threshold: ${successRate.toFixed(1)}% < ${minSuccessRate}%`);
      allThresholdsPassed = false;
    } else {
      console.log(`✅ Success rate threshold: ${successRate.toFixed(1)}% >= ${minSuccessRate}%`);
    }

    // Check if any critical tests failed
    const criticalSuites = ['Database Performance'];
    const failedCriticalSuites = this.results.filter(r => 
      !r.success && criticalSuites.includes(r.suite)
    );

    if (failedCriticalSuites.length > 0) {
      console.log(`❌ Critical test suites failed: ${failedCriticalSuites.map(s => s.suite).join(', ')}`);
      allThresholdsPassed = false;
    } else {
      console.log('✅ All critical test suites passed');
    }

    // Exit with appropriate code
    if (allThresholdsPassed) {
      console.log('\n🎉 All performance thresholds passed!');
      process.exit(0);
    } else {
      console.log('\n💥 Some performance thresholds failed!');
      process.exit(1);
    }
  }
}

// Check if required dependencies are available
function checkDependencies() {
  const requiredCommands = ['npx', 'jest'];
  
  for (const cmd of requiredCommands) {
    try {
      require('child_process').execSync(`which ${cmd}`, { stdio: 'ignore' });
    } catch (error) {
      console.error(`❌ Required command not found: ${cmd}`);
      console.error('Please install the required dependencies:');
      console.error('npm install -g jest');
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  try {
    checkDependencies();
    
    const runner = new PerformanceTestRunner(PERFORMANCE_CONFIG);
    await runner.run();
  } catch (error) {
    console.error('💥 Performance test runner failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { PerformanceTestRunner, PERFORMANCE_CONFIG };