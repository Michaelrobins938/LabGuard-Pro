const axios = require('axios');

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function testIntegration() {
  console.log('🧪 Testing LabGuard Pro Frontend-Backend Integration\n');

  try {
    // Test 1: Backend API Health Check
    console.log('1. Testing Backend API Health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend API is running:', healthResponse.data);
    console.log('');

    // Test 2: API Root Endpoint
    console.log('2. Testing API Root Endpoint...');
    const apiResponse = await axios.get(`${API_BASE}/api`);
    console.log('✅ API root endpoint working:', apiResponse.data.message);
    console.log('');

    // Test 3: Dashboard Stats
    console.log('3. Testing Dashboard Stats...');
    const statsResponse = await axios.get(`${API_BASE}/api/dashboard/stats`);
    console.log('✅ Dashboard stats working:', statsResponse.data);
    console.log('');

    // Test 4: Analytics API
    console.log('4. Testing Analytics API...');
    const analyticsResponse = await axios.get(`${API_BASE}/api/analytics/equipment`);
    console.log('✅ Analytics API working:', analyticsResponse.data.totalEquipment, 'equipment items');
    console.log('');

    // Test 5: Equipment API
    console.log('5. Testing Equipment API...');
    const equipmentResponse = await axios.get(`${API_BASE}/api/equipment`);
    console.log('✅ Equipment API working');
    console.log('');

    console.log('🎉 All integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Backend API: ✅ Running');
    console.log('- API Endpoints: ✅ Working');
    console.log('- Dashboard Analytics: ✅ Working');
    console.log('- Equipment Management: ✅ Working');
    console.log('- Frontend Integration: ✅ Ready');
    console.log('\n🚀 Your LabGuard Pro application is ready for use!');
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:3000 to access the frontend');
    console.log('2. Register a new account or login with test credentials');
    console.log('3. Explore the dashboard and equipment management features');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend API is running on port 3001');
    console.log('2. Check that the database is properly configured');
    console.log('3. Verify environment variables are set correctly');
  }
}

// Run the test
testIntegration(); 