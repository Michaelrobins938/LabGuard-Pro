import { SecurityConfig, EncryptionConfig, MFAConfig, DLPConfig, ComplianceConfig, MonitoringConfig } from './types'

export class SecurityConfigManager {
  private static instance: SecurityConfigManager
  private config: SecurityConfig

  private constructor() {
    this.config = this.loadDefaultConfig()
  }

  static getInstance(): SecurityConfigManager {
    if (!SecurityConfigManager.instance) {
      SecurityConfigManager.instance = new SecurityConfigManager()
    }
    return SecurityConfigManager.instance
  }

  // Get the complete security configuration
  getConfig(): SecurityConfig {
    return this.config
  }

  // Update security configuration
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  // Get encryption configuration
  getEncryptionConfig(): EncryptionConfig {
    return this.config.encryption
  }

  // Update encryption configuration
  updateEncryptionConfig(updates: Partial<EncryptionConfig>): void {
    this.config.encryption = { ...this.config.encryption, ...updates }
  }

  // Get MFA configuration
  getMFAConfig(): MFAConfig {
    return this.config.mfa
  }

  // Update MFA configuration
  updateMFAConfig(updates: Partial<MFAConfig>): void {
    this.config.mfa = { ...this.config.mfa, ...updates }
  }

  // Get DLP configuration
  getDLPConfig(): DLPConfig {
    return this.config.dlp
  }

  // Update DLP configuration
  updateDLPConfig(updates: Partial<DLPConfig>): void {
    this.config.dlp = { ...this.config.dlp, ...updates }
  }

  // Get compliance configuration
  getComplianceConfig(): ComplianceConfig {
    return this.config.compliance
  }

  // Update compliance configuration
  updateComplianceConfig(updates: Partial<ComplianceConfig>): void {
    this.config.compliance = { ...this.config.compliance, ...updates }
  }

  // Get monitoring configuration
  getMonitoringConfig(): MonitoringConfig {
    return this.config.monitoring
  }

  // Update monitoring configuration
  updateMonitoringConfig(updates: Partial<MonitoringConfig>): void {
    this.config.monitoring = { ...this.config.monitoring, ...updates }
  }

  // Check if a security feature is enabled
  isFeatureEnabled(feature: keyof SecurityConfig): boolean {
    switch (feature) {
      case 'encryption':
        return this.config.encryption.enabled
      case 'mfa':
        return this.config.mfa.enabled
      case 'dlp':
        return this.config.dlp.enabled
      case 'compliance':
        return this.isComplianceEnabled()
      case 'monitoring':
        return this.config.monitoring.enabled
      default:
        return false
    }
  }

  // Check if any compliance framework is enabled
  private isComplianceEnabled(): boolean {
    const compliance = this.config.compliance
    return (
      compliance.hipaa.enabled ||
      compliance.soc2.enabled ||
      compliance.gdpr.enabled ||
      compliance.clia.enabled ||
      compliance.cap.enabled
    )
  }

  // Get enabled compliance frameworks
  getEnabledComplianceFrameworks(): string[] {
    const frameworks: string[] = []
    const compliance = this.config.compliance

    if (compliance.hipaa.enabled) frameworks.push('HIPAA')
    if (compliance.soc2.enabled) frameworks.push('SOC2')
    if (compliance.gdpr.enabled) frameworks.push('GDPR')
    if (compliance.clia.enabled) frameworks.push('CLIA')
    if (compliance.cap.enabled) frameworks.push('CAP')

    return frameworks
  }

  // Validate security configuration
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate encryption config
    if (this.config.encryption.enabled) {
      if (!this.config.encryption.algorithm) {
        errors.push('Encryption algorithm is required when encryption is enabled')
      }
      if (this.config.encryption.keySize < 128) {
        errors.push('Encryption key size must be at least 128 bits')
      }
    }

    // Validate MFA config
    if (this.config.mfa.enabled) {
      if (this.config.mfa.methods.length === 0) {
        errors.push('At least one MFA method must be configured')
      }
    }

