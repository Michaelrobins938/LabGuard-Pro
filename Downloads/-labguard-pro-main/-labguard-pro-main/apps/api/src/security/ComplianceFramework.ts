import { PrismaClient } from '@labguard/database'
import { AuditLogger } from './AuditLogger'
import { EncryptionService } from './EncryptionService'

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

export class ComplianceFramework {
  private prisma: PrismaClient
  private auditLogger: AuditLogger
  private config: ComplianceConfig

  constructor() {
    this.prisma = new PrismaClient()
    this.auditLogger = new AuditLogger()
    this.config = this.getDefaultConfig()
  }

  // HIPAA Compliance Methods
  async checkHIPAACompliance(laboratoryId: string): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = []
    
    // Check PHI protection
    const phiFindings = await this.checkPHIProtection(laboratoryId)
    findings.push(...phiFindings)
    
    // Check access controls
    const accessFindings = await this.checkAccessControls(laboratoryId)
    findings.push(...accessFindings)
    
    // Check audit trails
    const auditFindings = await this.checkAuditTrails(laboratoryId)
    findings.push(...auditFindings)
    
    // Check encryption
    const encryptionFindings = await this.checkEncryption(laboratoryId)
    findings.push(...encryptionFindings)
    
    const status = this.determineComplianceStatus(findings)
    const recommendations = this.generateRecommendations(findings, 'HIPAA')
    
