import crypto from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)
const randomBytes = promisify(crypto.randomBytes)

export class EncryptionService {
  private algorithm = 'aes-256-gcm'
  private keyLength = 32
  private ivLength = 16
  private saltLength = 64
  private tagLength = 16

  // Field-level encryption for sensitive data
  async encryptField(data: string, masterKey: string): Promise<string> {
    try {
      const salt = await randomBytes(this.saltLength)
      const key = await scrypt(masterKey, salt, this.keyLength) as Buffer
      const iv = await randomBytes(this.ivLength)
      
      const cipher = crypto.createCipher(this.algorithm, key)
      cipher.setAAD(Buffer.from('field-encryption'))
      
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()
      
      // Combine salt + iv + tag + encrypted data
      const result = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')])
      return result.toString('base64')
    } catch (error) {
      throw new Error(`Field encryption failed: ${error.message}`)
    }
  }

  async decryptField(encryptedData: string, masterKey: string): Promise<string> {
    try {
      const data = Buffer.from(encryptedData, 'base64')
      
      const salt = data.subarray(0, this.saltLength)
      const iv = data.subarray(this.saltLength, this.saltLength + this.ivLength)
      const tag = data.subarray(this.saltLength + this.ivLength, this.saltLength + this.ivLength + this.tagLength)
      const encrypted = data.subarray(this.saltLength + this.ivLength + this.tagLength)
      
      const key = await scrypt(masterKey, salt, this.keyLength) as Buffer
      
      const decipher = crypto.createDecipher(this.algorithm, key)
      decipher.setAuthTag(tag)
      decipher.setAAD(Buffer.from('field-encryption'))
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      throw new Error(`Field decryption failed: ${error.message}`)
    }
  }

  // File encryption for uploaded documents
  async encryptFile(fileBuffer: Buffer, masterKey: string): Promise<Buffer> {
    try {
      const salt = await randomBytes(this.saltLength)
      const key = await scrypt(masterKey, salt, this.keyLength) as Buffer
      const iv = await randomBytes(this.ivLength)
      
      const cipher = crypto.createCipher(this.algorithm, key)
      cipher.setAAD(Buffer.from('file-encryption'))
      
      const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
      ])
      
      const tag = cipher.getAuthTag()
      
      // Combine salt + iv + tag + encrypted data
      return Buffer.concat([salt, iv, tag, encrypted])
    } catch (error) {
      throw new Error(`File encryption failed: ${error.message}`)
    }
  }

  async decryptFile(encryptedBuffer: Buffer, masterKey: string): Promise<Buffer> {
    try {
      const salt = encryptedBuffer.subarray(0, this.saltLength)
      const iv = encryptedBuffer.subarray(this.saltLength, this.saltLength + this.ivLength)
      const tag = encryptedBuffer.subarray(this.saltLength + this.ivLength, this.saltLength + this.ivLength + this.tagLength)
      const encrypted = encryptedBuffer.subarray(this.saltLength + this.ivLength + this.tagLength)
      
      const key = await scrypt(masterKey, salt, this.keyLength) as Buffer
      
      const decipher = crypto.createDecipher(this.algorithm, key)
      decipher.setAuthTag(tag)
      decipher.setAAD(Buffer.from('file-encryption'))
      
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ])
      
      return decrypted
    } catch (error) {
      throw new Error(`File decryption failed: ${error.message}`)
    }
  }

  // Database encryption for sensitive columns
  async encryptDatabaseField(data: string, tableName: string, columnName: string, masterKey: string): Promise<string> {
    try {
      const salt = await randomBytes(this.saltLength)
      const key = await scrypt(masterKey, salt, this.keyLength) as Buffer
      const iv = await randomBytes(this.ivLength)
      
      const cipher = crypto.createCipher(this.algorithm, key)
      cipher.setAAD(Buffer.from(`${tableName}-${columnName}`))
      
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()
      
      const result = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')])
      return result.toString('base64')
    } catch (error) {
      throw new Error(`Database encryption failed: ${error.message}`)
    }
  }

  async decryptDatabaseField(encryptedData: string, tableName: string, columnName: string, masterKey: string): Promise<string> {
    try {
      const data = Buffer.from(encryptedData, 'base64')
      
      const salt = data.subarray(0, this.saltLength)
      const iv = data.subarray(this.saltLength, this.saltLength + this.ivLength)
      const tag = data.subarray(this.saltLength + this.ivLength, this.saltLength + this.ivLength + this.tagLength)
      const encrypted = data.subarray(this.saltLength + this.ivLength + this.tagLength)
      
      const key = await scrypt(masterKey, salt, this.keyLength) as Buffer
      
      const decipher = crypto.createDecipher(this.algorithm, key)
      decipher.setAuthTag(tag)
      decipher.setAAD(Buffer.from(`${tableName}-${columnName}`))
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      throw new Error(`Database decryption failed: ${error.message}`)
    }
  }

  // Key rotation for compliance
  async rotateEncryptionKey(oldKey: string, newKey: string, encryptedData: string): Promise<string> {
    try {
      // Decrypt with old key
      const decrypted = await this.decryptField(encryptedData, oldKey)
      // Re-encrypt with new key
      return await this.encryptField(decrypted, newKey)
    } catch (error) {
      throw new Error(`Key rotation failed: ${error.message}`)
    }
  }

  // Generate secure random keys
  async generateSecureKey(): Promise<string> {
    const key = await randomBytes(this.keyLength)
    return key.toString('base64')
  }

  // Hash sensitive data for comparison
  async hashSensitiveData(data: string, salt?: Buffer): Promise<{ hash: string; salt: Buffer }> {
    const usedSalt = salt || await randomBytes(32)
    const hash = await scrypt(data, usedSalt, 64) as Buffer
    return {
      hash: hash.toString('base64'),
      salt: usedSalt
    }
  }

  // Verify hashed data
  async verifyHashedData(data: string, hash: string, salt: Buffer): Promise<boolean> {
    try {
      const computedHash = await scrypt(data, salt, 64) as Buffer
      return crypto.timingSafeEqual(computedHash, Buffer.from(hash, 'base64'))
    } catch (error) {
      return false
    }
  }
} 