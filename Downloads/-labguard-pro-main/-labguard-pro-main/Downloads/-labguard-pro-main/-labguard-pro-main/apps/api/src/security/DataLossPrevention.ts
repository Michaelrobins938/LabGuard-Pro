import { Request, Response } from 'express'
import { PrismaClient } from '@labguard/database'
import { AuditLogger } from './AuditLogger'

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

export class DataLossPrevention {
  private prisma: PrismaClient
  private auditLogger: AuditLogger
  private config: DLPConfig

  constructor() {
    this.prisma = new PrismaClient()
    this.auditLogger = new AuditLogger()
    this.config = this.getDefaultConfig()
  }

  // Monitor data access for potential DLP violations
  async monitorDataAccess(
    userId: string,
    laboratoryId: string,
    resource: string,
    action: string,
    data: any,
    request: Request
  ): Promise<DLPIncident[]> {
    const incidents: DLPIncident[] = []
    
    // Check against all enabled DLP rules
    for (const rule of this.config.rules.filter(r => r.enabled)) {
      const violation = await this.checkRuleViolation(rule, {
        userId,
        laboratoryId,
        resource,
        action,
        data,
        request
      })
      
      if (violation) {
        const incident = await this.createIncident(rule, violation, request)
        incidents.push(incident)
        
        // Execute rule actions
        await this.executeRuleActions(rule, incident, request)
      }
    }
    
    return incidents
  }

  // Monitor data exports for sensitive information
  async monitorDataExport(
    userId: string,
    laboratoryId: string,
    exportData: any,
    format: string,
    request: Request
  ): Promise<DLPIncident[]> {
    const incidents: DLPIncident[] = []
    
    // Check for sensitive data in exports
    const sensitiveDataFound = this.detectSensitiveData(exportData)
    
    if (sensitiveDataFound.length > 0) {
      const incident = await this.createIncident(
        this.getExportRule(),
        {
          type: 'SENSITIVE_DATA_EXPORT',
          description: `Sensitive data detected in export: ${sensitiveDataFound.join(', ')}`,
          severity: 'HIGH',
          data: {
            exportFormat: format,
            sensitiveFields: sensitiveDataFound,
            dataSize: JSON.stringify(exportData).length
          }
        },
        request
      )
      
      incidents.push(incident)
      
      // Block export if configured
      if (this.shouldBlockExport(incident)) {
        throw new Error('Export blocked due to sensitive data detection')
      }
    }
    
    return incidents
  }

  // Monitor file uploads for malicious content
  async monitorFileUpload(
    userId: string,
    laboratoryId: string,
    file: Express.Multer.File,
    request: Request
  ): Promise<DLPIncident[]> {
    const incidents: DLPIncident[] = []
    
    // Check file type and content
    const fileAnalysis = await this.analyzeFile(file)
    
    if (fileAnalysis.suspicious) {
      const incident = await this.createIncident(
        this.getFileUploadRule(),
        {
          type: 'SUSPICIOUS_FILE_UPLOAD',
          description: `Suspicious file upload detected: ${fileAnalysis.reason}`,
          severity: 'MEDIUM',
          data: {
            fileName: file.originalname,
            fileSize: file.size,
            fileType: file.mimetype,
            analysis: fileAnalysis
          }
        },
        request
      )
      
      incidents.push(incident)
    }
    
    return incidents
  }

  // Monitor API usage for unusual patterns
  async monitorAPIUsage(
    userId: string,
    laboratoryId: string,
    endpoint: string,
    request: Request,
    response: Response
  ): Promise<DLPIncident[]> {
    const incidents: DLPIncident[] = []
    
    // Check for unusual API usage patterns
    const usagePattern = await this.analyzeAPIUsage(userId, endpoint, request)
    
    if (usagePattern.suspicious) {
      const incident = await this.createIncident(
        this.getAPIUsageRule(),
        {
          type: 'SUSPICIOUS_API_USAGE',
          description: `Unusual API usage pattern detected: ${usagePattern.reason}`,
          severity: 'MEDIUM',
          data: {
            endpoint,
            pattern: usagePattern,
            requestCount: usagePattern.requestCount,
            timeWindow: usagePattern.timeWindow
          }
        },
        request
      )
      
      incidents.push(incident)
    }
    
    return incidents
  }

