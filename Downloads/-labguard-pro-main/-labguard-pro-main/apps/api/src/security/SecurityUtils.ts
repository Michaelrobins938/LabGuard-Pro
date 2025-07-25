import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class SecurityUtils {
  // Password validation and hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    // Length check
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('Password must be at least 8 characters long')
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one uppercase letter')
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one lowercase letter')
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one number')
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one special character')
    }

    // Common password check
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'football'
    ]
    
    if (commonPasswords.includes(password.toLowerCase())) {
      score -= 2
      feedback.push('Password is too common')
    }

    return {
      isValid: score >= 4,
      score,
      feedback
    }
  }

  // Token generation and validation
  static generateAccessToken(payload: any, expiresIn: string = '1h'): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
      expiresIn,
      issuer: 'labguard-pro',
      audience: 'labguard-users'
    } as jwt.SignOptions)
  }

  static generateRefreshToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', {
      expiresIn: '7d',
      issuer: 'labguard-pro',
      audience: 'labguard-users'
    } as jwt.SignOptions)
  }

  static verifyToken(token: string, secret: string = process.env.JWT_SECRET || 'default-secret'): any {
    try {
      return jwt.verify(token, secret)
    } catch (error) {
      return null
    }
  }

  static decodeToken(token: string): any {
    try {
      return jwt.decode(token)
    } catch (error) {
      return null
    }
  }

  // Random string generation
  static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  static generateSecureToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  static generateAPIKey(): string {
    return `lg_${crypto.randomBytes(32).toString('hex')}`
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  static sanitizePhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, '')
  }

  // Security checks
  static isSecurePassword(password: string): boolean {
    const validation = this.validatePasswordStrength(password)
    return validation.isValid
  }

  static isSecureToken(token: string): boolean {
    return token.length >= 32 && /^[a-zA-Z0-9]+$/.test(token)
  }

  static isSecureAPIKey(apiKey: string): boolean {
    return apiKey.startsWith('lg_') && apiKey.length >= 64
  }

  // Rate limiting utilities
  static generateRateLimitKey(identifier: string, action: string): string {
    return `rate_limit:${identifier}:${action}`
  }

  static calculateRateLimitWindow(windowMs: number): number {
    return Math.floor(Date.now() / windowMs) * windowMs
  }

  // Threat detection utilities
  static detectSuspiciousActivity(userAgent: string, ipAddress: string): {
    suspicious: boolean
    reasons: string[]
  } {
    const reasons: string[] = []
    let suspicious = false

    // Check for suspicious user agents
    const suspiciousUserAgents = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i
    ]

    for (const pattern of suspiciousUserAgents) {
      if (pattern.test(userAgent)) {
        reasons.push('Suspicious user agent detected')
        suspicious = true
      }
    }

    // Check for suspicious IP patterns
    const suspiciousIPPatterns = [
      /^0\.0\.0\.0$/,
      /^127\.0\.0\.1$/,
      /^10\./,
      /^192\.168\./
    ]

    for (const pattern of suspiciousIPPatterns) {
      if (pattern.test(ipAddress)) {
        reasons.push('Suspicious IP address detected')
        suspicious = true
      }
    }

    return { suspicious, reasons }
  }

  // Data classification utilities
  static classifyData(data: any): 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' {
    const dataString = JSON.stringify(data).toLowerCase()
    
    // Check for restricted data patterns
    const restrictedPatterns = [
      /ssn|social.*security/i,
      /credit.*card|cc.*number/i,
      /password|passwd/i,
      /api.*key|secret.*key/i
    ]
    
    for (const pattern of restrictedPatterns) {
      if (pattern.test(dataString)) {
        return 'RESTRICTED'
      }
    }

    // Check for confidential data patterns
    const confidentialPatterns = [
      /phone.*number|mobile.*number/i,
      /email.*address/i,
      /address|street.*address/i,
      /date.*of.*birth|birth.*date/i
    ]
    
    for (const pattern of confidentialPatterns) {
      if (pattern.test(dataString)) {
        return 'CONFIDENTIAL'
      }
    }

    // Check for internal data patterns
    const internalPatterns = [
      /employee.*id/i,
      /department/i,
      /manager/i,
      /internal.*note/i
    ]
    
    for (const pattern of internalPatterns) {
      if (pattern.test(dataString)) {
        return 'INTERNAL'
      }
    }

    return 'PUBLIC'
  }

  // Encryption utilities
  static generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static generateSalt(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  static hashData(data: string, salt: string): string {
    return crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha512').toString('hex')
  }

  // Compliance utilities
  static generateComplianceId(): string {
    return `comp_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  static generateAuditId(): string {
    return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  static generateIncidentId(): string {
    return `incident_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  // Session utilities
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  // File security utilities
  static validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.toLowerCase().split('.').pop()
    return allowedTypes.includes(extension || '')
  }

  static validateFileSize(fileSize: number, maxSize: number): boolean {
    return fileSize <= maxSize
  }

  static generateSecureFileName(originalName: string): string {
    const extension = originalName.split('.').pop()
    const secureName = crypto.randomBytes(16).toString('hex')
    return `${secureName}.${extension}`
  }

  // Network security utilities
  static validateIPAddress(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  static isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./
    ]
    
    return privateRanges.some(range => range.test(ip))
  }

  // Time-based security utilities
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any
      if (!decoded || !decoded.exp) return true
      
      return Date.now() >= decoded.exp * 1000
    } catch {
      return true
    }
  }

  static getTokenExpirationTime(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any
      if (!decoded || !decoded.exp) return null
      
      return new Date(decoded.exp * 1000)
    } catch {
      return null
    }
  }

  // Security headers utilities
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
  }
} 