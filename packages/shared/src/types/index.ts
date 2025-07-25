// User types
export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  isActive: boolean
  laboratoryId: string
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  TECHNICIAN = 'TECHNICIAN',
  VIEWER = 'VIEWER'
}

// Equipment types
export interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: EquipmentType
  location?: string
  installDate?: Date
  warrantyExpiry?: Date
  status: EquipmentStatus
  specifications: Record<string, any>
  maintenanceSchedule: Record<string, any>
  laboratoryId: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export enum EquipmentType {
  ANALYTICAL_BALANCE = 'ANALYTICAL_BALANCE',
  PIPETTE = 'PIPETTE',
  CENTRIFUGE = 'CENTRIFUGE',
  INCUBATOR = 'INCUBATOR',
  AUTOCLAVE = 'AUTOCLAVE',
  SPECTROPHOTOMETER = 'SPECTROPHOTOMETER',
  PCR_MACHINE = 'PCR_MACHINE',
  MICROSCOPE = 'MICROSCOPE',
  WATER_BATH = 'WATER_BATH',
  REFRIGERATOR = 'REFRIGERATOR',
  FREEZER = 'FREEZER',
  OTHER = 'OTHER'
}

export enum EquipmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  CALIBRATION_DUE = 'CALIBRATION_DUE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  RETIRED = 'RETIRED'
}

// Calibration types
export interface CalibrationRecord {
  id: string
  calibrationType: CalibrationType
  scheduledDate: Date
  performedDate?: Date
  dueDate: Date
  status: CalibrationStatus
  results: Record<string, any>
  measurements: Record<string, any>
  environmentalConditions: Record<string, any>
  standardsUsed: Record<string, any>
  complianceStatus: ComplianceStatus
  complianceScore?: number
  deviations: any[]
  correctiveActions: any[]
  certificate?: string
  notes?: string
  aiAnalysis?: Record<string, any>
  equipmentId: string
  performedById?: string
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

export enum CalibrationType {
  INITIAL = 'INITIAL',
  PERIODIC = 'PERIODIC',
  AFTER_REPAIR = 'AFTER_REPAIR',
  VERIFICATION = 'VERIFICATION',
  INTERIM_CHECK = 'INTERIM_CHECK'
}

export enum CalibrationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  CONDITIONAL = 'CONDITIONAL',
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

// Laboratory types
export interface Laboratory {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  licenseNumber?: string
  capNumber?: string
  cliaNumber?: string
  isActive: boolean
  settings: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Form types
export interface EquipmentFormData {
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: EquipmentType
  location?: string
  installDate?: string
  warrantyExpiry?: string
  specifications?: Record<string, any>
}

export interface CalibrationFormData {
  equipmentId: string
  calibrationType: CalibrationType
  scheduledDate: string
  dueDate: string
  templateId?: string
  notes?: string
}

// Dashboard types
export interface DashboardStats {
  totalEquipment: number
  activeEquipment: number
  overdueCalibrations: number
  complianceRate: number
  recentCalibrations: CalibrationRecord[]
  upcomingCalibrations: CalibrationRecord[]
}

// Notification types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  priority: NotificationPriority
  scheduledFor?: Date
  sentAt?: Date
  metadata: Record<string, any>
  userId: string
  createdAt: Date
  updatedAt: Date
}

export enum NotificationType {
  CALIBRATION_DUE = 'CALIBRATION_DUE',
  CALIBRATION_OVERDUE = 'CALIBRATION_OVERDUE',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  COMPLIANCE_ALERT = 'COMPLIANCE_ALERT',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  BILLING_ALERT = 'BILLING_ALERT'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
} 