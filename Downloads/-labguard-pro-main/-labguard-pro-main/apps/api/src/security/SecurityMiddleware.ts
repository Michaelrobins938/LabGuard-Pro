import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@labguard/database'
import { AuditLogger } from './AuditLogger'
import { DataLossPrevention } from './DataLossPrevention'
import { MFAService } from './MFAService'
import { EncryptionService } from './EncryptionService'

export interface SecurityContext {
  userId: string
  laboratoryId: string
  userRole: string
  sessionId: string
  requestId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export class SecurityMiddleware {
  private prisma: PrismaClient
  private auditLogger: AuditLogger
  private dlp: DataLossPrevention
  private mfaService: MFAService

  constructor() {
    this.prisma = new PrismaClient()
    this.auditLogger = new AuditLogger()
    this.dlp = new DataLossPrevention()
    this.mfaService = new MFAService()
  }

  // Main security middleware
  async securityMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Generate request ID for tracking
      const requestId = this.generateRequestId()
      req.headers['x-request-id'] = requestId
      
      // Extract security context
      const securityContext = this.extractSecurityContext(req)
      
      // Rate limiting check
      await this.checkRateLimit(securityContext)
      
      // Threat detection
      const threats = await this.detectThreats(securityContext, req)
      if (threats.length > 0) {
        await this.handleThreats(threats, req, res)
        return
      }
      
      // Authentication verification
      const authResult = await this.verifyAuthentication(securityContext, req)
      if (!authResult.authenticated) {
        await this.handleAuthenticationFailure(authResult, req, res)
        return
      }
      
      // Authorization check
      const authzResult = await this.verifyAuthorization(securityContext, req)
      if (!authzResult.authorized) {
        await this.handleAuthorizationFailure(authzResult, req, res)
        return
      }
      
      // MFA verification if required
      if (authResult.requiresMFA) {
        const mfaResult = await this.verifyMFA(securityContext, req)
        if (!mfaResult.verified) {
          await this.handleMFAFailure(mfaResult, req, res)
          return
        }
      }
      
      // Data loss prevention check
      await this.performDLPCheck(securityContext, req)
      
      // Add security context to request
      req.securityContext = securityContext
      
      // Log successful request
      await this.logSuccessfulRequest(securityContext, req, startTime)
      
      next()
    } catch (error) {
      await this.handleSecurityError(error, req, res)
    }
  }

  // Authentication middleware
  async authenticationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = this.extractToken(req)
      
      if (!token) {
        res.status(401).json({ error: 'Authentication token required' })
        return
      }
      
      const user = await this.verifyToken(token)
      if (!user) {
        res.status(401).json({ error: 'Invalid authentication token' })
        return
      }
      
      req.user = user
      next()
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' })
    }
  }

  // Authorization middleware
  async authorizationMiddleware(requiredRoles: string[]): Promise<(req: Request, res: Response, next: NextFunction) => Promise<void>> {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = req.user
        if (!user) {
          res.status(401).json({ error: 'User not authenticated' })
          return
        }
        
        if (!requiredRoles.includes(user.role)) {
          res.status(403).json({ error: 'Insufficient permissions' })
          return
        }
        
        next()
      } catch (error) {
        res.status(403).json({ error: 'Authorization failed' })
      }
    }
  }

  // MFA middleware
  async mfaMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }
      
      const mfaToken = req.headers['x-mfa-token'] as string
      if (!mfaToken) {
        res.status(401).json({ error: 'MFA token required' })
        return
      }
      
      const isValid = await this.mfaService.verifyTOTP(user.id, mfaToken, req)
      if (!isValid) {
        res.status(401).json({ error: 'Invalid MFA token' })
        return
      }
      
      next()
    } catch (error) {
      res.status(401).json({ error: 'MFA verification failed' })
    }
  }

  // Data sanitization middleware
  async sanitizationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Sanitize request body
      if (req.body) {
        req.body = this.sanitizeData(req.body)
      }
      
      // Sanitize query parameters
      if (req.query) {
        req.query = this.sanitizeData(req.query)
      }
      
      // Sanitize headers
      req.headers = this.sanitizeHeaders(req.headers)
      
      next()
    } catch (error) {
      res.status(400).json({ error: 'Data sanitization failed' })
    }
  }

  // CORS security middleware
  corsSecurityMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    next()
  }

  // Helper methods
  private extractSecurityContext(req: Request): SecurityContext {
    return {
      userId: req.user?.id || 'anonymous',
      laboratoryId: req.user?.laboratoryId || 'unknown',
      userRole: req.user?.role || 'anonymous',
      sessionId: req.session?.id || 'unknown',
      requestId: req.headers['x-request-id'] as string || this.generateRequestId(),
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date()
    }
  }

  private async checkRateLimit(context: SecurityContext): Promise<void> {
    const key = `rate_limit:${context.ipAddress}`
    const limit = 100 // requests per minute
    const window = 60 * 1000 // 1 minute
    
    // Check current rate
    const current = await this.getRateLimitCount(key)
    if (current >= limit) {
      throw new Error('Rate limit exceeded')
    }
    
    // Increment rate limit counter
    await this.incrementRateLimit(key, window)
  }

  private async detectThreats(context: SecurityContext, req: Request): Promise<any[]> {
    const threats: any[] = []
    
    // Check for suspicious IP patterns
    if (this.isSuspiciousIP(context.ipAddress)) {
      threats.push({
        type: 'SUSPICIOUS_IP',
        severity: 'MEDIUM',
        description: `Suspicious IP address: ${context.ipAddress}`
      })
    }
    
    // Check for suspicious user agent
    if (this.isSuspiciousUserAgent(context.userAgent)) {
      threats.push({
        type: 'SUSPICIOUS_USER_AGENT',
        severity: 'LOW',
        description: `Suspicious user agent: ${context.userAgent}`
      })
    }
    
    // Check for unusual request patterns
    if (this.isUnusualRequestPattern(req)) {
      threats.push({
        type: 'UNUSUAL_REQUEST_PATTERN',
        severity: 'MEDIUM',
        description: 'Unusual request pattern detected'
      })
    }
    
    return threats
  }

  private async verifyAuthentication(context: SecurityContext, req: Request): Promise<{
    authenticated: boolean
    requiresMFA: boolean
    user?: any
  }> {
    const token = this.extractToken(req)
    
    if (!token) {
      return { authenticated: false, requiresMFA: false }
    }
    
    const user = await this.verifyToken(token)
    if (!user) {
      return { authenticated: false, requiresMFA: false }
    }
    
    // Check if MFA is required
    const requiresMFA = user.mfaEnabled && !user.mfaSetupComplete
    
    return {
      authenticated: true,
      requiresMFA,
      user
    }
  }

  private async verifyAuthorization(context: SecurityContext, req: Request): Promise<{
    authorized: boolean
    reason?: string
  }> {
    const user = req.user
    if (!user) {
      return { authorized: false, reason: 'User not authenticated' }
    }
    
    // Check resource access permissions
    const resource = req.path
    const action = req.method
    
    const hasPermission = await this.checkResourcePermission(user, resource, action)
    if (!hasPermission) {
      return { authorized: false, reason: 'Insufficient permissions' }
    }
    
    return { authorized: true }
  }

  private async verifyMFA(context: SecurityContext, req: Request): Promise<{
    verified: boolean
    reason?: string
  }> {
    const mfaToken = req.headers['x-mfa-token'] as string
    
    if (!mfaToken) {
      return { verified: false, reason: 'MFA token required' }
    }
    
    const isValid = await this.mfaService.verifyTOTP(context.userId, mfaToken, req)
    
    return {
      verified: isValid,
      reason: isValid ? undefined : 'Invalid MFA token'
    }
  }

  private async performDLPCheck(context: SecurityContext, req: Request): Promise<void> {
    // Monitor data access
    await this.dlp.monitorDataAccess(
      context.userId,
      context.laboratoryId,
      req.path,
      req.method,
      req.body,
      req
    )
    
    // Monitor API usage
    await this.dlp.monitorAPIUsage(
      context.userId,
      context.laboratoryId,
      req.path,
      req,
      {} as Response
    )
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }

  private async verifyToken(token: string): Promise<any | null> {
    try {
      // Implement JWT verification logic
      // This is a placeholder - implement actual JWT verification
      return { id: 'user-id', role: 'USER', laboratoryId: 'lab-id' }
    } catch (error) {
      return null
    }
  }

  private async checkResourcePermission(user: any, resource: string, action: string): Promise<boolean> {
    // Implement resource permission checking logic
    // This is a placeholder - implement actual permission checking
    return true
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data)
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item))
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value)
      }
      return sanitized
    }
    
    return data
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  private isSuspiciousIP(ip: string): boolean {
    // Implement IP reputation checking
    const suspiciousPatterns = [
      /^0\.0\.0\.0$/,
      /^127\.0\.0\.1$/,
      /^10\./,
      /^192\.168\./
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(ip))
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent))
  }

  private isUnusualRequestPattern(req: Request): boolean {
    // Check for unusual request patterns
    const unusualPatterns = [
      req.path.includes('admin') && req.method !== 'GET',
      req.path.includes('system') && req.method !== 'GET',
      req.path.includes('security') && req.method !== 'GET'
    ]
    
    return unusualPatterns.some(pattern => pattern)
  }

  private getClientIP(req: Request): string {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           (req.connection as any).socket?.remoteAddress || 
           req.headers['x-forwarded-for'] as string || 
           'unknown'
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async getRateLimitCount(key: string): Promise<number> {
    // Implement Redis-based rate limiting
    return 0 // Placeholder
  }

  private async incrementRateLimit(key: string, window: number): Promise<void> {
    // Implement Redis-based rate limiting
  }

  private async handleThreats(threats: any[], req: Request, res: Response): Promise<void> {
    const criticalThreats = threats.filter(t => t.severity === 'CRITICAL')
    
    if (criticalThreats.length > 0) {
      res.status(403).json({ error: 'Access denied due to security threats' })
      return
    }
    
    // Log threats but allow request to continue
    for (const threat of threats) {
      console.log(`Security threat detected: ${threat.description}`)
    }
  }

  private async handleAuthenticationFailure(result: any, req: Request, res: Response): Promise<void> {
    res.status(401).json({ error: 'Authentication failed' })
  }

  private async handleAuthorizationFailure(result: any, req: Request, res: Response): Promise<void> {
    res.status(403).json({ error: 'Authorization failed' })
  }

  private async handleMFAFailure(result: any, req: Request, res: Response): Promise<void> {
    res.status(401).json({ error: 'MFA verification failed' })
  }

  private async handleSecurityError(error: any, req: Request, res: Response): Promise<void> {
    console.error('Security error:', error)
    res.status(500).json({ error: 'Security processing failed' })
  }

  private async logSuccessfulRequest(context: SecurityContext, req: Request, startTime: number): Promise<void> {
    const duration = Date.now() - startTime
    
    await this.auditLogger.logDataAccessEvent(
      context.userId,
      context.laboratoryId,
      'API',
      req.path,
      req.method as any,
      req,
      {
        duration,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress
      }
    )
  }
} 