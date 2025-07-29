# LabGuard Pro Mobile App - Integration Testing Guide

This guide provides comprehensive testing procedures for the LabGuard Pro mobile application, including backend API integration, offline functionality, and real device testing.

## 🧪 Testing Overview

### Test Categories
1. **Unit Tests** - Individual component testing
2. **Integration Tests** - API and service integration
3. **End-to-End Tests** - Complete user workflows
4. **Offline Tests** - Offline functionality validation
5. **Device Tests** - Real device testing
6. **Performance Tests** - App performance validation

## 🚀 Quick Start Testing

### 1. Install Dependencies
```bash
cd apps/mobile
npm install
```

### 2. Run Basic Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- QRScannerScreen.test.tsx
```

### 3. Run Integration Tests
```bash
# Test API integration
npm run test:integration

# Test offline functionality
npm run test:offline

# Test push notifications
npm run test:notifications
```

## 📱 Device Testing

### Android Testing
```bash
# Start Android emulator or connect device
adb devices

# Run on Android
npm run android

# Run specific test on device
npm run android:test
```

### iOS Testing
```bash
# Start iOS simulator or connect device
xcrun simctl list devices

# Run on iOS
npm run ios

# Run specific test on device
npm run ios:test
```

## 🔧 API Integration Testing

### Test API Endpoints
```bash
# Test authentication
curl -X POST https://api.labguardpro.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@labguardpro.com","password":"test123"}'

# Test equipment API
curl -X GET https://api.labguardpro.com/equipment \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test calibration API
curl -X POST https://api.labguardpro.com/calibrations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"equipmentId":"123","performedBy":"test-user"}'
```

### Test API Response Times
```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s "https://api.labguardpro.com/equipment"
```

## 📊 Offline Functionality Testing

### Test Offline Data Storage
```javascript
// Test offline data saving
import AsyncStorage from '@react-native-async-storage/async-storage';

const testOfflineStorage = async () => {
  const testData = {
    id: 'test-calibration-1',
    type: 'calibration',
    data: {
      equipmentId: 'TEST-001',
      performedBy: 'test-user',
      performedAt: new Date().toISOString(),
      status: 'completed'
    },
    timestamp: Date.now(),
    synced: false
  };

  await AsyncStorage.setItem('offline_data', JSON.stringify([testData]));
  console.log('Offline data saved successfully');
};
```

### Test Offline Sync
```javascript
// Test offline sync functionality
import { useOffline } from '../contexts/OfflineContext';

const testOfflineSync = async () => {
  const { syncPendingData, getOfflineData } = useOffline();
  
  // Disconnect network
  // Perform offline operations
  // Reconnect network
  await syncPendingData();
  
  const offlineData = await getOfflineData();
  console.log('Sync completed:', offlineData);
};
```

## 🔔 Push Notification Testing

### Test Local Notifications
```javascript
// Test local notification
import PushNotificationService from '../services/PushNotificationService';

const testLocalNotification = async () => {
  await PushNotificationService.sendLocalNotification({
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'SYSTEM_ALERT',
    priority: 'MEDIUM'
  });
};
```

### Test Scheduled Notifications
```javascript
// Test scheduled notification
const testScheduledNotification = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  await PushNotificationService.scheduleLocalNotification(
    {
      title: 'Calibration Due Tomorrow',
      message: 'Equipment TEST-001 calibration is due tomorrow',
      type: 'CALIBRATION_DUE',
      priority: 'HIGH',
      equipmentId: 'TEST-001'
    },
    tomorrow
  );
};
```

## 📱 QR Code Scanning Testing

### Test QR Code Generation
```javascript
// Generate test QR codes
const generateTestQRCode = (equipmentId) => {
  return `labguard://equipment/${equipmentId}`;
};