  // Check for rule violations
  private async checkRuleViolation(rule: DLPRule, context: any): Promise<any | null> {
    for (const condition of rule.conditions) {
      const value = this.extractValue(context, condition.field)
      
      if (!this.evaluateCondition(condition, value)) {
        return null // No violation
      }
    }
    
    // All conditions met - violation detected
    return {
      type: 'RULE_VIOLATION',
      description: `DLP rule violation: ${rule.name}`,
      severity: rule.priority,
      data: {
        ruleId: rule.id,
        ruleName: rule.name,
        context
      }
    }
  }

  // Execute rule actions
  private async executeRuleActions(rule: DLPRule, incident: DLPIncident, request: Request): Promise<void> {
    for (const action of rule.actions) {
      switch (action.type) {
        case 'BLOCK':
          await this.blockAction(incident, action.parameters)
          break
        case 'ALERT':
          await this.alertAction(incident, action.parameters)
          break
        case 'LOG':
          await this.logAction(incident, action.parameters)
          break
        case 'QUARANTINE':
          await this.quarantineAction(incident, action.parameters)
          break
        case 'NOTIFY_ADMIN':
          await this.notifyAdminAction(incident, action.parameters)
          break
      }
    }
  }

  // Create DLP incident
  private async createIncident(rule: DLPRule, violation: any, request: Request): Promise<DLPIncident> {
    const incident: DLPIncident = {
      id: this.generateIncidentId(),
      userId: violation.data?.userId || 'unknown',
      laboratoryId: violation.data?.laboratoryId || 'unknown',
      ruleId: rule.id,
      severity: violation.severity,
      description: violation.description,
      timestamp: new Date(),
      data: violation.data,
      status: 'OPEN'
    }
    
    await this.prisma.dlpIncident.create({
      data: {
        id: incident.id,
        userId: incident.userId,
        laboratoryId: incident.laboratoryId,
        ruleId: incident.ruleId,
        severity: incident.severity,
        description: incident.description,
        timestamp: incident.timestamp,
        data: incident.data,
        status: incident.status
      }
    })
    
    return incident
  }

