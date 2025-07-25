// LabGuard Pro Mobile App Environment Configuration

interface EnvironmentConfig {
  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_VERSION: string;
  
  // Authentication
  AUTH_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;
  
  // Push Notifications
  PUSH_NOTIFICATION_SERVER_KEY: string;
  PUSH_NOTIFICATION_SENDER_ID: string;
  PUSH_NOTIFICATION_CHANNEL_ID: string;
  
  // Offline Configuration
  OFFLINE_SYNC_INTERVAL: number;
  MAX_OFFLINE_RETRIES: number;
  OFFLINE_STORAGE_KEY: string;
  
  // QR Code Configuration
  QR_CODE_PREFIX: string;
  QR_CODE_TIMEOUT: number;
  QR_CODE_SCAN_INTERVAL: number;
  
  // Camera Configuration
  CAMERA_PERMISSION_KEY: string;
  CAMERA_QUALITY: string;
  CAMERA_FLASH_MODE: string;
  
  // Storage Configuration
  STORAGE_ENCRYPTION_KEY: string;
  STORAGE_MAX_SIZE: string;
  
  // Analytics Configuration
  ANALYTICS_ENABLED: boolean;
  ANALYTICS_TRACKING_ID: string;
  
  // Debug Configuration
  DEBUG_MODE: boolean;
  LOG_LEVEL: string;
  ENABLE_CRASH_REPORTING: boolean;
  
  // Feature Flags
  ENABLE_OFFLINE_MODE: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_QR_SCANNING: boolean;
  ENABLE_AI_VALIDATION: boolean;
  ENABLE_BACKGROUND_SYNC: boolean;
  
  // Development Configuration
  ENABLE_DEVELOPER_MENU: boolean;
  ENABLE_HOT_RELOAD: boolean;
  ENABLE_DEBUG_MENU: boolean;
  
  // Production Configuration
  ENABLE_ANALYTICS: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  
  // App Store Configuration
  APP_STORE_ID: string;
  PLAY_STORE_ID: string;
  
  // Support Configuration
  SUPPORT_EMAIL: string;
  SUPPORT_PHONE: string;
  SUPPORT_WEBSITE: string;
}

// Development Environment
const developmentConfig: EnvironmentConfig = {
  // API Configuration
  API_BASE_URL: 'https://dev-api.labguardpro.com',
  API_TIMEOUT: 30000,
  API_VERSION: 'v1',
  
  // Authentication
  AUTH_TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  // Push Notifications
  PUSH_NOTIFICATION_SERVER_KEY: 'dev-server-key',
  PUSH_NOTIFICATION_SENDER_ID: 'dev-sender-id',
  PUSH_NOTIFICATION_CHANNEL_ID: 'labguard-notifications-dev',
  
  // Offline Configuration
  OFFLINE_SYNC_INTERVAL: 300000, // 5 minutes
  MAX_OFFLINE_RETRIES: 5,
  OFFLINE_STORAGE_KEY: 'labguard_offline_data_dev',
  
  // QR Code Configuration
  QR_CODE_PREFIX: 'labguard://',
  QR_CODE_TIMEOUT: 10000,
  QR_CODE_SCAN_INTERVAL: 1000,
  
  // Camera Configuration
  CAMERA_PERMISSION_KEY: 'camera_permission',
  CAMERA_QUALITY: 'medium',
  CAMERA_FLASH_MODE: 'auto',
  
  // Storage Configuration
  STORAGE_ENCRYPTION_KEY: 'dev-encryption-key',
  STORAGE_MAX_SIZE: '100MB',
  
  // Analytics Configuration
  ANALYTICS_ENABLED: false,
  ANALYTICS_TRACKING_ID: 'dev-tracking-id',
  
  // Debug Configuration
  DEBUG_MODE: true,
  LOG_LEVEL: 'debug',
  ENABLE_CRASH_REPORTING: false,
  
  // Feature Flags
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_QR_SCANNING: true,
  ENABLE_AI_VALIDATION: true,
  ENABLE_BACKGROUND_SYNC: true,
  
  // Development Configuration
  ENABLE_DEVELOPER_MENU: true,
  ENABLE_HOT_RELOAD: true,
  ENABLE_DEBUG_MENU: true,
  
  // Production Configuration
  ENABLE_ANALYTICS: false,
  ENABLE_PERFORMANCE_MONITORING: false,
  
  // App Store Configuration
  APP_STORE_ID: 'dev-app-store-id',
  PLAY_STORE_ID: 'dev-play-store-id',
  
  // Support Configuration
  SUPPORT_EMAIL: 'dev-support@labguardpro.com',
  SUPPORT_PHONE: '+1-555-123-4567',
  SUPPORT_WEBSITE: 'https://dev-support.labguardpro.com',
};

