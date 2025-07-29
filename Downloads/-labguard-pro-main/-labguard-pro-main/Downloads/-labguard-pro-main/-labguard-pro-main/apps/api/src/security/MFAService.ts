import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { PrismaClient } from '@labguard/database'
import { EncryptionService } from './EncryptionService'
import { AuditLogger } from './AuditLogger'

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

export class MFAService {
  private prisma: PrismaClient
  private auditLogger: AuditLogger

  constructor() {
    this.prisma = new PrismaClient()
    this.auditLogger = new AuditLogger()
  }

  // Initialize MFA for a user
  async initializeMFA(userId: string, request: any): Promise<MFASetupResult> {
    // Generate TOTP secret
    const secret = authenticator.generateSecret()
    
    // Generate backup codes
    const backupCodes = this.generateBackupCodes()
    
    // Create QR code for authenticator app
    const otpauth = authenticator.keyuri(userId, 'LabGuard Pro', secret)
    const qrCode = await QRCode.toDataURL(otpauth)
    
    // Store encrypted MFA configuration
    const encryptedSecret = await EncryptionService.encryptSensitiveField(
      secret,
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    const encryptedBackupCodes = await EncryptionService.encryptSensitiveField(
      JSON.stringify(backupCodes),
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: encryptedSecret,
        mfaBackupCodes: encryptedBackupCodes,
        mfaEnabled: true,
        mfaSetupComplete: false
      }
    })
    
    // Log MFA setup event
    await this.auditLogger.logAuthenticationEvent(
      userId,
      'MFA_ENABLED',
      request,
      'SUCCESS',
      { method: 'TOTP', setupComplete: false }
    )
    
