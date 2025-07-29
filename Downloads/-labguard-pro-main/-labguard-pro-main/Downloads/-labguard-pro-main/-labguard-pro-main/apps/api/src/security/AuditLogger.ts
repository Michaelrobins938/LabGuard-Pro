import { Request, Response } from 'express'
import { PrismaClient } from '@labguard/database'

export interface AuditEvent {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  sessionId: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL'
  complianceCategory: 'HIPAA' | 'SOC2' | 'CAP' | 'CLIA' | 'GENERAL'
}

export class AuditLogger {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  // Log authentication events
  async logAuthenticationEvent(
    userId: string,
    userEmail: string,
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'MFA_ENABLED' | 'MFA_DISABLED',
    ipAddress: string,
    userAgent: string,
    sessionId: string,
    outcome: 'SUCCESS' | 'FAILURE',
    details?: Record<string, any>
  ) {
    const severity = action === 'LOGIN_FAILED' ? 'HIGH' : 'LOW'
    
    await this.logEvent({
      id: this.generateEventId(),
      timestamp: new Date(),
      userId,
      userEmail,
      action,
      resource: 'AUTHENTICATION',
      details: {
        ...details,
        reason: action === 'LOGIN_FAILED' ? details?.reason : undefined
      },
      ipAddress,
      userAgent,
      sessionId,
      severity,
      outcome,
      complianceCategory: 'SOC2'
    })
  }

  // Log data access events
  async logDataAccessEvent(
    userId: string,
    userEmail: string,
    action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT',
    resource: string,
    resourceId: string,
    ipAddress: string,
    userAgent: string,
    sessionId: string,
    outcome: 'SUCCESS' | 'FAILURE',
    details?: Record<string, any>
  ) {
    const severity = this.getDataAccessSeverity(action, resource)
    
    await this.logEvent({
      id: this.generateEventId(),
      timestamp: new Date(),
      userId,
      userEmail,
      action,
      resource,
      resourceId,
      details: {
        ...details,
        dataType: this.getDataType(resource),
        sensitivityLevel: this.getSensitivityLevel(resource)
      },
      ipAddress,
      userAgent,
      sessionId,
      severity,
      outcome,
      complianceCategory: this.getComplianceCategory(resource)
    })
  }

  // Log system events
  async logSystemEvent(
    action: 'BACKUP' | 'RESTORE' | 'CONFIG_CHANGE' | 'SECURITY_UPDATE' | 'PERFORMANCE_ALERT',
    details: Record<string, any>,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ) {
    await this.logEvent({
      id: this.generateEventId(),
      timestamp: new Date(),
      userId: 'SYSTEM',
      userEmail: 'system@labguardpro.com',
      action,
      resource: 'SYSTEM',
      details,
      ipAddress: '127.0.0.1',
      userAgent: 'LabGuard-Pro-System',
      sessionId: 'system-session',
      severity,
      outcome: 'SUCCESS',
      complianceCategory: 'SOC2'
    })
  }

  // Log compliance events
  async logComplianceEvent(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    complianceType: 'HIPAA' | 'SOC2' | 'CAP' | 'CLIA',
    details: Record<string, any>,
    ipAddress: string,
    userAgent: string,
    sessionId: string
  ) {
    await this.logEvent({
      id: this.generateEventId(),
      timestamp: new Date(),
      userId,
      userEmail,
      action,
      resource,
      details: {
        ...details,
        complianceType,
        auditTrail: true
      },
      ipAddress,
      userAgent,
      sessionId,
      severity: 'HIGH',
      outcome: 'SUCCESS',
      complianceCategory: complianceType
    })
  }

  // Log security events
  async logSecurityEvent(
    action: 'UNAUTHORIZED_ACCESS' | 'SUSPICIOUS_ACTIVITY' | 'DATA_BREACH_ATTEMPT' | 'MALWARE_DETECTED',
    details: Record<string, any>,
    ipAddress: string,
    userAgent: string,
    userId?: string,
    userEmail?: string
  ) {
    await this.logEvent({
      id: this.generateEventId(),
      timestamp: new Date(),
      userId: userId || 'UNKNOWN',
      userEmail: userEmail || 'unknown@labguardpro.com',
      action,
      resource: 'SECURITY',
      details: {
        ...details,
        securityIncident: true,
        requiresInvestigation: true
      },
      ipAddress,
      userAgent,
      sessionId: 'security-session',
      severity: 'CRITICAL',
      outcome: 'FAILURE',
      complianceCategory: 'SOC2'
    })
  }

