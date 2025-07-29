import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, equipment, requirements } = body

    // Generate protocol using Biomni
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/protocols/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        category,
        equipment,
        requirements
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate protocol')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      protocol: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Protocol generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate protocol' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get protocol history
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/protocols`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch protocols')
    }

    const protocols = await response.json()

    return NextResponse.json({
      success: true,
      protocols,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Protocols fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch protocols' },
      { status: 500 }
    )
  }
} 