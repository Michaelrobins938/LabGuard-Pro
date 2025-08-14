import crypto from 'crypto'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export class EncryptionService {
  private static readonly algorithm = 'aes-256-gcm'
  private static readonly keyDerivationIterations = 100000

  // Field-level encryption for sensitive data
  static async encryptSensitiveField(data: string, encryptionKey: string): Promise<string> {
    const iv = randomBytes(16)
    const salt = randomBytes(32)
    
    // Derive key using PBKDF2
    const key = crypto.pbkdf2Sync(encryptionKey, salt, EncryptionService.keyDerivationIterations, 32, 'sha256')
    
    const cipher = createCipheriv(EncryptionService.algorithm, key, iv)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    // Combine IV, salt, authTag, and encrypted data
    return `${iv.toString('hex')}:${salt.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  static async decryptSensitiveField(encryptedData: string, encryptionKey: string): Promise<string> {
    const [ivHex, saltHex, authTagHex, encrypted] = encryptedData.split(':')
    
    const iv = Buffer.from(ivHex, 'hex')
    const salt = Buffer.from(saltHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    // Derive the same key
    const key = crypto.pbkdf2Sync(encryptionKey, salt, EncryptionService.keyDerivationIterations, 32, 'sha256')
    
    const decipher = createDecipheriv(EncryptionService.algorithm, key, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // File encryption for document storage
  static async encryptFile(fileBuffer: Buffer, encryptionKey: string): Promise<{
    encryptedData: Buffer
    metadata: string
  }> {
    const iv = randomBytes(16)
    const salt = randomBytes(32)
    const key = crypto.pbkdf2Sync(encryptionKey, salt, EncryptionService.keyDerivationIterations, 32, 'sha256')
    
    const cipher = createCipheriv(EncryptionService.algorithm, key, iv)
    const encryptedChunks: Buffer[] = []
    
    encryptedChunks.push(cipher.update(fileBuffer))
    encryptedChunks.push(cipher.final())
    
    const authTag = cipher.getAuthTag()
    const encryptedData = Buffer.concat(encryptedChunks)
    
    const metadata = `${iv.toString('hex')}:${salt.toString('hex')}:${authTag.toString('hex')}`
    
    return { encryptedData, metadata }
  }

  // Decrypt file
  static async decryptFile(encryptedData: Buffer, metadata: string, encryptionKey: string): Promise<Buffer> {
    const [ivHex, saltHex, authTagHex] = metadata.split(':')
    
    const iv = Buffer.from(ivHex, 'hex')
    const salt = Buffer.from(saltHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    const key = crypto.pbkdf2Sync(encryptionKey, salt, EncryptionService.keyDerivationIterations, 32, 'sha256')
    
    const decipher = createDecipheriv(EncryptionService.algorithm, key, iv)
    decipher.setAuthTag(authTag)
    
    const decryptedChunks: Buffer[] = []
    decryptedChunks.push(decipher.update(encryptedData))
    decryptedChunks.push(decipher.final())
    
    return Buffer.concat(decryptedChunks)
  }

  // Generate a secure encryption key
  static generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  // Hash data for integrity verification
  static hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }
}