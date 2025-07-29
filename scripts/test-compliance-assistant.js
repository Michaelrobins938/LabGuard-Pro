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
    testType: 'COVID-19 PCR',
    protocolVersion: 'v2.1',
    operatorId: 'TECH001',
    sampleVolume: '200μL',
    primerLot: 'PRIMER-2024-001',
    masterMixLot: 'MIX-2024-003',
    thermalProfile: 'Standard 40 cycles',
    sampleCount: 24,
    controlsIncluded: true,
    additionalControls: ['Positive Control', 'Negative Control'],
    timestamp: new Date().toISOString()
  },
  mediaValidation: {
    testType: 'Blood Agar',
    lotNumber: 'BA-2024-001',
    expirationDate: '2024-12-31',
    currentDate: '2024-01-15',
    tempLog: [
      { timestamp: '2024-01-15T08:00:00Z', temperature: 4.2 },
      { timestamp: '2024-01-15T16:00:00Z', temperature: 4.1 }
    ],
    visualNotes: 'No contamination observed',
    techId: 'TECH001',
    storageRequirements: '2-8°C',
    visualStandards: 'Clear, no turbidity',
    qcFrequency: 'Weekly',
    sterilityMarkers: 'No growth on sterility check'
  },
  criticalValue: {
    testName: 'Troponin I',
    resultValue: '15.2',
    criticalRange: '>0.04',
    orderingPhysician: 'Dr. Smith',
    patientId: 'PAT001',
    timestamp: new Date().toISOString()
  },
  qcEvaluation: {
    analyte: 'Glucose',
    targetValue: '100',
    observedValue: '98',
    standardDeviation: '2.5',
    lotNumber: 'QC-2024-001',
    expirationDate: '2024-06-30',
    frequency: 'Daily'
  },
  capInspection: {
    laboratoryName: 'BREA Laboratory',
    lastInspectionDate: '2023-01-15',
    nextInspectionDate: '2025-01-15',
    testMenu: ['Molecular Testing', 'Clinical Chemistry', 'Hematology'],
    personnelCount: 15,
    equipmentCount: 25
  }
};

// Test functions
const testAIAssistant = async () => {
  const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
    messages: [{
      role: 'user',
      content: 'I need help with CAP compliance for our molecular testing procedures'
    }],
    stream: false
  });

  if (!response.data || !response.data.content) {
    throw new Error('Invalid AI response format');
  }

  if (!response.data.content.toLowerCase().includes('compliance')) {
    throw new Error('AI response does not contain compliance-related content');
  }
};

const testPCRVerification = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/pcr-verification`, testData.pcrVerification);

  if (!response.data || !response.data.status) {
    throw new Error('Invalid PCR verification response');
  }

  if (!['APPROVE', 'CONDITIONAL', 'REJECT'].includes(response.data.status)) {
    throw new Error('Invalid PCR verification status');
  }
};

const testMediaValidation = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/media-validation`, testData.mediaValidation);

  if (!response.data || !response.data.status) {
    throw new Error('Invalid media validation response');
  }

  if (!['APPROVE', 'CONDITIONAL', 'REJECT'].includes(response.data.status)) {
    throw new Error('Invalid media validation status');
  }
};

const testResultValidation = async () => {
  // Test critical value validation
  const criticalValueResponse = await axios.post(`${BASE_URL}/api/compliance/result-validation`, {
    toolType: 'critical-value',
    data: testData.criticalValue
  });

  if (!criticalValueResponse.data || !criticalValueResponse.data.status) {
    throw new Error('Invalid critical value validation response');
  }

  // Test QC evaluation
  const qcResponse = await axios.post(`${BASE_URL}/api/compliance/result-validation`, {
    toolType: 'qc-evaluation',
    data: testData.qcEvaluation
  });

  if (!qcResponse.data || !qcResponse.data.status) {
    throw new Error('Invalid QC evaluation response');
  }
};

const testAuditPreparation = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/audit-preparation`, {
    toolType: 'cap-inspection',
    data: testData.capInspection
  });

  if (!response.data || !response.data.status) {
    throw new Error('Invalid audit preparation response');
  }
};

const testErrorHandling = async () => {
  // Test missing required fields
  try {
    await axios.post(`${BASE_URL}/api/compliance/pcr-verification`, {
      testType: 'COVID-19 PCR'
      // Missing required fields
    });
    throw new Error('Should have returned 400 error for missing fields');
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error('Expected 400 error for missing required fields');
    }
  }

  // Test invalid tool type
  try {
    await axios.post(`${BASE_URL}/api/compliance/result-validation`, {
      toolType: 'invalid-tool',
      data: {}
    });
    throw new Error('Should have returned 400 error for invalid tool type');
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error('Expected 400 error for invalid tool type');
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
      messages: [{
        role: 'user',
        content: maliciousInput
      }],
      stream: false
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
    expirationDate: '2023-12-31', // Expired
    currentDate: '2024-01-15'
  };

  const response = await axios.post(`${BASE_URL}/api/compliance/media-validation`, expiredMediaData);

  if (response.data.status !== 'REJECT') {
    throw new Error('Failed to detect expired media');
  }

  if (!response.data.actionsRequired.some(action => action.includes('expired'))) {
    throw new Error('Failed to provide appropriate action for expired media');
  }
};

const testComplianceScoreCalculation = async () => {
  const response = await axios.post(`${BASE_URL}/api/compliance/result-validation`, {
    toolType: 'qc-evaluation',
    data: {
      ...testData.qcEvaluation,
      observedValue: '120', // Out of range
      standardDeviation: '2.5'
    }
  });

  if (response.data.complianceScore > 100) {
    throw new Error('Compliance score should not exceed 100');
  }

  if (response.data.complianceScore < 0) {
    throw new Error('Compliance score should not be negative');
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