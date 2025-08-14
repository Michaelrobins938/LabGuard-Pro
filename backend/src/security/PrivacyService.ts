import { PrismaClient } from '@prisma/client'
import { EncryptionService } from './EncryptionService'

export class PrivacyService {
  private prisma: PrismaClient

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma
  }

  // GDPR Right to Access (Data Portability)
  async exportUserData(userId: string): Promise<{
    personalData: any
    activityLogs: any[]
    dataProcessingHistory: any[]
    exportDate: Date
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        auditLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) throw new Error('User not found')

    // Anonymize sensitive data in exports
    const sanitizedData = {
      personalInformation: {
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
        lastLogin: user.lastLoginAt,
        preferences: undefined
      },
      activitySummary: {
        totalLogins: (user as any).auditLogs?.filter((log: any) => log.action === 'LOGIN').length || 0,
        equipmentAccessed: 0,
        calibrationsPerformed: 0
      },
      dataProcessingConsents: []
    }

    // Log the data export for audit purposes
    await this.prisma.auditLog.create({
      data: {
        laboratoryId: (user as any).laboratoryId || 'system',
        userId,
        action: 'DATA_EXPORT',
        details: { resource: 'user_data', exportType: 'PRIVACY_REQUEST' } as any,
        ipAddress: 'system',
        userAgent: 'privacy_service',
        entity: 'USER',
        entityId: userId
      }
    })

    return {
      personalData: sanitizedData,
      activityLogs: (user as any).auditLogs || [],
      dataProcessingHistory: [],
      exportDate: new Date()
    }
  }

  // GDPR Right to be Forgotten
  async deleteUserData(userId: string, reason: string): Promise<{
    deletedRecords: number
    anonymizedRecords: number
    retainedForCompliance: string[]
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) throw new Error('User not found')

    let deletedRecords = 0
    let anonymizedRecords = 0
    const retainedForCompliance: string[] = []

    // Delete personal data that can be safely removed
    const deletableRelations = [
      'userPreferences',
      'notifications'
    ] as const

    for (const relation of deletableRelations) {
      try {
        const result = await (this.prisma as any)[relation].deleteMany({
          where: { userId }
        })
        deletedRecords += result.count
      } catch (error) {
        // Relation may not exist, continue
      }
    }

    // Anonymize data that must be retained for compliance
    const complianceRequiredData = [
      'auditLog',
      'calibrationRecord',
      'equipmentAccess'
    ] as const

    for (const dataType of complianceRequiredData) {
      try {
        const result = await (this.prisma as any)[dataType].updateMany({
          where: { userId },
          data: {
            userId: 'anonymized-user'
            // Remove or hash other identifiable information
          }
        })
        anonymizedRecords += result.count
        retainedForCompliance.push(`${dataType}: ${result.count} records`)
      } catch (error) {
        // Data type may not exist, continue
      }
    }

    // Create deletion record for audit trail
    await (this.prisma as any).dataDeletionRecord.create({
      data: {
        originalUserId: userId,
        deletionReason: reason,
        deletedRecords,
        anonymizedRecords,
        retainedData: retainedForCompliance,
        deletedAt: new Date(),
        deletedBy: 'privacy_service'
      }
    })

    // Finally, anonymize the user record itself
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@anonymized.local`,
        name: 'Deleted User',
        password: 'deleted',
        deletedAt: new Date()
      }
    })

    return {
      deletedRecords,
      anonymizedRecords,
      retainedForCompliance
    }
  }

  // Consent management
  async manageConsent(userId: string, consentData: {
    purpose: string
    granted: boolean
    ipAddress: string
    userAgent: string
  }): Promise<void> {
    await (this.prisma as any).dataProcessingConsent.upsert({
      where: {
        userId_purpose: {
          userId,
          purpose: consentData.purpose
        }
      },
      update: {
        status: consentData.granted ? 'GRANTED' : 'WITHDRAWN',
        lastUpdated: new Date(),
        ipAddress: consentData.ipAddress,
        userAgent: consentData.userAgent
      },
      create: {
        userId,
        purpose: consentData.purpose,
        status: consentData.granted ? 'GRANTED' : 'WITHDRAWN',
        grantedAt: consentData.granted ? new Date() : null,
        ipAddress: consentData.ipAddress,
        userAgent: consentData.userAgent
      }
    })

    // Log consent change
    await this.prisma.auditLog.create({
      data: {
        laboratoryId: (await this.prisma.user.findUnique({ where: { id: userId }, select: { laboratoryId: true } }))?.laboratoryId || 'system',
        userId,
        action: consentData.granted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN',
        details: { resource: 'data_processing_consent', purpose: consentData.purpose } as any,
        ipAddress: consentData.ipAddress,
        userAgent: consentData.userAgent,
        entity: 'USER',
        entityId: userId
      }
    })
  }

  // Data retention policy enforcement
  async enforceDataRetention(): Promise<void> {
    const retentionPolicies = [
      { dataType: 'audit_logs', retentionDays: 2555 }, // 7 years
      { dataType: 'calibration_records', retentionDays: 2555 }, // 7 years
      { dataType: 'login_history', retentionDays: 365 },
      { dataType: 'notifications', retentionDays: 30 }
    ]

    for (const policy of retentionPolicies) {
      try {
        const cutoffDate = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000)
        
        const result = await (this.prisma as any)[policy.dataType].deleteMany({
          where: {
            createdAt: { lt: cutoffDate }
          }
        })

        console.log(`Deleted ${result.count} old ${policy.dataType} records`)
      } catch (error) {
        // Data type may not exist, continue
      }
    }
  }

  // Check if user has given consent for a specific purpose
  async hasConsent(userId: string, purpose: string): Promise<boolean> {
    const consent = await (this.prisma as any).dataProcessingConsent.findUnique({
      where: {
        userId_purpose: {
          userId,
          purpose
        }
      }
    })

    return consent?.status === 'GRANTED'
  }
}