import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/analytics/enterprise/performance?timeRange=${timeRange}`, {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying enterprise performance request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enterprise performance data' },
      { status: 500 }
    )
  }
} 