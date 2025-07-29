// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Equipment Types
export const EQUIPMENT_TYPES = [
  'ANALYTICAL_BALANCE',
  'PIPETTE',
  'CENTRIFUGE',
  'INCUBATOR',
  'AUTOCLAVE',
  'SPECTROPHOTOMETER',
  'PCR_MACHINE',
  'MICROSCOPE',
  'WATER_BATH',
  'REFRIGERATOR',
  'FREEZER',
  'OTHER'
] as const

// Equipment Statuses
export const EQUIPMENT_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'MAINTENANCE',
  'CALIBRATION_DUE',
  'OUT_OF_SERVICE',
  'RETIRED'
] as const

// Calibration Types
export const CALIBRATION_TYPES = [
  'INITIAL',
  'PERIODIC',
  'AFTER_REPAIR',
  'VERIFICATION',
  'INTERIM_CHECK'
] as const

// Calibration Statuses
export const CALIBRATION_STATUSES = [
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'OVERDUE',
  'CANCELLED',
  'FAILED'
] as const

// Compliance Statuses
export const COMPLIANCE_STATUSES = [
  'COMPLIANT',
  'NON_COMPLIANT',
  'CONDITIONAL',
  'PENDING',
  'UNDER_REVIEW'
] as const

// User Roles
export const USER_ROLES = [
  'ADMIN',
  'SUPERVISOR',
  'TECHNICIAN',
  'VIEWER'
] as const

// Notification Types
export const NOTIFICATION_TYPES = [
  'CALIBRATION_DUE',
  'CALIBRATION_OVERDUE',
  'MAINTENANCE_DUE',
  'COMPLIANCE_ALERT',
  'SYSTEM_NOTIFICATION',
  'BILLING_ALERT'
] as const

// Notification Priorities
export const NOTIFICATION_PRIORITIES = [
  'LOW',
  'NORMAL',
  'HIGH',
  'CRITICAL'
] as const

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  TIME: 'MM/DD/YYYY HH:mm',
  ISO: 'YYYY-MM-DD'
} as const

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SERIAL_NUMBER: /^[A-Za-z0-9\-_]{3,50}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/
} as const

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_SERIAL_NUMBER: 'Serial number must be 3-50 characters and contain only letters, numbers, hyphens, and underscores',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_PHONE: 'Please enter a valid phone number',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.'
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  EQUIPMENT_CREATED: 'Equipment created successfully',
  EQUIPMENT_UPDATED: 'Equipment updated successfully',
  EQUIPMENT_DELETED: 'Equipment deleted successfully',
  CALIBRATION_CREATED: 'Calibration record created successfully',
  CALIBRATION_UPDATED: 'Calibration record updated successfully',
  CALIBRATION_VALIDATED: 'Calibration validated successfully',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully'
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'labguard_auth_token',
  USER_DATA: 'labguard_user_data',
  THEME: 'labguard_theme',
  LANGUAGE: 'labguard_language'
} as const

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6'
} as const 