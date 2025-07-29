// Security Context Types
export interface SecurityContext {
  userId: string
  laboratoryId: string
  userRole: string
  sessionId: string
  requestId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
}

// MFA Types
export interface MFAConfig {
  enabled: boolean
  methods: MFAMethod[]
  backupCodes: string[]
  lastUsed: Date
  setupComplete: boolean
}

export type MFAMethod = 'TOTP' | 'SMS' | 'EMAIL' | 'HARDWARE_KEY'

export interface MFASetupResult {
  secret: string
  qrCode: string
  backupCodes: string[]
  setupComplete: boolean
}

// Data Loss Prevention Types
export interface DLPConfig {
  enabled: boolean
  rules: DLPRule[]
  alertThresholds: DLPAlertThresholds
  dataClassification: DataClassification
}

export interface DLPRule {
  id: string
  name: string
  description: string
  enabled: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  conditions: DLPCondition[]
  actions: DLPAction[]
}

export interface DLPCondition {
  field: string
  operator: 'EQUALS' | 'CONTAINS' | 'REGEX' | 'GREATER_THAN' | 'LESS_THAN'
  value: any
}

export interface DLPAction {
  type: 'BLOCK' | 'ALERT' | 'LOG' | 'QUARANTINE' | 'NOTIFY_ADMIN'
  parameters: Record<string, any>
}

export interface DLPAlertThresholds {
  dataExports: number
  failedLogins: number
  suspiciousActivity: number
  dataAccess: number
}

export interface DataClassification {
  public: string[]
  internal: string[]
  confidential: string[]
  restricted: string[]
}

export interface DLPIncident {
  id: string
  userId: string
  laboratoryId: string
  ruleId: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  timestamp: Date
  data: Record<string, any>
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE'
  resolutionNotes?: string
}

// Audit Logging Types
export interface AuditEvent {
  id: string
  userId: string
  laboratoryId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  outcome: 'SUCCESS' | 'FAILURE' | 'PENDING'
  sessionId: string
  requestId: string
}

export interface SecurityEvent {
  id: string
  eventType: 'AUTHENTICATION' | 'AUTHORIZATION' | 'DATA_ACCESS' | 'SYSTEM_CHANGE' | 'SECURITY_ALERT'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  userId?: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  metadata: Record<string, any>
  resolved: boolean
  resolutionNotes?: string
}

// Compliance Framework Types
export interface ComplianceConfig {
  hipaa: HIPAAConfig
  soc2: SOC2Config
  gdpr: GDPRConfig
  clia: CLIAConfig
  cap: CAPConfig
}

export interface HIPAAConfig {
  enabled: boolean
  phiFields: string[]
  encryptionRequired: boolean
  auditTrailRequired: boolean
  accessControls: AccessControl[]
  dataRetention: DataRetentionPolicy
}

export interface SOC2Config {
  enabled: boolean
  trustCriteria: TrustCriteria[]
  controlObjectives: ControlObjective[]
  monitoringFrequency: string
}

export interface GDPRConfig {
  enabled: boolean
  dataSubjectRights: DataSubjectRight[]
  consentManagement: boolean
  dataPortability: boolean
  rightToErasure: boolean
}

export interface CLIAConfig {
  enabled: boolean
  qualityControl: QualityControlRequirement[]
  proficiencyTesting: boolean
  personnelCompetency: boolean
}

export interface CAPConfig {
  enabled: boolean
  inspectionReadiness: boolean
  documentControl: boolean
  qualityManagement: boolean
}

export interface AccessControl {
  resource: string
  roles: string[]
  permissions: string[]
  conditions: AccessCondition[]
}

export interface AccessCondition {
  field: string
  operator: string
  value: any
}

export interface DataRetentionPolicy {
  defaultRetention: number // days
  sensitiveDataRetention: number // days
  auditLogRetention: number // days
  autoDeletion: boolean
}

export interface TrustCriteria {
  name: string
  description: string
  controls: Control[]
  monitoring: MonitoringConfig
}

export interface Control {
  id: string
  name: string
  description: string
  type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE'
  frequency: string
  owner: string
}

export interface ControlObjective {
  id: string
  name: string
  description: string
  criteria: string[]
  testing: TestingProcedure[]
}

export interface TestingProcedure {
  id: string
  name: string
  description: string
  frequency: string
  responsible: string
}

export interface DataSubjectRight {
  right: string
  description: string
  implementation: string
  automated: boolean
}

export interface QualityControlRequirement {
  requirement: string
  description: string
  frequency: string
  documentation: string
}

export interface ComplianceReport {
  id: string
  framework: string
  laboratoryId: string
  generatedAt: Date
  period: string
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
  findings: ComplianceFinding[]
  recommendations: string[]
}

export interface ComplianceFinding {
  id: string
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  evidence: string[]
  remediation: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
}

// Encryption Types
export interface EncryptionConfig {
  algorithm: string
  keySize: number
  iterations: number
  saltLength: number
}

export interface EncryptedData {
  data: string
  iv: string
  salt: string
  authTag: string
}

// Security Monitoring Types
export interface SecurityMetrics {
  totalRequests: number
  failedAuthentications: number
  securityIncidents: number
  dlpViolations: number
  complianceScore: number
  uptime: number
}

export interface ThreatDetection {
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  timestamp: Date
  source: string
  indicators: string[]
}

// Security Configuration Types
export interface SecurityConfig {
  encryption: EncryptionConfig
  mfa: MFAConfig
  dlp: DLPConfig
  compliance: ComplianceConfig
  monitoring: MonitoringConfig
}

export interface MonitoringConfig {
  enabled: boolean
  metrics: string[]
  alerts: AlertConfig[]
  retention: number
}

export interface AlertConfig {
  type: string
  threshold: number
  action: string
  recipients: string[]
}

// Request/Response Security Types
export interface SecureRequest extends Request {
  securityContext?: SecurityContext
  user?: any
}

export interface SecurityResponse {
  success: boolean
  message: string
  data?: any
  securityInfo?: SecurityInfo
}

export interface SecurityInfo {
  requestId: string
  timestamp: Date
  auditTrail: boolean
  encryption: boolean
  compliance: string[]
} 