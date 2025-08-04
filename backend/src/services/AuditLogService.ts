import { PrismaClient } from '@prisma/client'

export type AuditMeta = Record<string, unknown>

export class AuditLogService {
  private prisma: PrismaClient

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma
  }

  async log(options: {
    laboratoryId: string
    userId?: string
    action: string
    entity: string
    entityId?: string
    details?: AuditMeta
    ipAddress?: string | null
    userAgent?: string | null
  }): Promise<void> {
    const {
      laboratoryId,
      userId,
      action,
      entity,
      entityId,
      details = {},
      ipAddress = null,
      userAgent = null
    } = options

    await this.prisma.auditLog.create({
      data: {
        laboratoryId,
        userId,
        action,
        entity,
        entityId,
        details: details as any,
        ipAddress: ipAddress ?? undefined,
        userAgent: userAgent ?? undefined
      }
    })
  }

  async logActivity(options: {
    action: string
    userId: string
    laboratoryId: string
    ipAddress?: string
    userAgent?: string
    metadata?: AuditMeta
  }): Promise<void> {
    const {
      action,
      userId,
      laboratoryId,
      ipAddress,
      userAgent,
      metadata = {}
    } = options

    await this.log({
      laboratoryId,
      userId,
      action,
      entity: 'SURVEILLANCE',
      details: metadata,
      ipAddress,
      userAgent
    })
  }
}