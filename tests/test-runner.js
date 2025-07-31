#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const LabGuardCLI = require('../cli/labguard.js');

class TestRunner {
  constructor() {
    this.testsPath = path.join(__dirname, 'calibration-tests.json');
    this.cli = new LabGuardCLI();
  }

  async loadTests() {
    if (!fs.existsSync(this.testsPath)) {
      throw new Error(`Test file not found: ${this.testsPath}`);
    }

    const testContent = fs.readFileSync(this.testsPath, 'utf8');
    return JSON.parse(testContent);
  }

  validateResult(result, expected) {
    const errors = [];

    // Check status
    if (result.status !== expected.status) {
      errors.push(`Expected status ${expected.status}, got ${result.status}`);
    }

    // Check recommendation
    if (result.recommendation !== expected.recommendation) {
      errors.push(`Expected recommendation ${expected.recommendation}, got ${result.recommendation}`);
    }

    // Check days_overdue
    if (expected.days_overdue.type === 'number') {
      if (expected.days_overdue.value !== undefined) {
        if (result.days_overdue !== expected.days_overdue.value) {
          errors.push(`Expected days_overdue ${expected.days_overdue.value}, got ${result.days_overdue}`);
        }
      } else if (expected.days_overdue.min !== undefined || expected.days_overdue.max !== undefined) {
        if (expected.days_overdue.min !== undefined && result.days_overdue < expected.days_overdue.min) {
          errors.push(`Expected days_overdue >= ${expected.days_overdue.min}, got ${result.days_overdue}`);
        }
        if (expected.days_overdue.max !== undefined && result.days_overdue > expected.days_overdue.max) {
          errors.push(`Expected days_overdue <= ${expected.days_overdue.max}, got ${result.days_overdue}`);
        }
      }
    }

    return errors;
  }

  async runTest(test) {
    console.log(`\n🧪 Running test: ${test.name}`);
    console.log(`   Description: ${test.description}`);
    console.log(`   Input: ${JSON.stringify(test.input)}`);

    try {
      // Execute the agent logic directly
      const result = await this.cli.executeAgentLogic(null, test.input);
      
      // Validate result
      const errors = this.validateResult(result, test.expected);
      
      if (errors.length === 0) {
        console.log(`   ✅ PASS`);
        console.log(`   Result: ${result.message}`);
        return { passed: true, result, errors: [] };
      } else {
        console.log(`   ❌ FAIL`);
        errors.forEach(error => console.log(`   Error: ${error}`));
        return { passed: false, result, errors };
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      return { passed: false, result: null, errors: [error.message] };
    }
  }

  async runAllTests() {
    console.log('🚀 Starting LabGuard-Pro Test Suite');
    console.log('=====================================');

    try {
      const testSuite = await this.loadTests();
      console.log(`\n📋 Test Suite: ${testSuite.testSuite}`);
      console.log(`   Description: ${testSuite.description}`);
      console.log(`   Version: ${testSuite.version}`);
      console.log(`   Total Tests: ${testSuite.tests.length}`);

      const results = {
        total: testSuite.tests.length,
        passed: 0,
        failed: 0,
        errors: 0,
        details: []
      };

      for (const test of testSuite.tests) {
        const result = await this.runTest(test);
        
        if (result.passed) {
          results.passed++;
        } else if (result.result) {
          results.failed++;
        } else {
          results.errors++;
        }
        
        results.details.push({
          name: test.name,
          passed: result.passed,
          errors: result.errors
        });
      }

      // Print summary
      console.log('\n📊 Test Results Summary');
      console.log('========================');
      console.log(`   Total: ${results.total}`);
      console.log(`   ✅ Passed: ${results.passed}`);
      console.log(`   ❌ Failed: ${results.failed}`);
      console.log(`   💥 Errors: ${results.errors}`);
      console.log(`   📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

      // Print detailed results
      if (results.failed > 0 || results.errors > 0) {
        console.log('\n📋 Detailed Results:');
        results.details.forEach(detail => {
          const status = detail.passed ? '✅' : '❌';
          console.log(`   ${status} ${detail.name}`);
          if (!detail.passed && detail.errors.length > 0) {
            detail.errors.forEach(error => {
              console.log(`      - ${error}`);
            });
          }
        });
      }

      // Exit with appropriate code
      const exitCode = results.failed === 0 && results.errors === 0 ? 0 : 1;
      process.exit(exitCode);

    } catch (error) {
      console.error(`\n💥 Test suite failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests();
}

module.exports = TestRunner; 