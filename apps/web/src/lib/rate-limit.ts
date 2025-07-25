import { NextRequest, NextResponse } from 'next/server'

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Cleanup expired entries periodically
    setInterval(() => {
      this.cleanup();
    }, 60000); // Every minute
  }

  // Make config public to fix the private access error
  public getConfig() {
    return this.config;
  }

  async limit(req: Request): Promise<{ allowed: boolean; limit: number; remaining: number; reset: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    
    let entry = this.store.get(key);
    
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
      this.store.set(key, entry);
    }
    
    entry.count++;
    
    const allowed = entry.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    
    return {
      allowed,
      limit: this.config.maxRequests,
      remaining,
      reset: entry.resetTime
    };
  }

  private getDefaultKey(req: Request): string {
    // Try to get IP from various headers
    const forwarded = req.headers.get('x-forwarded-for');
    const real = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || real || 'unknown';
    
    return `ratelimit:${ip}`;
  }

  private cleanup() {
    const now = Date.now();
    
    // Convert to array first to avoid iteration issues
    const entries = Array.from(this.store.entries());
    for (const [key, value] of entries) {
      if (value.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  public reset(key?: string) {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }

  public getStats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    };
  }
}

// Fix the iteration issue
export function cleanupRateLimitStore() {
  const rateLimitStore = new Map();
  const currentTime = Date.now();
  
  // Convert to array first to avoid iteration issues
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, value] of entries) {
    if (value.resetTime < currentTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Fix the limiter usage
export function applyRateLimit(limiter: RateLimiter, request: Request, response: Response) {
  const config = limiter.getConfig();
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
}

// Middleware function
export async function rateLimitMiddleware(
  req: Request,
  limiter: RateLimiter
): Promise<Response | null> {
  const result = await limiter.limit(req);
  
  if (!result.allowed) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.reset).toISOString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
      }
    });
  }
  
  return null; // Allow request to proceed
}

// Create rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000 // 15 minutes
});

export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000 // 15 minutes
});

export const uploadRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000 // 1 hour
});

// Export aiRateLimiter (was missing)
export const aiRateLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60 * 1000 // 1 minute
});

// Export withRateLimit function for Next.js routes
export async function withRateLimit(
  req: Request,
  limiter: RateLimiter,
  handler: () => Promise<Response>
): Promise<Response> {
  const result = await limiter.limit(req);
  
  if (!result.allowed) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.reset).toISOString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
      }
    });
  }
  
  // Add rate limit headers to response
  const response = await handler();
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());
  
  return response;
} 