import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface TestResponse {
  success: boolean
  message: string
  timestamp: string
  data?: any
}

export async function GET(request: NextRequest) {
  try {
    const response: TestResponse = {
      success: true,
      message: 'Test endpoint is working',
      timestamp: new Date().toISOString(),
      data: {
        environment: process.env.NODE_ENV,
        version: '1.0.0'
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorResponse: TestResponse = {
      success: false,
      message: 'Test endpoint failed',
      timestamp: new Date().toISOString(),
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 