    return {
      id: this.generateReportId(),
      framework: 'HIPAA',
      laboratoryId,
      generatedAt: new Date(),
      period: '30 days',
      status,
      findings,
      recommendations
    }
  }

  // SOC2 Compliance Methods
  async checkSOC2Compliance(laboratoryId: string): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = []
    
    // Check security criteria
    const securityFindings = await this.checkSecurityCriteria(laboratoryId)
    findings.push(...securityFindings)
    
    // Check availability criteria
    const availabilityFindings = await this.checkAvailabilityCriteria(laboratoryId)
    findings.push(...availabilityFindings)
    
    // Check processing integrity
    const integrityFindings = await this.checkProcessingIntegrity(laboratoryId)
    findings.push(...integrityFindings)
    
    // Check confidentiality
    const confidentialityFindings = await this.checkConfidentiality(laboratoryId)
    findings.push(...confidentialityFindings)
    
    // Check privacy
    const privacyFindings = await this.checkPrivacy(laboratoryId)
    findings.push(...privacyFindings)
    
    const status = this.determineComplianceStatus(findings)
    const recommendations = this.generateRecommendations(findings, 'SOC2')
    
    return {
      id: this.generateReportId(),
      framework: 'SOC2',
      laboratoryId,
      generatedAt: new Date(),
      period: '30 days',
      status,
      findings,
      recommendations
    }
  }

  // GDPR Compliance Methods
  async checkGDPRCompliance(laboratoryId: string): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = []
    
    // Check data subject rights
    const rightsFindings = await this.checkDataSubjectRights(laboratoryId)
    findings.push(...rightsFindings)
    
    // Check consent management
    const consentFindings = await this.checkConsentManagement(laboratoryId)
    findings.push(...consentFindings)
    
    // Check data portability
    const portabilityFindings = await this.checkDataPortability(laboratoryId)
    findings.push(...portabilityFindings)
    
    // Check right to erasure
    const erasureFindings = await this.checkRightToErasure(laboratoryId)
    findings.push(...erasureFindings)
    
    const status = this.determineComplianceStatus(findings)
    const recommendations = this.generateRecommendations(findings, 'GDPR')
    
    return {
      id: this.generateReportId(),
      framework: 'GDPR',
      laboratoryId,
      generatedAt: new Date(),
      period: '30 days',
      status,
      findings,
      recommendations
    }
  }

  // CLIA Compliance Methods
  async checkCLIACompliance(laboratoryId: string): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = []
    
    // Check quality control
    const qcFindings = await this.checkQualityControl(laboratoryId)
    findings.push(...qcFindings)
    
    // Check proficiency testing
    const ptFindings = await this.checkProficiencyTesting(laboratoryId)
    findings.push(...ptFindings)
    
    // Check personnel competency
    const competencyFindings = await this.checkPersonnelCompetency(laboratoryId)
    findings.push(...competencyFindings)
    
    const status = this.determineComplianceStatus(findings)
    const recommendations = this.generateRecommendations(findings, 'CLIA')
    
    return {
      id: this.generateReportId(),
      framework: 'CLIA',
      laboratoryId,
      generatedAt: new Date(),
      period: '30 days',
      status,
      findings,
      recommendations
    }
  }

  // CAP Compliance Methods
  async checkCAPCompliance(laboratoryId: string): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = []
    
    // Check inspection readiness
    const readinessFindings = await this.checkInspectionReadiness(laboratoryId)
    findings.push(...readinessFindings)
    
    // Check document control
    const documentFindings = await this.checkDocumentControl(laboratoryId)
    findings.push(...documentFindings)
    
    // Check quality management
    const qualityFindings = await this.checkQualityManagement(laboratoryId)
    findings.push(...qualityFindings)
    
    const status = this.determineComplianceStatus(findings)
    const recommendations = this.generateRecommendations(findings, 'CAP')
    
    return {
      id: this.generateReportId(),
      framework: 'CAP',
      laboratoryId,
      generatedAt: new Date(),
      period: '30 days',
      status,
      findings,
      recommendations
    }
  }

  // Data Subject Rights Implementation (GDPR)
  async implementDataSubjectRights(userId: string, right: string, request: any): Promise<boolean> {
    switch (right) {
      case 'ACCESS':
        return await this.grantDataAccess(userId, request)
      case 'PORTABILITY':
        return await this.exportUserData(userId, request)
      case 'ERASURE':
        return await this.eraseUserData(userId, request)
      case 'RECTIFICATION':
        return await this.rectifyUserData(userId, request)
      case 'RESTRICTION':
        return await this.restrictDataProcessing(userId, request)
      default:
        return false
    }
  }

  // Consent Management (GDPR)
  async manageConsent(userId: string, consentType: string, granted: boolean, request: any): Promise<boolean> {
    try {
      await this.prisma.userConsent.create({
        data: {
          userId,
          consentType,
          granted,
          timestamp: new Date(),
          ipAddress: request.ip,
          userAgent: request.get('User-Agent') || 'unknown'
        }
      })
      
      // Log consent event
      await this.auditLogger.logDataAccessEvent(
        userId,
        'unknown',
        'CONSENT',
        consentType,
        granted ? 'GRANTED' : 'REVOKED',
        request
      )
      
      return true
    } catch (error) {
      return false
    }
  }

  // Helper methods for compliance checks
  private async checkPHIProtection(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check if PHI fields are encrypted
    const phiData = await this.prisma.equipment.findMany({
      where: { laboratoryId },
      select: { patientData: true }
    })
    
    const unencryptedPHI = phiData.filter(item => 
      item.patientData && !this.isEncrypted(item.patientData)
    )
    
    if (unencryptedPHI.length > 0) {
      findings.push({
        id: this.generateFindingId(),
        category: 'PHI_PROTECTION',
        severity: 'CRITICAL',
        description: 'Unencrypted PHI data found',
        evidence: [`Found ${unencryptedPHI.length} records with unencrypted PHI`],
        remediation: 'Encrypt all PHI data using AES-256 encryption',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkAccessControls(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check role-based access controls
    const users = await this.prisma.user.findMany({
      where: { laboratoryId },
      select: { role: true, permissions: true }
    })
    
    const usersWithoutProperRoles = users.filter(user => 
      !['ADMIN', 'SUPERVISOR', 'TECHNICIAN', 'VIEWER'].includes(user.role)
    )
    
    if (usersWithoutProperRoles.length > 0) {
      findings.push({
        id: this.generateFindingId(),
        category: 'ACCESS_CONTROLS',
        severity: 'HIGH',
        description: 'Users without proper role assignments found',
        evidence: [`Found ${usersWithoutProperRoles.length} users with improper roles`],
        remediation: 'Assign proper roles to all users',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkAuditTrails(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check audit log completeness
    const auditLogs = await this.prisma.auditLog.findMany({
      where: { laboratoryId },
      orderBy: { timestamp: 'desc' },
      take: 100
    })
    
    const incompleteLogs = auditLogs.filter(log => 
      !log.ipAddress || !log.userAgent || !log.details
    )
    
    if (incompleteLogs.length > 0) {
      findings.push({
        id: this.generateFindingId(),
        category: 'AUDIT_TRAIL',
        severity: 'MEDIUM',
        description: 'Incomplete audit logs found',
        evidence: [`Found ${incompleteLogs.length} incomplete audit logs`],
        remediation: 'Ensure all audit logs contain complete information',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkEncryption(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check if encryption is properly implemented
    const hasEncryption = await this.checkEncryptionImplementation()
    
    if (!hasEncryption) {
      findings.push({
        id: this.generateFindingId(),
        category: 'ENCRYPTION',
        severity: 'CRITICAL',
        description: 'Data encryption not properly implemented',
        evidence: ['No encryption found for sensitive data'],
        remediation: 'Implement AES-256 encryption for all sensitive data',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkSecurityCriteria(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check for security incidents
    const securityIncidents = await this.prisma.securityEvent.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    })
    
    const criticalIncidents = securityIncidents.filter(incident => 
      incident.severity === 'CRITICAL'
    )
    
    if (criticalIncidents.length > 0) {
      findings.push({
        id: this.generateFindingId(),
        category: 'SECURITY',
        severity: 'CRITICAL',
        description: 'Critical security incidents detected',
        evidence: [`Found ${criticalIncidents.length} critical security incidents`],
        remediation: 'Investigate and resolve all critical security incidents',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkAvailabilityCriteria(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check system availability (placeholder)
    const availability = 99.9 // This would come from monitoring
    
    if (availability < 99.5) {
      findings.push({
        id: this.generateFindingId(),
        category: 'AVAILABILITY',
        severity: 'HIGH',
        description: 'System availability below required threshold',
        evidence: [`Current availability: ${availability}%`],
        remediation: 'Improve system availability to meet SOC2 requirements',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkProcessingIntegrity(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check data integrity
    const dataIntegrityChecks = await this.performDataIntegrityChecks(laboratoryId)
    
    if (!dataIntegrityChecks.passed) {
      findings.push({
        id: this.generateFindingId(),
        category: 'PROCESSING_INTEGRITY',
        severity: 'HIGH',
        description: 'Data integrity issues detected',
        evidence: dataIntegrityChecks.issues,
        remediation: 'Fix data integrity issues and implement validation',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkConfidentiality(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check data classification and protection
    const confidentialityChecks = await this.checkDataConfidentiality(laboratoryId)
    
    if (!confidentialityChecks.passed) {
      findings.push({
        id: this.generateFindingId(),
        category: 'CONFIDENTIALITY',
        severity: 'MEDIUM',
        description: 'Confidentiality controls need improvement',
        evidence: confidentialityChecks.issues,
        remediation: 'Implement proper data classification and protection',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  private async checkPrivacy(laboratoryId: string): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = []
    
    // Check privacy controls
    const privacyChecks = await this.checkPrivacyControls(laboratoryId)
    
    if (!privacyChecks.passed) {
      findings.push({
        id: this.generateFindingId(),
        category: 'PRIVACY',
        severity: 'MEDIUM',
        description: 'Privacy controls need improvement',
        evidence: privacyChecks.issues,
        remediation: 'Implement proper privacy controls',
        status: 'OPEN'
      })
    }
    
    return findings
  }

  // Data Subject Rights Implementation
  private async grantDataAccess(userId: string, request: any): Promise<boolean> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      // Log data access request
      await this.auditLogger.logDataAccessEvent(
        userId,
        'unknown',
        'USER_DATA',
        userId,
        'ACCESS_REQUEST',
        request
      )
      
      return true
    } catch (error) {
      return false
    }
  }

  private async exportUserData(userId: string, request: any): Promise<boolean> {
    try {
      // Export all user data in a portable format
      const userData = await this.collectUserData(userId)
      
      // Log data export
      await this.auditLogger.logDataAccessEvent(
        userId,
        'unknown',
        'USER_DATA',
        userId,
        'EXPORT_REQUEST',
        request
      )
      
      return true
    } catch (error) {
      return false
    }
  }

  private async eraseUserData(userId: string, request: any): Promise<boolean> {
    try {
      // Anonymize or delete user data
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${Date.now()}@deleted.com`,
          name: 'Deleted User',
          deletedAt: new Date()
        }
      })
      
      // Log data erasure
      await this.auditLogger.logDataAccessEvent(
        userId,
        'unknown',
        'USER_DATA',
        userId,
        'ERASURE_REQUEST',
        request
      )
      
      return true
    } catch (error) {
      return false
    }
  }

  // Helper methods
  private generateReportId(): string {
    return `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateFindingId(): string {
    return `finding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private determineComplianceStatus(findings: ComplianceFinding[]): 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' {
    const criticalFindings = findings.filter(f => f.severity === 'CRITICAL')
    const highFindings = findings.filter(f => f.severity === 'HIGH')
    
    if (criticalFindings.length > 0) {
      return 'NON_COMPLIANT'
    }
    
    if (highFindings.length > 0) {
      return 'PARTIAL'
    }
    
    return 'COMPLIANT'
  }

  private generateRecommendations(findings: ComplianceFinding[], framework: string): string[] {
    const recommendations: string[] = []
    
    for (const finding of findings) {
      recommendations.push(finding.remediation)
    }
    
    return recommendations
  }

  private isEncrypted(data: any): boolean {
    // Check if data appears to be encrypted
    return typeof data === 'string' && data.includes(':') && data.length > 100
  }

  private async checkEncryptionImplementation(): Promise<boolean> {
    // Check if encryption service is properly configured
    return true // Placeholder
  }

  private async performDataIntegrityChecks(laboratoryId: string): Promise<{
    passed: boolean
    issues: string[]
  }> {
    // Perform data integrity checks
    return { passed: true, issues: [] } // Placeholder
  }

  private async checkDataConfidentiality(laboratoryId: string): Promise<{
    passed: boolean
    issues: string[]
  }> {
    // Check data confidentiality controls
    return { passed: true, issues: [] } // Placeholder
  }

  private async checkPrivacyControls(laboratoryId: string): Promise<{
    passed: boolean
    issues: string[]
  }> {
    // Check privacy controls
    return { passed: true, issues: [] } // Placeholder
  }

  private async collectUserData(userId: string): Promise<any> {
    // Collect all user data for export
    return {} // Placeholder
  }

  private getDefaultConfig(): ComplianceConfig {
    return {
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
        trustCriteria: [],
        controlObjectives: [],
        monitoringFrequency: 'daily'
      },
      gdpr: {
        enabled: true,
        dataSubjectRights: [],
        consentManagement: true,
        dataPortability: true,
        rightToErasure: true
      },
      clia: {
        enabled: true,
        qualityControl: [],
        proficiencyTesting: true,
        personnelCompetency: true
      },
      cap: {
        enabled: true,
        inspectionReadiness: true,
        documentControl: true,
        qualityManagement: true
      }
    }
  }
} 