  // Main logging method
  private async logEvent(event: AuditEvent) {
    try {
      // Store in database
      await this.prisma.auditLog.create({
        data: {
          id: event.id,
          timestamp: event.timestamp,
          userId: event.userId,
          userEmail: event.userEmail,
          action: event.action,
          resource: event.resource,
          resourceId: event.resourceId,
          details: event.details,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          sessionId: event.sessionId,
          severity: event.severity,
          outcome: event.outcome,
          complianceCategory: event.complianceCategory
        }
      })

      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 AUDIT LOG:', {
          timestamp: event.timestamp.toISOString(),
          user: event.userEmail,
          action: event.action,
          resource: event.resource,
          severity: event.severity,
          outcome: event.outcome
        })
      }

      // Send critical events to security monitoring
      if (event.severity === 'CRITICAL') {
        await this.sendSecurityAlert(event)
      }

    } catch (error) {
      console.error('Failed to log audit event:', error)
      // Fallback to file logging
      await this.fallbackLogging(event)
    }
  }

  // Generate unique event ID
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Determine severity based on action and resource
  private getDataAccessSeverity(action: string, resource: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (action === 'DELETE' && this.isSensitiveResource(resource)) {
      return 'CRITICAL'
    }
    if (action === 'EXPORT' && this.isSensitiveResource(resource)) {
      return 'HIGH'
    }
    if (action === 'UPDATE' && this.isSensitiveResource(resource)) {
      return 'MEDIUM'
    }
    return 'LOW'
  }

  // Check if resource contains sensitive data
  private isSensitiveResource(resource: string): boolean {
    const sensitiveResources = [
      'PATIENT_DATA',
      'CALIBRATION_RECORDS',
      'COMPLIANCE_REPORTS',
      'AUDIT_LOGS',
      'USER_PROFILES'
    ]
    return sensitiveResources.some(sr => resource.toUpperCase().includes(sr))
  }

  // Get data type for compliance tracking
  private getDataType(resource: string): string {
    if (resource.includes('PATIENT')) return 'PHI'
    if (resource.includes('CALIBRATION')) return 'QUALITY_DATA'
    if (resource.includes('COMPLIANCE')) return 'REGULATORY_DATA'
    if (resource.includes('USER')) return 'PII'
    return 'GENERAL'
  }

  // Get sensitivity level
  private getSensitivityLevel(resource: string): string {
    if (this.isSensitiveResource(resource)) return 'HIGH'
    return 'LOW'
  }

  // Get compliance category
  private getComplianceCategory(resource: string): 'HIPAA' | 'SOC2' | 'CAP' | 'CLIA' | 'GENERAL' {
    if (resource.includes('PATIENT')) return 'HIPAA'
    if (resource.includes('CALIBRATION')) return 'CLIA'
    if (resource.includes('COMPLIANCE')) return 'CAP'
    return 'GENERAL'
  }

  // Send security alerts
  private async sendSecurityAlert(event: AuditEvent) {
    // Implementation for sending alerts to security team
    // This could integrate with Slack, email, or security monitoring tools
    console.warn('🚨 SECURITY ALERT:', {
      action: event.action,
      user: event.userEmail,
      resource: event.resource,
      timestamp: event.timestamp.toISOString(),
      details: event.details
    })
  }

  // Fallback logging to file
  private async fallbackLogging(event: AuditEvent) {
    const fs = require('fs').promises
    const logEntry = `${event.timestamp.toISOString()} | ${event.userEmail} | ${event.action} | ${event.resource} | ${event.severity} | ${event.outcome}\n`
    
    try {
      await fs.appendFile('/var/log/labguard-audit.log', logEntry)
    } catch (error) {
      console.error('Failed to write to audit log file:', error)
    }
  }

  // Get audit trail for compliance reporting
  async getAuditTrail(
    startDate: Date,
    endDate: Date,
    userId?: string,
    resource?: string,
    complianceCategory?: string
  ): Promise<AuditEvent[]> {
    const where: any = {
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    }

    if (userId) where.userId = userId
    if (resource) where.resource = resource
    if (complianceCategory) where.complianceCategory = complianceCategory

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' }
    })

    return logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      userId: log.userId,
      userEmail: log.userEmail,
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      details: log.details as Record<string, any>,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      sessionId: log.sessionId,
      severity: log.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      outcome: log.outcome as 'SUCCESS' | 'FAILURE' | 'PARTIAL',
      complianceCategory: log.complianceCategory as 'HIPAA' | 'SOC2' | 'CAP' | 'CLIA' | 'GENERAL'
    }))
  }

  // Generate compliance reports
  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    complianceType: 'HIPAA' | 'SOC2' | 'CAP' | 'CLIA'
  ) {
    const auditTrail = await this.getAuditTrail(startDate, endDate, undefined, undefined, complianceType)
    
    const report = {
      period: { startDate, endDate },
      complianceType,
      totalEvents: auditTrail.length,
      eventsBySeverity: this.groupBySeverity(auditTrail),
      eventsByAction: this.groupByAction(auditTrail),
      eventsByUser: this.groupByUser(auditTrail),
      securityIncidents: auditTrail.filter(e => e.severity === 'CRITICAL'),
      dataAccessEvents: auditTrail.filter(e => e.resource.includes('DATA')),
      authenticationEvents: auditTrail.filter(e => e.resource === 'AUTHENTICATION')
    }

    return report
  }

  private groupBySeverity(events: AuditEvent[]) {
    return events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private groupByAction(events: AuditEvent[]) {
    return events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private groupByUser(events: AuditEvent[]) {
    return events.reduce((acc, event) => {
      acc[event.userEmail] = (acc[event.userEmail] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
} 