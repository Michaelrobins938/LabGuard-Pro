import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 Test endpoint called')
  
  const envInfo = {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV
  }
  
  console.log('🔧 Environment variables:', envInfo)
  
  // Test backend connectivity
  let backendTest = null
  try {
    const base = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
    const testUrl = `${base}/health`
    
    console.log('🔗 Testing backend connectivity to:', testUrl)
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    })
    
    backendTest = {
      url: testUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      body: await response.text().catch(() => 'Could not read response body')
    }
    
    console.log('📡 Backend test result:', backendTest)
    
  } catch (error) {
    backendTest = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }
    console.error('❌ Backend test failed:', backendTest)
  }
  
  return NextResponse.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    environment: envInfo,
    backendTest,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
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