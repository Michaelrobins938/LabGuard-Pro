import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Enterprise-level backend fetch with retry logic and comprehensive error handling
async function backendFetch(path: string, init?: RequestInit, retries = 3): Promise<Response> {
  const base = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
  const url = path.startsWith('http') ? path : `${base}${path}`
  
  const requestId = Math.random().toString(36).substr(2, 9)
  
  console.log(`🔗 [${requestId}] Backend fetch attempt:`, {
    base,
    path,
    fullUrl: url,
    method: init?.method || 'GET',
    hasBody: !!init?.body,
    retriesLeft: retries
  })

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const startTime = Date.now()
      
      const response = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Request-ID': requestId,
          'User-Agent': 'LabGuard-Pro-Frontend/1.0',
          ...(init?.headers || {})
        },
        cache: 'no-store'
      })
      
      const responseTime = Date.now() - startTime
      
      console.log(`🔗 [${requestId}] Backend response (attempt ${attempt}):`, {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries())
      })

      // If successful, return immediately
      if (response.ok) {
        return response
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        console.log(`🔗 [${requestId}] Client error, not retrying:`, response.status)
        return response
      }

      // If it's a server error (5xx) and we have retries left, wait and retry
      if (response.status >= 500 && attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff
        console.log(`🔗 [${requestId}] Server error, retrying in ${waitTime}ms (attempt ${attempt}/${retries})`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }

      return response
    } catch (error) {
      console.error(`🔗 [${requestId}] Network error (attempt ${attempt}):`, error)
      
      if (attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`🔗 [${requestId}] Retrying in ${waitTime}ms (attempt ${attempt}/${retries})`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
      
      throw error
    }
  }
  
  throw new Error(`Failed after ${retries} attempts`)
}

// Enhanced registration schema with comprehensive validation
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must be less than 128 characters'),
  confirmPassword: z.string().optional(),
  laboratoryName: z.string().min(1, 'Laboratory name is required').max(100, 'Laboratory name must be less than 100 characters'),
  laboratoryType: z.enum(['clinical', 'research', 'industrial', 'academic']).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']).optional()
}).refine(data => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9)
  const startTime = Date.now()
  
  console.log(`🚀 [${requestId}] Registration request started`)
  
  try {
    // Parse and validate request body
    const body = await request.json()
    console.log(`📝 [${requestId}] Registration attempt:`, {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      laboratoryName: body.laboratoryName,
      hasPassword: !!body.password,
      hasConfirmPassword: !!body.confirmPassword
    })

    const validatedData = registerSchema.parse(body)

    // Validate password confirmation if provided
    if (validatedData.confirmPassword && validatedData.password !== validatedData.confirmPassword) {
      console.log(`❌ [${requestId}] Password mismatch`)
      return NextResponse.json(
        { 
          error: 'Passwords do not match',
          requestId,
          timestamp: new Date().toISOString()
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'X-Request-ID': requestId
          }
        }
      )
    }

    // Transform data format to match backend expectations
    const backendPayload = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role || 'USER'
    }

    console.log(`📤 [${requestId}] Backend payload:`, {
      firstName: backendPayload.firstName,
      lastName: backendPayload.lastName,
      email: backendPayload.email,
      role: backendPayload.role,
      hasPassword: !!backendPayload.password
    })

    // Call backend with retry logic
    const res = await backendFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendPayload)
    }, 3)

    const responseData = await res.json()
    const responseTime = Date.now() - startTime

    console.log(`✅ [${requestId}] Registration successful:`, {
      status: res.status,
      responseTime: `${responseTime}ms`,
      hasUser: !!responseData.user,
      hasToken: !!responseData.token
    })

    return NextResponse.json(responseData, { 
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Request-ID': requestId,
        'X-Response-Time': `${responseTime}ms`
      }
    })

  } catch (error) {
    const responseTime = Date.now() - startTime
    
    console.error(`❌ [${requestId}] Registration error:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors,
          requestId,
          timestamp: new Date().toISOString()
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'X-Request-ID': requestId
          }
        }
      )
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Backend service unavailable. Please try again later.',
          requestId,
          timestamp: new Date().toISOString()
        },
        { 
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'X-Request-ID': requestId
          }
        }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        requestId,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Request-ID': requestId
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
} 