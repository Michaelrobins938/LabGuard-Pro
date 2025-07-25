import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'comprehensive'
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/analytics/enterprise/export?type=${type}&timeRange=${timeRange}`, {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="enterprise-analytics-${type}-${timeRange}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error proxying enterprise export request:', error)
    return NextResponse.json(
      { error: 'Failed to export enterprise analytics report' },
      { status: 500 }
    )
  }
} 