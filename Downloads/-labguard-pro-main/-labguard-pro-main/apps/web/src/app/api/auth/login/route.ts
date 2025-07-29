import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '../../../../lib/backend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await backendFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 