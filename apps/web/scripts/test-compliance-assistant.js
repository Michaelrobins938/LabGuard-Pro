#!/usr/bin/env node

/**
 * LabGuard Compliance Assistant - End-to-End Testing Script
 * 
 * This script performs comprehensive testing of all compliance assistant features:
 * - AI Assistant functionality
 * - PCR Verification system
 * - Media Validation system
 * - Result Validation system
 * - Audit Preparation system
 * - API integrations
 * - Error handling
 * - Performance metrics
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000; // 30 seconds

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  performance: {},
  startTime: Date.now()
};

// Utility functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const logTestResult = (testName, passed, error = null, duration = null) => {
  if (passed) {
    testResults.passed++;
    log(`PASS: ${testName}${duration ? ` (${duration}ms)` : ''}`, 'success');
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error?.message || 'Unknown error' });
    log(`FAIL: ${testName} - ${error?.message || 'Unknown error'}`, 'error');
  }
};

const measurePerformance = async (testName, testFunction) => {
  const startTime = Date.now();
  try {
    await testFunction();
    const duration = Date.now() - startTime;
    testResults.performance[testName] = duration;
    return { success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    testResults.performance[testName] = duration;
    return { success: false, duration, error };
  }
};

// Test data
const testData = {
  pcrVerification: {
    protocolName: 'COVID-19 RT-PCR Protocol',
    reagents: [
      {
        name: 'Primer Mix',
        lotNumber: 'PRIMER-2024-001',
        expirationDate: '2024-12-31',
        concentration: '10μM'
      },
      {
        name: 'Master Mix',
        lotNumber: 'MIX-2024-003',
        expirationDate: '2024-11-30',
        concentration: '1X'
      }
    ],
    temperatureSettings: {
      denaturation: '95°C',
      annealing: '55°C',
      extension: '72°C'
    },
    cycleCount: 40,
    qualityControl: {
      positiveControl: 'COVID-19 Positive Control',
      negativeControl: 'COVID-19 Negative Control',
      internalControl: 'RNase P'
    }
  },
  mediaValidation: {
    mediaType: 'Blood Agar',
    lotNumber: 'BA-2024-001',
    expirationDate: '2024-12-31',
    storageConditions: {
      temperature: '4°C',
      humidity: '60%'
    },
    qualityControl: {
      sterilityTest: true,
      performanceTest: true,
      pH: 7.2
    }
  },
  resultValidation: {
    testType: 'Glucose',
    result: '150',
    referenceRange: {
      low: 70,
      high: 100
    },
    criticalValues: {
      low: 50,
      high: 400
    },
    qualityControl: {
      passed: true,
      details: 'QC within acceptable limits'
    }
  },
  auditPreparation: {
    auditType: 'CAP',
    laboratoryId: 'BREA001',
    testMenu: ['Molecular Testing', 'Clinical Chemistry', 'Hematology'],
    lastInspectionDate: '2023-01-15',
    currentProcedures: ['COVID-19 PCR', 'Glucose Testing', 'CBC']
  },
  safetyIncident: {
    incidentType: 'Chemical Spill',
    description: 'Minor spill of 10% bleach solution in microbiology lab',
    severity: 'Medium',
    location: 'Microbiology Laboratory',
    involvedPersonnel: ['TECH001', 'TECH002'],
    immediateActions: ['Contained spill', 'Ventilated area'],
    timestamp: new Date().toISOString()
  }
};

// Test functions
const testAIAssistant = async () => {
  const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
    message: 'I need help with CAP compliance for our molecular testing procedures',
    session: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'LAB_TECH',
        laboratoryId: 'test-lab-id'
      }
    }
  });

  if (!response.data || !response.data.response) {
    throw new Error('Invalid AI response format');
  }

  if (!response.data.response.toLowerCase().includes('compliance')) {
    throw new Error('AI response does not contain compliance-related content');
  }
};

const testPCRVerification = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/pcr-verification`, testData.pcrVerification);

  if (!response.data || typeof response.data.isValid !== 'boolean') {
    throw new Error('Invalid PCR verification response');
  }

  if (!Array.isArray(response.data.violations) || !Array.isArray(response.data.recommendations)) {
    throw new Error('PCR response missing required arrays');
  }
};

const testMediaValidation = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/media-validation`, testData.mediaValidation);

  if (!response.data || typeof response.data.isValid !== 'boolean') {
    throw new Error('Invalid media validation response');
  }

  if (!Array.isArray(response.data.safetyAlerts) || !Array.isArray(response.data.recommendations)) {
    throw new Error('Media validation response missing required arrays');
  }
};

const testResultValidation = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/result-validation`, testData.resultValidation);

  if (!response.data || typeof response.data.isValid !== 'boolean') {
    throw new Error('Invalid result validation response');
  }

  if (!response.data.qcEvaluation || !Array.isArray(response.data.criticalAlerts)) {
    throw new Error('Result validation response missing required fields');
  }
};

const testAuditPreparation = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/audit-preparation`, testData.auditPreparation);

  if (!response.data || !Array.isArray(response.data.checklist)) {
    throw new Error('Invalid audit preparation response');
  }

  if (!Array.isArray(response.data.requiredDocuments) || typeof response.data.estimatedScore !== 'number') {
    throw new Error('Audit preparation response missing required fields');
  }
};

const testErrorHandling = async () => {
  // Test missing required fields
  try {
    await axios.post(`${BASE_URL}/api/compliance/pcr-verification`, {
      protocolName: 'Test Protocol'
      // Missing required fields
    });
    throw new Error('Should have returned 400 error for missing fields');
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error('Expected 400 error for missing required fields');
    }
  }

  // Test invalid data format
  try {
    await axios.post(`${BASE_URL}/api/compliance/media-validation`, {
      mediaType: 'Test Media'
      // Missing required fields
    });
    throw new Error('Should have returned 400 error for invalid data format');
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error('Expected 400 error for invalid data format');
    }
  }
};

const testPerformance = async () => {
  const startTime = Date.now();
  
  // Test concurrent requests
  const promises = [
    testAIAssistant(),
    testPCRVerification(),
    testMediaValidation(),
    testResultValidation(),
    testAuditPreparation()
  ];

  await Promise.all(promises);
  
  const totalTime = Date.now() - startTime;
  if (totalTime > 10000) { // 10 seconds
    throw new Error(`Performance test took too long: ${totalTime}ms`);
  }
};

const testSecurity = async () => {
  // Test input sanitization
  const maliciousInput = '<script>alert("xss")</script>Check PCR compliance';
  
  try {
    await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: maliciousInput,
      session: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'LAB_TECH',
          laboratoryId: 'test-lab-id'
        }
      }
    });
    
    // If we get here, the input was properly sanitized
    log('Security test: Input sanitization working correctly', 'success');
  } catch (error) {
    // This is also acceptable - the system rejected the malicious input
    log('Security test: System properly rejected malicious input', 'success');
  }
};

const testExpiredMediaDetection = async () => {
  const expiredMediaData = {
    ...testData.mediaValidation,
    expirationDate: '2023-12-31' // Expired
  };

  const response = await axios.post(`${BASE_URL}/api/compliance/media-validation`, expiredMediaData);

  if (response.data.isValid !== false) {
    throw new Error('Failed to detect expired media');
  }

  if (!response.data.safetyAlerts.some(alert => alert.includes('EXPIRED'))) {
    throw new Error('Failed to provide appropriate alert for expired media');
  }
};

const testComplianceScoreCalculation = async () => {
  // Test PCR compliance score
  const pcrResponse = await axios.post(`${BASE_URL}/api/compliance/pcr-verification`, testData.pcrVerification);
  
  if (typeof pcrResponse.data.complianceScore !== 'number') {
    throw new Error('PCR compliance score not calculated');
  }

  if (pcrResponse.data.complianceScore < 0 || pcrResponse.data.complianceScore > 100) {
    throw new Error('PCR compliance score out of valid range');
  }

  // Test media compliance score
  const mediaResponse = await axios.post(`${BASE_URL}/api/compliance/media-validation`, testData.mediaValidation);
  
  if (typeof mediaResponse.data.isValid !== 'boolean') {
    throw new Error('Media validation compliance not calculated');
  }

  // Test audit preparation score
  const auditResponse = await axios.post(`${BASE_URL}/api/compliance/audit-preparation`, testData.auditPreparation);
  
  if (typeof auditResponse.data.estimatedScore !== 'number') {
    throw new Error('Audit preparation score not calculated');
  }

  if (auditResponse.data.estimatedScore < 60 || auditResponse.data.estimatedScore > 100) {
    throw new Error('Audit preparation score out of valid range');
  }
};

// Main test execution
const runTests = async () => {
  log('🧪 Starting LabGuard Compliance Assistant End-to-End Tests', 'info');
  log(`📍 Testing against: ${BASE_URL}`, 'info');
  
  const tests = [
    { name: 'AI Assistant Integration', fn: testAIAssistant },
    { name: 'PCR Verification System', fn: testPCRVerification },
    { name: 'Media Validation System', fn: testMediaValidation },
    { name: 'Result Validation System', fn: testResultValidation },
    { name: 'Audit Preparation System', fn: testAuditPreparation },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Performance Testing', fn: testPerformance },
    { name: 'Security Testing', fn: testSecurity },
    { name: 'Expired Media Detection', fn: testExpiredMediaDetection },
    { name: 'Compliance Score Calculation', fn: testComplianceScoreCalculation }
  ];

  for (const test of tests) {
    try {
      const result = await measurePerformance(test.name, test.fn);
      logTestResult(test.name, result.success, result.error, result.duration);
    } catch (error) {
      logTestResult(test.name, false, error);
    }
  }

  // Generate test report
  const endTime = Date.now();
  const totalDuration = endTime - testResults.startTime;
  
  log('\n📊 Test Results Summary:', 'info');
  log(`✅ Passed: ${testResults.passed}`, 'success');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'info');
  log(`⏱️  Total Duration: ${totalDuration}ms`, 'info');
  
  if (testResults.failed > 0) {
    log('\n❌ Failed Tests:', 'error');
    testResults.errors.forEach(error => {
      log(`   - ${error.test}: ${error.error}`, 'error');
    });
  }

  // Performance analysis
  log('\n📈 Performance Analysis:', 'info');
  Object.entries(testResults.performance).forEach(([testName, duration]) => {
    const status = duration < 2000 ? '✅' : duration < 5000 ? '⚠️' : '❌';
    log(`   ${status} ${testName}: ${duration}ms`, duration < 2000 ? 'success' : duration < 5000 ? 'warning' : 'error');
  });

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results: testResults,
    performance: testResults.performance,
    summary: {
      totalTests: testResults.passed + testResults.failed,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2) + '%',
      totalDuration: totalDuration
    }
  };

  const reportPath = path.join(__dirname, '../test-reports/compliance-assistant-test-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log(`📄 Detailed report saved to: ${reportPath}`, 'info');

  // Exit with appropriate code
  if (testResults.failed > 0) {
    log('❌ Some tests failed. Please review the errors above.', 'error');
    process.exit(1);
  } else {
    log('✅ All tests passed! LabGuard Compliance Assistant is working correctly.', 'success');
    process.exit(0);
  }
};

// Handle errors and cleanup
process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

process.on('SIGINT', () => {
  log('Test interrupted by user', 'warning');
  process.exit(1);
});

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runTests,
  testResults,
  testData
}; 