// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9)
  const startTime = Date.now()
  
  console.log(`🚀 [${requestId}] Registration request started`)
  
  try {
    // Get backend URL from environment
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL
    
    if (!backendUrl) {
      console.error(`❌ [${requestId}] Backend URL not configured`)
      return NextResponse.json(
        { 
          error: 'Backend configuration error',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    console.log(`📤 [${requestId}] Proxying to backend: ${backendUrl}/api/auth/register`)

    // Get the request body
    const body = await request.json()
    console.log(`📝 [${requestId}] Registration data:`, {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      laboratoryName: body.laboratoryName,
      hasPassword: !!body.password
    })

    // Transform frontend data to backend format
    const backendData = {
      email: body.email,
      password: body.password,
      name: `${body.firstName || ''} ${body.lastName || ''}`.trim() || body.name || 'User',
      role: body.role || 'USER',
      laboratoryId: body.laboratoryId || null
    }

    console.log(`🔄 [${requestId}] Transformed data for backend:`, {
      email: backendData.email,
      name: backendData.name,
      role: backendData.role
    })

    // Forward request to backend
    const backendResponse = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LabGuard-Pro-Frontend/1.0',
        'X-Request-ID': requestId,
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        'X-Forwarded-Host': request.headers.get('host') || 'unknown'
      },
      body: JSON.stringify(backendData)
    })

    const responseTime = Date.now() - startTime
    console.log(`⏱️ [${requestId}] Backend response time: ${responseTime}ms`)

    // Get response data
    const responseData = await backendResponse.json()
    
    console.log(`📥 [${requestId}] Backend response:`, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      hasData: !!responseData,
      success: backendResponse.ok
    })

    // Return the backend response with appropriate status
    return NextResponse.json(
      responseData,
      { 
        status: backendResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Request-ID': requestId,
          'X-Response-Time': `${responseTime}ms`,
          'X-Backend-Status': backendResponse.status.toString()
        }
      }
    )

  } catch (error) {
    const responseTime = Date.now() - startTime
    
    console.error(`❌ [${requestId}] Registration proxy error:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`
    })

    return NextResponse.json(
      { 
        error: 'Failed to connect to backend service',
        details: error instanceof Error ? error.message : 'Unknown error',
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