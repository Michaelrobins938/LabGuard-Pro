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
    const { researchArea, hypothesis, query } = body

    // Get research insights using Biomni
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/research-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        researchArea,
        hypothesis,
        query
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate research insights')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      insights: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Research insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate research insights' },
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

    // Get research project history
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/research-projects`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch research projects')
    }

    const projects = await response.json()

    return NextResponse.json({
      success: true,
      projects,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Research projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research projects' },
      { status: 500 }
    )
  }
} 