    return {
      secret,
      qrCode,
      backupCodes,
      setupComplete: false
    }
  }

  // Verify TOTP token
  async verifyTOTP(userId: string, token: string, request: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user?.mfaSecret) {
      return false
    }
    
    // Decrypt the secret
    const decryptedSecret = await EncryptionService.decryptSensitiveField(
      user.mfaSecret,
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    // Verify the token
    const isValid = authenticator.verify({
      token,
      secret: decryptedSecret
    })
    
    if (isValid) {
      // Log successful verification
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_VERIFIED',
        request,
        'SUCCESS',
        { method: 'TOTP' }
      )
      
      // Update last used timestamp
      await this.prisma.user.update({
        where: { id: userId },
        data: { mfaLastUsed: new Date() }
      })
    } else {
      // Log failed verification
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_FAILED',
        request,
        'FAILURE',
        { method: 'TOTP', token: token.substring(0, 2) + '***' }
      )
    }
    
    return isValid
  }

  // Verify backup code
  async verifyBackupCode(userId: string, backupCode: string, request: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user?.mfaBackupCodes) {
      return false
    }
    
    // Decrypt backup codes
    const decryptedBackupCodes = await EncryptionService.decryptSensitiveField(
      user.mfaBackupCodes,
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    const backupCodes = JSON.parse(decryptedBackupCodes)
    
    // Check if backup code is valid
    const isValid = backupCodes.includes(backupCode)
    
    if (isValid) {
      // Remove used backup code
      const updatedBackupCodes = backupCodes.filter((code: string) => code !== backupCode)
      
      // Re-encrypt and store updated backup codes
      const encryptedUpdatedCodes = await EncryptionService.encryptSensitiveField(
        JSON.stringify(updatedBackupCodes),
        process.env.MFA_ENCRYPTION_KEY || 'default-key'
      )
      
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaBackupCodes: encryptedUpdatedCodes,
          mfaLastUsed: new Date()
        }
      })
      
      // Log successful backup code usage
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_BACKUP_USED',
        request,
        'SUCCESS',
        { method: 'BACKUP_CODE' }
      )
    } else {
      // Log failed backup code attempt
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_BACKUP_FAILED',
        request,
        'FAILURE',
        { method: 'BACKUP_CODE' }
      )
    }
    
    return isValid
  }

  // Send SMS verification code
  async sendSMSVerification(userId: string, phoneNumber: string, request: any): Promise<boolean> {
    try {
      const verificationCode = this.generateVerificationCode()
      
      // Store encrypted verification code with expiration
      const encryptedCode = await EncryptionService.encryptSensitiveField(
        verificationCode,
        process.env.MFA_ENCRYPTION_KEY || 'default-key'
      )
      
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSmsCode: encryptedCode,
          mfaSmsExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
      })
      
      // Send SMS via Twilio or other service
      await this.sendSMS(phoneNumber, `Your LabGuard Pro verification code is: ${verificationCode}`)
      
      // Log SMS sent event
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_SMS_SENT',
        request,
        'SUCCESS',
        { method: 'SMS', phoneNumber: this.maskPhoneNumber(phoneNumber) }
      )
      
      return true
    } catch (error) {
      // Log SMS failure
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_SMS_FAILED',
        request,
        'FAILURE',
        { method: 'SMS', error: error.message }
      )
      
      return false
    }
  }

  // Verify SMS code
  async verifySMSCode(userId: string, code: string, request: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user?.mfaSmsCode || !user.mfaSmsExpires) {
      return false
    }
    
    // Check if code is expired
    if (new Date() > user.mfaSmsExpires) {
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_SMS_EXPIRED',
        request,
        'FAILURE',
        { method: 'SMS' }
      )
      return false
    }
    
    // Decrypt and verify code
    const decryptedCode = await EncryptionService.decryptSensitiveField(
      user.mfaSmsCode,
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    const isValid = decryptedCode === code
    
    if (isValid) {
      // Clear the SMS code
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSmsCode: null,
          mfaSmsExpires: null,
          mfaLastUsed: new Date()
        }
      })
      
      // Log successful SMS verification
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_SMS_VERIFIED',
        request,
        'SUCCESS',
        { method: 'SMS' }
      )
    } else {
      // Log failed SMS verification
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_SMS_FAILED',
        request,
        'FAILURE',
        { method: 'SMS' }
      )
    }
    
    return isValid
  }

  // Send email verification code
  async sendEmailVerification(userId: string, email: string, request: any): Promise<boolean> {
    try {
      const verificationCode = this.generateVerificationCode()
      
      // Store encrypted verification code with expiration
      const encryptedCode = await EncryptionService.encryptSensitiveField(
        verificationCode,
        process.env.MFA_ENCRYPTION_KEY || 'default-key'
      )
      
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaEmailCode: encryptedCode,
          mfaEmailExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
      })
      
      // Send email verification
      await this.sendVerificationEmail(email, verificationCode)
      
      // Log email sent event
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_EMAIL_SENT',
        request,
        'SUCCESS',
        { method: 'EMAIL', email: this.maskEmail(email) }
      )
      
      return true
    } catch (error) {
      // Log email failure
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_EMAIL_FAILED',
        request,
        'FAILURE',
        { method: 'EMAIL', error: error.message }
      )
      
      return false
    }
  }

  // Verify email code
  async verifyEmailCode(userId: string, code: string, request: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user?.mfaEmailCode || !user.mfaEmailExpires) {
      return false
    }
    
    // Check if code is expired
    if (new Date() > user.mfaEmailExpires) {
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_EMAIL_EXPIRED',
        request,
        'FAILURE',
        { method: 'EMAIL' }
      )
      return false
    }
    
    // Decrypt and verify code
    const decryptedCode = await EncryptionService.decryptSensitiveField(
      user.mfaEmailCode,
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    const isValid = decryptedCode === code
    
    if (isValid) {
      // Clear the email code
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaEmailCode: null,
          mfaEmailExpires: null,
          mfaLastUsed: new Date()
        }
      })
      
      // Log successful email verification
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_EMAIL_VERIFIED',
        request,
        'SUCCESS',
        { method: 'EMAIL' }
      )
    } else {
      // Log failed email verification
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_EMAIL_FAILED',
        request,
        'FAILURE',
        { method: 'EMAIL' }
      )
    }
    
    return isValid
  }

  // Disable MFA for a user
  async disableMFA(userId: string, request: any): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: null,
          mfaSetupComplete: false,
          mfaSmsCode: null,
          mfaSmsExpires: null,
          mfaEmailCode: null,
          mfaEmailExpires: null
        }
      })
      
      // Log MFA disable event
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_DISABLED',
        request,
        'SUCCESS'
      )
      
      return true
    } catch (error) {
      await this.auditLogger.logAuthenticationEvent(
        userId,
        'MFA_DISABLE_FAILED',
        request,
        'FAILURE',
        { error: error.message }
      )
      
      return false
    }
  }

  // Generate new backup codes
  async regenerateBackupCodes(userId: string, request: any): Promise<string[]> {
    const backupCodes = this.generateBackupCodes()
    
    const encryptedBackupCodes = await EncryptionService.encryptSensitiveField(
      JSON.stringify(backupCodes),
      process.env.MFA_ENCRYPTION_KEY || 'default-key'
    )
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaBackupCodes: encryptedBackupCodes }
    })
    
    // Log backup codes regeneration
    await this.auditLogger.logAuthenticationEvent(
      userId,
      'MFA_BACKUP_REGENERATED',
      request,
      'SUCCESS'
    )
    
    return backupCodes
  }

  // Helper methods
  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateVerificationCode())
    }
    return codes
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private maskPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2')
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    return `${local.charAt(0)}***@${domain}`
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    // Implement SMS sending logic (Twilio, etc.)
    console.log(`SMS to ${phoneNumber}: ${message}`)
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    // Implement email sending logic
    console.log(`Email to ${email}: Verification code ${code}`)
  }
} 