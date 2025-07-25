import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Biomni capabilities
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/capabilities`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Biomni capabilities')
    }

    const capabilities = await response.json()

    return NextResponse.json({
      success: true,
      capabilities,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Biomni capabilities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Biomni capabilities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { query, tools, databases, category } = body

    // Execute Biomni query
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        tools,
        databases,
        category
      })
    })

    if (!response.ok) {
      throw new Error('Failed to execute Biomni query')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Biomni query error:', error)
    return NextResponse.json(
      { error: 'Failed to execute Biomni query' },
      { status: 500 }
    )
  }
} 