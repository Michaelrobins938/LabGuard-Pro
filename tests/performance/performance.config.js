module.exports = {
  // Jest configuration for performance tests
  testEnvironment: 'node',
  testMatch: ['**/performance/**/*.test.ts'],
  testTimeout: 60000, // 60 seconds for performance tests
  maxWorkers: 1, // Run performance tests sequentially to avoid interference
  setupFilesAfterEnv: ['<rootDir>/tests/performance/setup.ts'],
  
  // Performance test specific settings
  bail: false, // Continue running tests even if some fail
  verbose: true,
  
  // Memory and heap settings
  maxMemoryUsage: '2GB',
  
  // Custom test reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './tests/performance/reports',
      filename: 'performance-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'LabGuard-Pro Performance Test Report'
    }],
    ['jest-junit', {
      outputDirectory: './tests/performance/reports',
      outputName: 'performance-results.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],

  // Coverage settings (disabled for performance tests)
  collectCoverage: false,

  // Module settings
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Global settings for performance tests
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    },
    // Performance test configuration
    PERFORMANCE_CONFIG: {
      // Database connection for tests
      DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/labguard_test',
      
      // Frontend test server
      FRONTEND_URL: process.env.TEST_FRONTEND_URL || 'http://localhost:3000',
      
      // Backend API server
      API_URL: process.env.TEST_API_URL || 'http://localhost:5001',
      
      // Performance thresholds
      THRESHOLDS: {
        RESPONSE_TIME: 500,    // Max API response time in ms
        THROUGHPUT: 100,       // Min requests per second
        ERROR_RATE: 0.01,      // Max 1% error rate
        MEMORY_USAGE: 512,     // Max memory usage in MB
        CPU_USAGE: 80,         // Max CPU usage percentage
        LOAD_TIME: 3000,       // Max page load time in ms
        BUNDLE_SIZE: 5         // Max bundle size in MB
      },
      
      // Load testing configuration
      LOAD_TEST: {
        CONCURRENT_USERS: [1, 5, 10, 25, 50, 100],
        RAMP_UP_DURATION: 30,  // seconds
        TEST_DURATION: 300,    // seconds (5 minutes)
        COOL_DOWN: 30          // seconds
      },
      
      // Sample data configuration
      SAMPLE_DATA: {
        SMALL_DATASET: 100,
        MEDIUM_DATASET: 1000,
        LARGE_DATASET: 10000,
        STRESS_DATASET: 50000
      }
    }
  },

  // Environment variables for tests
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};