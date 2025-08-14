import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

export class NetworkSecurityService {
  
  // Advanced rate limiting
  static createRateLimiters() {
    const loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
      message: 'Too many login attempts, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        // Log rate limit violation
        this.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.path
        })
        
        const reset = (req as any).rateLimit?.resetTime
        res.status(429).json({
          error: 'Too many attempts',
          retryAfter: reset ? Math.round(Number(reset) / 1000) : undefined
        })
      }
    })

    const apiLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests per minute
      message: 'API rate limit exceeded'
    })

    const sensitiveOperationsLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // 10 sensitive operations per hour
      message: 'Sensitive operation rate limit exceeded'
    })

    return { loginLimiter, apiLimiter, sensitiveOperationsLimiter }
  }

  // Security headers configuration
  static configureSecurityHeaders() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.labguard.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    })
  }

  // IP allowlisting for sensitive operations
  static ipAllowlistMiddleware(allowedIPs: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const clientIP = (req.ip || (req.connection as any)?.remoteAddress || '') as string
      
      if (clientIP && !allowedIPs.includes(clientIP)) {
        this.logSecurityEvent('IP_NOT_ALLOWED', {
          ip: clientIP,
          endpoint: req.path,
          userAgent: req.get('User-Agent')
        })
        
        return res.status(403).json({
          error: 'Access denied from this IP address'
        })
      }
      
      next()
    }
  }

  // WAF-like request inspection
  static requestInspectionMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const suspiciousPatterns = [
        /(\<script\>)/gi, // XSS attempt
        /(union.*select)/gi, // SQL injection attempt
        /(\.\.\/)/gi, // Path traversal attempt
        /(\<iframe)/gi, // Iframe injection
        /(javascript:)/gi // JavaScript protocol
      ]

      const requestData = JSON.stringify({
        body: req.body,
        query: req.query,
        params: req.params
      })

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(requestData)) {
          this.logSecurityEvent('MALICIOUS_REQUEST_DETECTED', {
            ip: req.ip,
            pattern: pattern.toString(),
            requestData: requestData.substring(0, 1000) // Limit log size
          })
          
          return res.status(400).json({
            error: 'Malicious request detected'
          })
        }
      }

      next()
    }
  }

  // Session security middleware
  static sessionSecurityMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Check for secure session requirements
      const sessionAny = (req as any).session
      if (sessionAny) {
        // Ensure session is secure
        if (!req.secure && process.env.NODE_ENV === 'production') {
          return res.status(400).json({
            error: 'Secure connection required'
          })
        }
        
        // Check session timeout
        if (sessionAny.lastAccess) {
          const lastAccess = new Date(sessionAny.lastAccess as string)
          const now = new Date()
          const sessionTimeout = parseInt(process.env.SESSION_TIMEOUT || '3600') * 1000 // Default 1 hour
          
          if (now.getTime() - lastAccess.getTime() > sessionTimeout) {
            sessionAny.destroy(() => {})
            return res.status(401).json({
              error: 'Session expired'
            })
          }
        }
        
        // Update last access time
        sessionAny.lastAccess = new Date().toISOString()
      }
      
      next()
    }
  }

  private static async logSecurityEvent(eventType: string, metadata: any): Promise<void> {
    // Log to security monitoring system
    console.log(`[SECURITY] ${eventType}:`, metadata)
    
    // Send to SIEM if configured
    if (process.env.SIEM_ENDPOINT) {
      // Send security event to SIEM
    }
  }
}