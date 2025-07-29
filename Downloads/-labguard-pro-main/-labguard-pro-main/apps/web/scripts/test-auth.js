// scripts/test-auth.js
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : '';

async function testAuth() {
  console.log('🧪 Testing LabGuard Pro Authentication System...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.success) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed');
      return;
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Registration
  console.log('\n2️⃣ Testing Registration...');
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'User',
    laboratoryName: 'Test Laboratory',
    role: 'ADMIN'
  };

  try {
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const registerData = await registerResponse.json();
    
    if (registerData.success) {
      console.log('✅ Registration successful');
      console.log(`   User ID: ${registerData.user.id}`);
      console.log(`   Laboratory: ${registerData.user.laboratory.name}`);
      
      // Test 3: Login
      console.log('\n3️⃣ Testing Login...');
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        }),
      });

      const loginData = await loginResponse.json();
      
      if (loginData.success) {
        console.log('✅ Login successful');
        console.log(`   Token received: ${loginData.token ? 'Yes' : 'No'}`);
        
        // Test 4: Profile Access
        console.log('\n4️⃣ Testing Profile Access...');
        const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
          },
        });

        const profileData = await profileResponse.json();
        
        if (profileData.success) {
          console.log('✅ Profile access successful');
          console.log(`   User: ${profileData.user.firstName} ${profileData.user.lastName}`);
          console.log(`   Role: ${profileData.user.role}`);
        } else {
          console.log('❌ Profile access failed:', profileData.error);
        }
        
        // Test 5: Logout
        console.log('\n5️⃣ Testing Logout...');
        const logoutResponse = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
          },
        });

        const logoutData = await logoutResponse.json();
        
        if (logoutData.success) {
          console.log('✅ Logout successful');
        } else {
          console.log('❌ Logout failed:', logoutData.error);
        }
        
      } else {
        console.log('❌ Login failed:', loginData.error);
      }
      
    } else {
      console.log('❌ Registration failed:', registerData.error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🎉 Authentication system test completed!');
}

// Run the test
testAuth().catch(console.error); 