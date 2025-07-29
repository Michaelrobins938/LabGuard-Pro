#!/usr/bin/env node

/**
 * Test script for Vercel deployment
 * Run this after deploying to verify everything works
 */

const https = require('https');
const http = require('http');

// Get the domain from command line or use default
const domain = process.argv[2] || 'your-vercel-domain.vercel.app';
const isHttps = domain.includes('vercel.app') || domain.includes('https://');

const baseUrl = isHttps ? `https://${domain.replace('https://', '')}` : `http://${domain.replace('http://', '')}`;

console.log(`🧪 Testing LabGuard Pro deployment on: ${baseUrl}`);
console.log('=' .repeat(50));

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function runTests() {
  const tests = [
    {
      name: 'Health Check',
      url: `${baseUrl}/api/health`,
      expectedStatus: 200
    },
    {
      name: 'Registration (should work)',
      url: `${baseUrl}/api/auth/register`,
      method: 'POST',
      body: {
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123',
        confirmPassword: 'testpassword123',
        firstName: 'Test',
        lastName: 'User',
        laboratoryName: 'Test Laboratory'
      },
      expectedStatus: 200
    },
    {
      name: 'Login (should work)',
      url: `${baseUrl}/api/auth/login`,
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'testpassword123'
      },
      expectedStatus: 401 // Should fail with invalid credentials
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const response = await makeRequest(test.url, {
        method: test.method,
        body: test.body
      });

      if (response.status === test.expectedStatus) {
        console.log(`   ✅ PASS - Status: ${response.status}`);
        if (response.data && typeof response.data === 'object') {
          console.log(`   📄 Response: ${JSON.stringify(response.data, null, 2)}`);
        }
      } else {
        console.log(`   ❌ FAIL - Expected: ${test.expectedStatus}, Got: ${response.status}`);
        console.log(`   📄 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Test Summary:');
  console.log('   - Health check should return 200');
  console.log('   - Registration should work with unique email');
  console.log('   - Login should fail with invalid credentials (401)');
  console.log('\n📝 Next Steps:');
  console.log('   1. Test registration with a real email');
  console.log('   2. Test login with the registered credentials');
  console.log('   3. Test protected routes with authentication');
}

// Run the tests
runTests().catch(console.error); 