// Test QR codes
const testQRCodes = [
  'labguard://equipment/AB-2000-001',
  'labguard://equipment/PH-300-002',
  'labguard://equipment/SPECTRO-003'
];
```

### Test QR Code Scanning
```javascript
// Test QR scanner functionality
const testQRScanner = async () => {
  // Navigate to QR scanner
  navigation.navigate('QRScanner');
  
  // Simulate QR code scan
  const testQRData = 'labguard://equipment/AB-2000-001';
  
  // Verify equipment lookup
  const equipment = await fetchEquipmentDetails('AB-2000-001');
  console.log('Equipment found:', equipment);
};
```

## 🔧 Calibration Workflow Testing

### Test Offline Calibration
```javascript
// Test complete offline calibration workflow
const testOfflineCalibration = async () => {
  // 1. Start offline calibration
  navigation.navigate('OfflineCalibration', { equipmentId: 'TEST-001' });
  
  // 2. Complete calibration steps
  const calibrationData = {
    equipmentId: 'TEST-001',
    steps: [
      { id: '1', completed: true, value: '0.000' },
      { id: '2', completed: true, value: '1.000' },
      { id: '3', completed: true, value: '2.000' }
    ],
    notes: 'Test calibration completed'
  };
  
  // 3. Save offline
  await saveOfflineData('calibrations', calibrationData);
  
  // 4. Test sync when online
  await syncPendingData();
};
```

## 📊 Performance Testing

### Test App Performance
```javascript
// Test app startup time
const testStartupTime = () => {
  const startTime = Date.now();
  
  // App startup logic
  const endTime = Date.now();
  const startupTime = endTime - startTime;
  
  console.log(`App startup time: ${startupTime}ms`);
  return startupTime < 3000; // Should be under 3 seconds
};

// Test memory usage
const testMemoryUsage = () => {
  const memoryInfo = performance.memory;
  console.log('Memory usage:', memoryInfo);
  
  return memoryInfo.usedJSHeapSize < 50 * 1024 * 1024; // Under 50MB
};
```

## 🧪 Automated Testing Scripts

### Run All Tests
```bash
#!/bin/bash
# Run comprehensive test suite

echo "🧪 Running LabGuard Pro Mobile App Tests..."

# Unit tests
npm test -- --coverage --watchAll=false

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

echo "✅ All tests completed!"
```

### Test Specific Features
```bash
# Test QR scanning
npm run test:qr-scanning

# Test offline functionality
npm run test:offline

# Test push notifications
npm run test:notifications

# Test calibration workflows
npm run test:calibration
```

## 📱 Real Device Testing Checklist

### Android Device Testing
- [ ] Install app on physical Android device
- [ ] Test camera permissions and QR scanning
- [ ] Test offline functionality (disable WiFi/mobile data)
- [ ] Test push notifications
- [ ] Test calibration workflows
- [ ] Test app performance and battery usage
- [ ] Test different screen sizes and orientations
- [ ] Test with different Android versions

### iOS Device Testing
- [ ] Install app on physical iOS device
- [ ] Test camera permissions and QR scanning
- [ ] Test offline functionality (disable WiFi/mobile data)
- [ ] Test push notifications
- [ ] Test calibration workflows
- [ ] Test app performance and battery usage
- [ ] Test different screen sizes and orientations
- [ ] Test with different iOS versions

## 🔍 Debugging and Troubleshooting

### Common Issues and Solutions

#### 1. Metro Bundler Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear watchman cache
watchman watch-del-all
```

#### 2. Android Build Issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Clear Android cache
rm -rf android/app/build
```

#### 3. iOS Build Issues
```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Clear iOS cache
rm -rf ios/build
```

#### 4. Network Issues
```bash
# Test API connectivity
curl -I https://api.labguardpro.com/health

# Test offline functionality
# Disable network and test app functionality
```

### Debug Logging
```javascript
// Enable debug logging
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs(['Warning:']);

// Custom debug logging
const debugLog = (message, data) => {
  if (__DEV__) {
    console.log(`[DEBUG] ${message}`, data);
  }
};
```

## 📊 Test Results and Reporting

### Generate Test Report
```bash
# Generate comprehensive test report
npm run test:report

# View coverage report
open coverage/lcov-report/index.html
```

### Test Metrics
- **Unit Test Coverage**: >90%
- **Integration Test Coverage**: >85%
- **Performance Benchmarks**: Startup <3s, Memory <50MB
- **API Response Time**: <2s average
- **Offline Sync Success Rate**: >95%

## 🚀 Continuous Integration

### GitHub Actions Workflow
```yaml
name: Mobile App Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd apps/mobile && npm install
      - run: cd apps/mobile && npm test
      - run: cd apps/mobile && npm run test:integration
```

## 📞 Support and Documentation

### Testing Resources
- **API Documentation**: https://api.labguardpro.com/docs
- **Test Data**: Available in `test-data/` directory
- **Mock Services**: Available in `src/services/__mocks__/`
- **Test Utilities**: Available in `src/utils/test-utils.ts`

### Contact Information
- **Testing Team**: testing@labguardpro.com
- **Development Team**: dev@labguardpro.com
- **Support**: support@labguardpro.com

---

**LabGuard Pro Mobile App Testing** - Ensuring quality and reliability through comprehensive testing procedures. 