  // Detect sensitive data in exports
  private detectSensitiveData(data: any): string[] {
    const sensitiveFields: string[] = []
    const sensitivePatterns = [
      /ssn|social.*security/i,
      /credit.*card|cc.*number/i,
      /password|passwd/i,
      /api.*key|secret.*key/i,
      /phone.*number|mobile.*number/i,
      /email.*address/i,
      /address|street.*address/i,
      /date.*of.*birth|birth.*date/i
    ]
    
    const dataString = JSON.stringify(data).toLowerCase()
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(dataString)) {
        sensitiveFields.push(pattern.source)
      }
    }
    
    return sensitiveFields
  }

  // Analyze uploaded files
  private async analyzeFile(file: Express.Multer.File): Promise<{
    suspicious: boolean
    reason?: string
    riskScore: number
  }> {
    let riskScore = 0
    let reason = ''
    
    // Check file size
    if (file.size > 10 * 1024 * 1024) { // 10MB
      riskScore += 30
      reason += 'Large file size; '
    }
    
    // Check file type
    const suspiciousTypes = [
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msi',
      'application/x-msdos-program'
    ]
    
    if (suspiciousTypes.includes(file.mimetype)) {
      riskScore += 50
      reason += 'Suspicious file type; '
    }
    
    // Check file extension
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr']
    const fileExtension = file.originalname.toLowerCase().split('.').pop()
    
    if (fileExtension && suspiciousExtensions.includes(`.${fileExtension}`)) {
      riskScore += 40
      reason += 'Suspicious file extension; '
    }
    
    return {
      suspicious: riskScore > 50,
      reason: reason.trim() || undefined,
      riskScore
    }
  }

  // Analyze API usage patterns
  private async analyzeAPIUsage(userId: string, endpoint: string, request: Request): Promise<{
    suspicious: boolean
    reason?: string
    requestCount: number
    timeWindow: number
  }> {
    const timeWindow = 5 * 60 * 1000 // 5 minutes
    const startTime = new Date(Date.now() - timeWindow)
    
    // Get recent API calls for this user
    const recentCalls = await this.prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: startTime
        },
        resource: 'API'
      }
    })
    
    const requestCount = recentCalls.length
    let suspicious = false
    let reason = ''
    
    // Check for rate limiting violations
    if (requestCount > 100) {
      suspicious = true
      reason = 'High API request rate'
    }
    
    // Check for unusual endpoints
    const unusualEndpoints = ['/api/admin', '/api/system', '/api/security']
    if (unusualEndpoints.some(ep => endpoint.includes(ep))) {
      suspicious = true
      reason = 'Access to sensitive endpoints'
    }
    
    return {
      suspicious,
      reason: reason || undefined,
      requestCount,
      timeWindow
    }
  }

  // Helper methods
  private extractValue(context: any, field: string): any {
    const keys = field.split('.')
    let value = context
    
    for (const key of keys) {
      value = value?.[key]
    }
    
    return value
  }

  private evaluateCondition(condition: DLPCondition, value: any): boolean {
    switch (condition.operator) {
      case 'EQUALS':
        return value === condition.value
      case 'CONTAINS':
        return String(value).includes(condition.value)
      case 'REGEX':
        return new RegExp(condition.value).test(String(value))
      case 'GREATER_THAN':
        return Number(value) > Number(condition.value)
      case 'LESS_THAN':
        return Number(value) < Number(condition.value)
      default:
        return false
    }
  }

  private generateIncidentId(): string {
    return `dlp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private shouldBlockExport(incident: DLPIncident): boolean {
    return incident.severity === 'CRITICAL' || incident.severity === 'HIGH'
  }

  // Action implementations
  private async blockAction(incident: DLPIncident, parameters: any): Promise<void> {
    // Implement blocking logic
    console.log(`BLOCKING: ${incident.description}`)
  }

  private async alertAction(incident: DLPIncident, parameters: any): Promise<void> {
    // Send alert to security team
    console.log(`ALERT: ${incident.description}`)
  }

  private async logAction(incident: DLPIncident, parameters: any): Promise<void> {
    // Log to security log
    console.log(`LOG: ${incident.description}`)
  }

  private async quarantineAction(incident: DLPIncident, parameters: any): Promise<void> {
    // Quarantine data/files
    console.log(`QUARANTINE: ${incident.description}`)
  }

  private async notifyAdminAction(incident: DLPIncident, parameters: any): Promise<void> {
    // Notify administrators
    console.log(`NOTIFY ADMIN: ${incident.description}`)
  }

  // Default configuration
  private getDefaultConfig(): DLPConfig {
    return {
      enabled: true,
      rules: [
        {
          id: 'export_sensitive_data',
          name: 'Sensitive Data Export',
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
    }
  }

  private getExportRule(): DLPRule {
    return {
      id: 'data_export_monitoring',
      name: 'Data Export Monitoring',
      description: 'Monitor data exports for sensitive information',
      enabled: true,
      priority: 'HIGH',
      conditions: [],
      actions: [
        {
          type: 'ALERT',
          parameters: {}
        }
      ]
    }
  }

  private getFileUploadRule(): DLPRule {
    return {
      id: 'file_upload_monitoring',
      name: 'File Upload Monitoring',
      description: 'Monitor file uploads for malicious content',
      enabled: true,
      priority: 'MEDIUM',
      conditions: [],
      actions: [
        {
          type: 'LOG',
          parameters: {}
        }
      ]
    }
  }

  private getAPIUsageRule(): DLPRule {
    return {
      id: 'api_usage_monitoring',
      name: 'API Usage Monitoring',
      description: 'Monitor API usage for unusual patterns',
      enabled: true,
      priority: 'MEDIUM',
      conditions: [],
      actions: [
        {
          type: 'ALERT',
          parameters: {}
        }
      ]
    }
  }
} 