import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/equipment/${params.id}/maintenance`, {
      headers: {
        'Authorization': token || ''
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance data')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching equipment maintenance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance data' },
      { status: 500 }
    )
  }
} 