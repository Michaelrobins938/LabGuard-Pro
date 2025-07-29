import { Request, Response, NextFunction } from 'express'
import { SecurityMiddleware } from '../security/SecurityMiddleware'
import { SecurityConfigManager } from '../security/SecurityConfig'
import { SecurityUtils } from '../security/SecurityUtils'

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: any
}

export class SecurityMiddlewareManager {
  private securityMiddleware: SecurityMiddleware
  private configManager: SecurityConfigManager

  constructor() {
    this.securityMiddleware = new SecurityMiddleware()
    this.configManager = SecurityConfigManager.getInstance()
  }

  // Main security middleware
  async mainSecurityMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Add security headers
      this.addSecurityHeaders(res)

      // Apply rate limiting if enabled
      if (this.configManager.isFeatureEnabled('monitoring')) {
        await this.applyRateLimiting(req, res)
      }

      // Apply threat detection if enabled
      if (this.configManager.isFeatureEnabled('dlp')) {
        await this.detectThreats(req, res)
      }

      // Apply authentication if required
      if (this.requiresAuthentication(req)) {
        await this.authenticateRequest(req, res)
      }

      // Apply authorization if required
      if (this.requiresAuthorization(req)) {
        await this.authorizeRequest(req, res)
      }

      // Apply data sanitization
      await this.sanitizeRequest(req)

      // Apply DLP monitoring
      if (this.configManager.isFeatureEnabled('dlp')) {
        await this.monitorDataAccess(req, res)
      }

      next()
    } catch (error) {
      this.handleSecurityError(error, req, res)
    }
  }

  // Authentication middleware
  async authenticationMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityMiddleware.authenticationMiddleware(req, res, next)
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' })
    }
  }

  // Authorization middleware
  authorizationMiddleware(requiredRoles: string[]) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const middleware = await this.securityMiddleware.authorizationMiddleware(requiredRoles)
        await middleware(req, res, next)
      } catch (error) {
        res.status(403).json({ error: 'Authorization failed' })
      }
    }
  }

  // MFA middleware
  async mfaMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityMiddleware.mfaMiddleware(req, res, next)
    } catch (error) {
      res.status(401).json({ error: 'MFA verification failed' })
    }
  }

  // Data sanitization middleware
  async sanitizationMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.securityMiddleware.sanitizationMiddleware(req, res, next)
    } catch (error) {
      res.status(400).json({ error: 'Data sanitization failed' })
    }
  }

  // CORS security middleware
  corsSecurityMiddleware(req: Request, res: Response, next: NextFunction): void {
    this.securityMiddleware.corsSecurityMiddleware(req, res, next)
  }

  // Helper methods
  private addSecurityHeaders(res: Response): void {
    const headers = SecurityUtils.getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })
  }

  private async applyRateLimiting(req: Request, res: Response): Promise<void> {
    const clientIP = this.getClientIP(req)
    const endpoint = req.path
    const key = SecurityUtils.generateRateLimitKey(clientIP, endpoint)
    
    // Check rate limit (implementation would use Redis)
    const isRateLimited = false // Placeholder for actual rate limiting logic
    
    if (isRateLimited) {
      res.status(429).json({ error: 'Rate limit exceeded' })
      return
    }
  }

  private async detectThreats(req: Request, res: Response): Promise<void> {
    const userAgent = req.get('User-Agent') || 'unknown'
    const clientIP = this.getClientIP(req)
    
    const threatAnalysis = SecurityUtils.detectSuspiciousActivity(userAgent, clientIP)
    
    if (threatAnalysis.suspicious) {
      // Log threat detection
      console.warn('Threat detected:', threatAnalysis.reasons)
      
      // For critical threats, block the request
      if (threatAnalysis.reasons.some(reason => reason.includes('critical'))) {
        res.status(403).json({ error: 'Access denied due to security threat' })
        return
      }
    }
  }

  private requiresAuthentication(req: Request): boolean {
    // Skip authentication for public endpoints
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/health',
      '/api/docs'
    ]
    
    return !publicEndpoints.includes(req.path)
  }

  private requiresAuthorization(req: Request): boolean {
    // Require authorization for sensitive endpoints
    const sensitiveEndpoints = [
      '/api/admin',
      '/api/security',
      '/api/compliance',
      '/api/billing'
    ]
    
    return sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint))
  }

  private async authenticateRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    const token = this.extractToken(req)
    
    if (!token) {
      res.status(401).json({ error: 'Authentication token required' })
      return
    }
    
    const user = SecurityUtils.verifyToken(token)
    if (!user) {
      res.status(401).json({ error: 'Invalid authentication token' })
      return
    }
    
    req.user = user
  }

  private async authorizeRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = req.user
    if (!user) {
      res.status(401).json({ error: 'User not authenticated' })
      return
    }
    
    // Check if user has required role for the endpoint
    const requiredRole = this.getRequiredRole(req.path)
    if (requiredRole && user.role !== requiredRole) {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }
  }

  private async sanitizeRequest(req: Request): Promise<void> {
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
  }

  private async monitorDataAccess(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = req.user
    if (!user) return
    
    // Monitor data access for DLP violations
    const dataClassification = SecurityUtils.classifyData(req.body)
    
    if (dataClassification === 'RESTRICTED' || dataClassification === 'CONFIDENTIAL') {
      // Log sensitive data access
      console.log(`Sensitive data access by user ${user.id}: ${req.path}`)
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }

  private getClientIP(req: Request): string {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           (req.connection as any).socket?.remoteAddress || 
           req.headers['x-forwarded-for'] as string || 
           'unknown'
  }

  private getRequiredRole(path: string): string | null {
    if (path.startsWith('/api/admin')) return 'ADMIN'
    if (path.startsWith('/api/security')) return 'ADMIN'
    if (path.startsWith('/api/compliance')) return 'SUPERVISOR'
    if (path.startsWith('/api/billing')) return 'ADMIN'
    return null
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return SecurityUtils.sanitizeInput(data)
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

  private sanitizeHeaders(headers: any): any {
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityUtils.sanitizeInput(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  private handleSecurityError(error: any, req: Request, res: Response): void {
    console.error('Security error:', error)
    
    // Don't expose internal error details to client
    res.status(500).json({ 
      error: 'Security processing failed',
      requestId: req.headers['x-request-id'] || 'unknown'
    })
  }
} 