    // Validate DLP config
    if (this.config.dlp.enabled) {
      if (this.config.dlp.rules.length === 0) {
        errors.push('At least one DLP rule must be configured')
      }
    }

    // Validate monitoring config
    if (this.config.monitoring.enabled) {
      if (this.config.monitoring.metrics.length === 0) {
        errors.push('At least one monitoring metric must be configured')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Load configuration from environment variables
  loadFromEnvironment(): void {
    // Encryption config
    this.config.encryption.enabled = process.env.ENCRYPTION_ENABLED === 'true'
    this.config.encryption.algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm'
    this.config.encryption.keySize = parseInt(process.env.ENCRYPTION_KEY_SIZE || '256')
    this.config.encryption.iterations = parseInt(process.env.ENCRYPTION_ITERATIONS || '100000')
    this.config.encryption.saltLength = parseInt(process.env.ENCRYPTION_SALT_LENGTH || '32')

    // MFA config
    this.config.mfa.enabled = process.env.MFA_ENABLED === 'true'
    this.config.mfa.methods = process.env.MFA_METHODS?.split(',') || ['TOTP']

    // DLP config
    this.config.dlp.enabled = process.env.DLP_ENABLED === 'true'
    this.config.dlp.alertThresholds.dataExports = parseInt(process.env.DLP_EXPORT_THRESHOLD || '10')
    this.config.dlp.alertThresholds.failedLogins = parseInt(process.env.DLP_LOGIN_THRESHOLD || '5')
    this.config.dlp.alertThresholds.suspiciousActivity = parseInt(process.env.DLP_SUSPICIOUS_THRESHOLD || '3')
    this.config.dlp.alertThresholds.dataAccess = parseInt(process.env.DLP_ACCESS_THRESHOLD || '100')

    // Compliance config
    this.config.compliance.hipaa.enabled = process.env.HIPAA_ENABLED === 'true'
    this.config.compliance.soc2.enabled = process.env.SOC2_ENABLED === 'true'
    this.config.compliance.gdpr.enabled = process.env.GDPR_ENABLED === 'true'
    this.config.compliance.clia.enabled = process.env.CLIA_ENABLED === 'true'
    this.config.compliance.cap.enabled = process.env.CAP_ENABLED === 'true'

    // Monitoring config
    this.config.monitoring.enabled = process.env.MONITORING_ENABLED === 'true'
    this.config.monitoring.metrics = process.env.MONITORING_METRICS?.split(',') || ['requests', 'errors', 'performance']
    this.config.monitoring.retention = parseInt(process.env.MONITORING_RETENTION || '30')
  }

  // Load default configuration
  private loadDefaultConfig(): SecurityConfig {
    return {
      encryption: {
        enabled: true,
        algorithm: 'aes-256-gcm',
        keySize: 256,
        iterations: 100000,
        saltLength: 32
      },
      mfa: {
        enabled: true,
        methods: ['TOTP', 'SMS', 'EMAIL'],
        backupCodes: [],
        lastUsed: new Date(),
        setupComplete: false
      },
      dlp: {
        enabled: true,
        rules: [
          {
            id: 'sensitive_data_export',
            name: 'Sensitive Data Export Prevention',
            description: 'Prevent export of sensitive data',
            enabled: true,
            priority: 'HIGH',
            conditions: [
              {
                field: 'data.sensitiveFields',
                operator: 'CONTAINS',
                value: 'ssn'
              }
            ],
            actions: [
              {
                type: 'BLOCK',
                parameters: {}
              },
              {
                type: 'ALERT',
                parameters: {}
              }
            ]
          }
        ],
        alertThresholds: {
          dataExports: 10,
          failedLogins: 5,
          suspiciousActivity: 3,
          dataAccess: 100
        },
        dataClassification: {
          public: ['equipment_name', 'calibration_date'],
          internal: ['user_email', 'laboratory_name'],
          confidential: ['test_results', 'patient_data'],
          restricted: ['admin_credentials', 'system_keys']
        }
      },
      compliance: {
        hipaa: {
          enabled: true,
          phiFields: ['patientData', 'testResults', 'personalInformation'],
          encryptionRequired: true,
          auditTrailRequired: true,
          accessControls: [],
          dataRetention: {
            defaultRetention: 2555, // 7 years
            sensitiveDataRetention: 3650, // 10 years
            auditLogRetention: 7300, // 20 years
            autoDeletion: true
          }
        },
        soc2: {
          enabled: true,
          trustCriteria: [
            {
              name: 'Security',
              description: 'System is protected against unauthorized access',
              controls: [],
              monitoring: {
                enabled: true,
                metrics: ['security_incidents', 'failed_logins'],
                alerts: [],
                retention: 30
              }
            },
            {
              name: 'Availability',
              description: 'System is available for operation and use',
              controls: [],
              monitoring: {
                enabled: true,
                metrics: ['uptime', 'response_time'],
                alerts: [],
                retention: 30
              }
            },
            {
              name: 'Processing Integrity',
              description: 'System processing is complete, accurate, and timely',
              controls: [],
              monitoring: {
                enabled: true,
                metrics: ['data_integrity', 'processing_errors'],
                alerts: [],
                retention: 30
              }
            },
            {
              name: 'Confidentiality',
              description: 'Information designated as confidential is protected',
              controls: [],
              monitoring: {
                enabled: true,
                metrics: ['data_access', 'encryption_status'],
                alerts: [],
                retention: 30
              }
            },
            {
              name: 'Privacy',
              description: 'Personal information is collected, used, retained, and disclosed',
              controls: [],
              monitoring: {
                enabled: true,
                metrics: ['privacy_violations', 'consent_management'],
                alerts: [],
                retention: 30
              }
            }
          ],
          controlObjectives: [],
          monitoringFrequency: 'daily'
        },
        gdpr: {
          enabled: true,
          dataSubjectRights: [
            {
              right: 'ACCESS',
              description: 'Right to access personal data',
              implementation: 'Data access API endpoint',
              automated: true
            },
            {
              right: 'PORTABILITY',
              description: 'Right to data portability',
              implementation: 'Data export functionality',
              automated: true
            },
            {
              right: 'ERASURE',
              description: 'Right to erasure (right to be forgotten)',
              implementation: 'Data deletion functionality',
              automated: true
            },
            {
              right: 'RECTIFICATION',
              description: 'Right to rectification',
              implementation: 'Data update functionality',
              automated: true
            },
            {
              right: 'RESTRICTION',
              description: 'Right to restriction of processing',
              implementation: 'Data processing controls',
              automated: true
            }
          ],
          consentManagement: true,
          dataPortability: true,
          rightToErasure: true
        },
        clia: {
          enabled: true,
          qualityControl: [
            {
              requirement: 'Daily QC',
              description: 'Perform daily quality control checks',
              frequency: 'daily',
              documentation: 'QC logs and reports'
            },
            {
              requirement: 'Proficiency Testing',
              description: 'Participate in proficiency testing programs',
              frequency: 'quarterly',
              documentation: 'PT results and corrective actions'
            },
            {
              requirement: 'Personnel Competency',
              description: 'Ensure personnel competency',
              frequency: 'annually',
              documentation: 'Competency assessments and training records'
            }
          ],
          proficiencyTesting: true,
          personnelCompetency: true
        },
        cap: {
          enabled: true,
          inspectionReadiness: true,
          documentControl: true,
          qualityManagement: true
        }
      },
      monitoring: {
        enabled: true,
        metrics: [
          'requests_per_minute',
          'error_rate',
          'response_time',
          'security_incidents',
          'dlp_violations',
          'compliance_score'
        ],
        alerts: [
          {
            type: 'high_error_rate',
            threshold: 5,
            action: 'notify_admin',
            recipients: ['admin@labguard.com']
          },
          {
            type: 'security_incident',
            threshold: 1,
            action: 'immediate_alert',
            recipients: ['security@labguard.com']
          },
          {
            type: 'dlp_violation',
            threshold: 1,
            action: 'block_and_alert',
            recipients: ['security@labguard.com', 'admin@labguard.com']
          }
        ],
        retention: 30
      }
    }
  }
} 