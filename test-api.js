const https = require('https');

// Test the API endpoints
async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');
  
  const baseUrl = 'https://lab-guard-pro-w6dt-b69g7tgo0-michaels-projects-19e37f0b.vercel.app';
  
  // Test billing plans API
  try {
    const response = await fetch(`${baseUrl}/api/billing/plans`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Billing Plans API:', data);
    } else {
      console.log('❌ Billing Plans API failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Billing Plans API error:', error.message);
  }
  
  // Test webhook endpoint
  try {
    const response = await fetch(`${baseUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    console.log('✅ Webhook endpoint accessible:', response.status);
  } catch (error) {
    console.log('❌ Webhook endpoint error:', error.message);
  }
}

testAPI(); 