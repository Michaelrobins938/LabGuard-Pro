# LabGuard Pro Mobile App

A comprehensive React Native mobile application for laboratory compliance automation with offline capabilities, QR code scanning, and push notifications.

## 🚀 Features

### Core Features
- **QR Code Scanning** - Scan equipment QR codes for quick access
- **Offline Calibration** - Perform calibrations without internet connection
- **Push Notifications** - Real-time alerts for due calibrations and compliance issues
- **Equipment Management** - Complete equipment lifecycle tracking
- **Calibration Workflows** - Step-by-step calibration procedures with AI validation
- **Reports & Analytics** - Comprehensive reporting and compliance tracking
- **Offline Sync** - Automatic data synchronization when connection is restored

### Advanced Features
- **Multi-format QR Codes** - Support for custom LabGuard QR codes and standard formats
- **Offline Data Storage** - Local storage with conflict resolution
- **Real-time Sync** - Background synchronization with retry logic
- **Notification Channels** - Organized notifications by type and priority
- **Equipment Optimization** - AI-powered equipment performance insights
- **Compliance Tracking** - Automated compliance monitoring and alerts

## 📱 Screens

### Main Screens
- **Dashboard** - Overview of equipment status and compliance metrics
- **Equipment** - Equipment management with QR scanning capabilities
- **Calibration** - Calibration workflows with offline support
- **Reports** - Comprehensive reporting and analytics
- **Settings** - App configuration and user preferences

### Specialized Screens
- **QR Scanner** - Advanced QR code scanning with equipment lookup
- **Offline Calibration** - Complete offline calibration workflow
- **Offline Mode** - Offline data management and sync status
- **Profile** - User profile and account management

## 🛠 Technology Stack

### Core Technologies
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation and routing
- **AsyncStorage** - Local data persistence
- **NetInfo** - Network connectivity monitoring

### Key Libraries
- **react-native-camera** - QR code scanning capabilities
- **react-native-push-notification** - Push notification system
- **react-native-vector-icons** - Icon library
- **@react-native-async-storage/async-storage** - Local storage
- **@react-native-community/netinfo** - Network monitoring

### State Management
- **React Context** - Global state management
- **AsyncStorage** - Persistent data storage
- **Custom Hooks** - Reusable state logic

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Physical device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/labguard-pro.git
   cd labguard-pro/apps/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (iOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/emulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## 📋 Configuration

### Environment Variables
Create a `.env` file in the mobile app root:

```env
# API Configuration
API_BASE_URL=https://api.labguardpro.com
API_TIMEOUT=30000

# Push Notifications
PUSH_NOTIFICATION_SERVER_KEY=your-server-key

# Offline Configuration
OFFLINE_SYNC_INTERVAL=300000
MAX_OFFLINE_RETRIES=5

# QR Code Configuration
QR_CODE_PREFIX=labguard://
QR_CODE_TIMEOUT=10000
```

### API Configuration
The app connects to the LabGuard Pro API. Ensure your API server is running and accessible.

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── navigation/         # Navigation configuration
├── screens/           # Screen components
├── services/          # API and external services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Key Components

#### QR Scanner (`src/screens/QRScannerScreen.tsx`)
- Advanced QR code scanning with equipment lookup
- Support for multiple QR code formats
- Offline equipment data access
- Real-time equipment status display

#### Offline Calibration (`src/screens/OfflineCalibrationScreen.tsx`)
- Complete offline calibration workflow
- Step-by-step calibration procedures
- Progress tracking and validation
- Automatic sync when online

#### Push Notifications (`src/services/PushNotificationService.ts`)
- Local and remote notifications
- Notification channels for different types
- Scheduled notifications for reminders
- Action-based notification handling

#### Offline Context (`src/contexts/OfflineContext.tsx`)
- Network connectivity monitoring
- Offline data management
- Automatic sync with retry logic
- Conflict resolution

### Adding New Features

1. **Create new screen**
   ```bash
   # Create screen file
   touch src/screens/NewFeatureScreen.tsx
   
   # Add to navigation
   # Edit src/navigation/AppNavigator.tsx
   ```

2. **Add API endpoint**
   ```bash
   # Add to API service
   # Edit src/services/api.ts
   ```

3. **Update types**
   ```bash
   # Add TypeScript types
   # Edit src/types/index.ts
   ```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📦 Building

### Android Build
```bash
# Development build
npm run android:dev

# Production build
npm run android:prod
```

### iOS Build
```bash
# Development build
npm run ios:dev

# Production build
npm run ios:prod
```

## 🚀 Deployment

### Android
1. Generate signed APK
2. Upload to Google Play Console
3. Configure release notes and metadata

### iOS
1. Archive app in Xcode
2. Upload to App Store Connect
3. Configure app metadata and screenshots

## 🔒 Security

### Data Protection
- All sensitive data encrypted at rest
- Secure API communication with HTTPS
- Token-based authentication
- Offline data protection

### Privacy
- GDPR compliant data handling
- User consent for notifications
- Data retention policies
- Privacy controls in settings

## 📊 Performance

### Optimization
- Lazy loading of screens
- Image optimization and caching
- Efficient state management
- Background sync optimization

### Monitoring
- Crash reporting integration
- Performance metrics tracking
- User analytics (anonymized)
- Error logging and reporting

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Write comprehensive tests
3. Document new features
4. Follow the existing code style
5. Test on both platforms

### Code Style
- Use TypeScript for all new code
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive comments

## 📞 Support

### Documentation
- [API Documentation](https://api.labguardpro.com/docs)
- [User Guide](https://docs.labguardpro.com)
- [Developer Guide](https://docs.labguardpro.com/developer)

### Contact
- **Technical Support**: support@labguardpro.com
- **Development Team**: dev@labguardpro.com
- **Bug Reports**: github.com/your-org/labguard-pro/issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stanford Biomni** - AI integration and research capabilities
- **React Native Community** - Excellent open-source tools
- **Laboratory Professionals** - Domain expertise and feedback

---

**LabGuard Pro Mobile** - Transforming laboratory compliance through intelligent automation and mobile-first design. 