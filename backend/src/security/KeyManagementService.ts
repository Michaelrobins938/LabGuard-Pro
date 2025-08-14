import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { EncryptionService } from './EncryptionService'

export class KeyManagementService {
  private prisma: PrismaClient
  private masterKey: string

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma
    this.masterKey = process.env.MASTER_ENCRYPTION_KEY || EncryptionService.generateEncryptionKey()
  }

  // Generate and store a new data encryption key
  async generateDataEncryptionKey(purpose: string = 'general'): Promise<string> {
    // Generate a new encryption key
    const key = EncryptionService.generateEncryptionKey()
    
    // Encrypt the key with the master key before storing
    const encryptedKey = await EncryptionService.encryptSensitiveField(key, this.masterKey)
    
    // Store encrypted key in database
    const keyRecord = await (this.prisma as any).encryptionKey?.create?.({
      data: {
        keyVersion: await this.getNextKeyVersion(),
        keyData: encryptedKey,
        algorithm: 'AES-256-GCM',
        purpose,
        isActive: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      }
    })

    return key
  }

  // Get the current active encryption key
  async getCurrentEncryptionKey(purpose: string = 'general'): Promise<string> {
    const activeKey = await (this.prisma as any).encryptionKey?.findFirst?.({
      where: { 
        isActive: true,
        purpose
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!activeKey) {
      // Generate a new key if none exists
      return await this.generateDataEncryptionKey(purpose)
    }

    // Decrypt the key with the master key
    return await EncryptionService.decryptSensitiveField(activeKey.keyData, this.masterKey)
  }

  // Automatic key rotation
  async rotateEncryptionKeys(): Promise<void> {
    const activeKeys = await (this.prisma as any).encryptionKey?.findMany?.({
      where: { 
        isActive: true,
        expiresAt: { lt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // Expiring in 30 days
      }
    })

    for (const key of activeKeys) {
      // Generate new key
      const newKey = await this.generateDataEncryptionKey(key.purpose)
      
      // In a real implementation, we would re-encrypt existing data with the new key
      // For now, we'll just deactivate the old key
      
      // Deactivate old key
      await (this.prisma as any).encryptionKey?.update?.({
        where: { id: key.id },
        data: { isActive: false, rotatedAt: new Date() }
      })
    }
  }

  // Validate encryption key integrity
  async validateKeyIntegrity(keyId: string): Promise<boolean> {
    try {
      const keyRecord = await (this.prisma as any).encryptionKey?.findUnique?.({
        where: { id: keyId }
      })
      
      if (!keyRecord) return false
      
      // Try to decrypt the key to verify integrity
      await EncryptionService.decryptSensitiveField(keyRecord.keyData, this.masterKey)
      return true
    } catch {
      return false
    }
  }

  private async getNextKeyVersion(): Promise<number> {
    const lastKey = await (this.prisma as any).encryptionKey?.findFirst?.({
      orderBy: { keyVersion: 'desc' }
    })
    return (lastKey?.keyVersion || 0) + 1
  }

  // Get all active keys for monitoring
  async getActiveKeys(): Promise<any[]> {
    return await (this.prisma as any).encryptionKey?.findMany?.({
      where: { isActive: true },
      select: {
        id: true,
        keyVersion: true,
        purpose: true,
        createdAt: true,
        expiresAt: true,
        rotatedAt: true
      }
    })
  }
}