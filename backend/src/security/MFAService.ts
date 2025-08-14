import { PrismaClient } from '@prisma/client'
// Use dynamic import to avoid type resolution errors if types are missing
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy') as any
import bcrypt from 'bcryptjs'

export class MFAService {
  private prisma: PrismaClient

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma
  }

  // Setup MFA for a user
  async setupMFA(userId: string): Promise<{
    secret: string
    backupCodes: string[]
  }> {
    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `LabGuard Pro (${userId})`,
      issuer: 'LabGuard Pro'
    })

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 15)
    )

    // Hash backup codes for storage
    const hashedBackupCodes = backupCodes.map(code => bcrypt.hashSync(code, 10))

    // Store MFA settings
    await (this.prisma as any).userMFA.upsert({
      where: { userId },
      update: {
        secret: secret.base32,
        backupCodes: hashedBackupCodes,
        isEnabled: false, // User must verify first
        updatedAt: new Date()
      },
      create: {
        userId,
        secret: secret.base32,
        backupCodes: hashedBackupCodes,
        isEnabled: false
      }
    })

    return {
      secret: secret.base32,
      backupCodes
    }
  }

  // Verify MFA token
  async verifyMFA(userId: string, token: string, isBackupCode: boolean = false): Promise<boolean> {
    const userMFA = await (this.prisma as any).userMFA.findUnique({
      where: { userId }
    })

    if (!userMFA) return false

    if (isBackupCode) {
      // Verify backup code
      return await this.verifyBackupCode(userId, token, userMFA.backupCodes)
    } else {
      // Verify TOTP token
      return speakeasy.totp.verify({
        secret: userMFA.secret,
        encoding: 'base32',
        token,
        window: 2 // Allow 2 time steps of drift
      })
    }
  }

  // Enable MFA after successful verification
  async enableMFA(userId: string): Promise<void> {
    await (this.prisma as any).userMFA.update({
      where: { userId },
      data: { 
        isEnabled: true,
        lastEnabledAt: new Date()
      }
    })
  }

  // Disable MFA
  async disableMFA(userId: string): Promise<void> {
    await (this.prisma as any).userMFA.update({
      where: { userId },
      data: { isEnabled: false }
    })
  }

  // Check if MFA is enabled for a user
  async isMFAEnabled(userId: string): Promise<boolean> {
    const userMFA = await (this.prisma as any).userMFA.findUnique({
      where: { userId }
    })
    
    return userMFA?.isEnabled || false
  }

  // Generate new backup codes
  async generateNewBackupCodes(userId: string): Promise<string[]> {
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 15)
    )

    const hashedBackupCodes = backupCodes.map(code => bcrypt.hashSync(code, 10))

    await (this.prisma as any).userMFA.update({
      where: { userId },
      data: { backupCodes: hashedBackupCodes }
    })

    return backupCodes
  }

  private async verifyBackupCode(userId: string, code: string, hashedCodes: string[]): Promise<boolean> {
    for (let i = 0; i < hashedCodes.length; i++) {
      if (await bcrypt.compare(code, hashedCodes[i])) {
        // Remove the used backup code
        const newHashedCodes = [...hashedCodes]
        newHashedCodes.splice(i, 1)
        
        await (this.prisma as any).userMFA.update({
          where: { userId },
          data: { backupCodes: newHashedCodes }
        })
        
        return true
      }
    }
    return false
  }

  // Log MFA verification attempt
  async logMFAAttempt(userId: string, success: boolean, method: 'TOTP' | 'BACKUP'): Promise<void> {
    await (this.prisma as any).mfaAttempt.create({
      data: {
        userId,
        success,
        method,
        ipAddress: '', // Would be populated from request context
        userAgent: ''  // Would be populated from request context
      }
    })
  }
}