// Production Environment
const productionConfig: EnvironmentConfig = {
  // API Configuration
  API_BASE_URL: 'https://api.labguardpro.com',
  API_TIMEOUT: 30000,
  API_VERSION: 'v1',
  
  // Authentication
  AUTH_TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  // Push Notifications
  PUSH_NOTIFICATION_SERVER_KEY: 'prod-server-key',
  PUSH_NOTIFICATION_SENDER_ID: 'prod-sender-id',
  PUSH_NOTIFICATION_CHANNEL_ID: 'labguard-notifications',
  
  // Offline Configuration
  OFFLINE_SYNC_INTERVAL: 300000, // 5 minutes
  MAX_OFFLINE_RETRIES: 5,
  OFFLINE_STORAGE_KEY: 'labguard_offline_data',
  
  // QR Code Configuration
  QR_CODE_PREFIX: 'labguard://',
  QR_CODE_TIMEOUT: 10000,
  QR_CODE_SCAN_INTERVAL: 1000,
  
  // Camera Configuration
  CAMERA_PERMISSION_KEY: 'camera_permission',
  CAMERA_QUALITY: 'high',
  CAMERA_FLASH_MODE: 'auto',
  
  // Storage Configuration
  STORAGE_ENCRYPTION_KEY: 'prod-encryption-key',
  STORAGE_MAX_SIZE: '100MB',
  
  // Analytics Configuration
  ANALYTICS_ENABLED: true,
  ANALYTICS_TRACKING_ID: 'prod-tracking-id',
  
  // Debug Configuration
  DEBUG_MODE: false,
  LOG_LEVEL: 'info',
  ENABLE_CRASH_REPORTING: true,
  
  // Feature Flags
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_QR_SCANNING: true,
  ENABLE_AI_VALIDATION: true,
  ENABLE_BACKGROUND_SYNC: true,
  
  // Development Configuration
  ENABLE_DEVELOPER_MENU: false,
  ENABLE_HOT_RELOAD: false,
  ENABLE_DEBUG_MENU: false,
  
  // Production Configuration
  ENABLE_ANALYTICS: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // App Store Configuration
  APP_STORE_ID: 'prod-app-store-id',
  PLAY_STORE_ID: 'prod-play-store-id',
  
  // Support Configuration
  SUPPORT_EMAIL: 'support@labguardpro.com',
  SUPPORT_PHONE: '+1-555-123-4567',
  SUPPORT_WEBSITE: 'https://support.labguardpro.com',
};

// Staging Environment
const stagingConfig: EnvironmentConfig = {
  ...productionConfig,
  API_BASE_URL: 'https://staging-api.labguardpro.com',
  DEBUG_MODE: true,
  LOG_LEVEL: 'debug',
  ENABLE_CRASH_REPORTING: false,
  ENABLE_ANALYTICS: false,
  ENABLE_PERFORMANCE_MONITORING: false,
  SUPPORT_EMAIL: 'staging-support@labguardpro.com',
  SUPPORT_WEBSITE: 'https://staging-support.labguardpro.com',
};

// Get current environment
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // @ts-ignore - __DEV__ is a React Native global
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'development';
  }
  
  // You can add logic here to determine staging vs production
  // For now, we'll use production for non-dev builds
  return 'production';
};

// Export the appropriate configuration
const environment = getEnvironment();
const config = environment === 'development' 
  ? developmentConfig 
  : environment === 'staging' 
    ? stagingConfig 
    : productionConfig;

export default config;
export { EnvironmentConfig }; 