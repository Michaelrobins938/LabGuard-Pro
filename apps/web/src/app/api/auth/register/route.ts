import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Enhanced backend fetch with detailed error handling
async function backendFetch(path: string, init?: RequestInit) {
  const base = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
  const url = path.startsWith('http') ? path : `${base}${path}`
  
  console.log('🔗 Backend fetch details:', {
    base,
    path,
    fullUrl: url,
    method: init?.method || 'GET',
    hasBody: !!init?.body
  })

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(init?.headers || {})
      },
      cache: 'no-store'
    })

    console.log('📡 Backend response:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    })

    return res
  } catch (error) {
    console.error('❌ Backend fetch error:', error)
    throw error
  }
}

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().optional(),
  laboratoryName: z.string().min(1, 'Laboratory name is required').max(100),
  laboratoryType: z.enum(['clinical', 'research', 'industrial', 'academic']).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']).optional()
})

export async function POST(request: NextRequest) {
  console.log('🚀 Registration API route called')
  
  // Log environment variables for debugging
  console.log('🔧 Environment variables:', {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV
  })

  try {
    // Parse request body
    const body = await request.json()
    console.log('📝 Registration request body:', body)
    
    // Validate input data
    const validatedData = registerSchema.parse(body)
    console.log('✅ Data validation passed:', validatedData)

    // Password confirmation check
    if (validatedData.confirmPassword && validatedData.password !== validatedData.confirmPassword) {
      console.log('❌ Password mismatch')
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    // Transform data for backend
    const backendPayload = {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role || 'USER'
    }

    console.log('📤 Backend payload:', backendPayload)

    // Call backend API
    const res = await backendFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendPayload)
    })

    // Handle backend response
    if (!res.ok) {
      const errorText = await res.text()
      console.error('❌ Backend error response:', {
        status: res.status,
        statusText: res.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        { 
          error: 'Backend registration failed',
          details: errorText,
          status: res.status
        },
        { 
          status: res.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    // Parse successful response
    const data = await res.json()
    console.log('✅ Registration successful:', data)
    
    return NextResponse.json(data, { 
      status: res.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('💥 Registration error:', error)
    
    if (error instanceof z.ZodError) {
      console.log('❌ Validation error:', error.errors)
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 