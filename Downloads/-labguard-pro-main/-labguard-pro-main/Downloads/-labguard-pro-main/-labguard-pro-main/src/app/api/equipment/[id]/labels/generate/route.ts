import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/equipment/${params.id}/labels/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Failed to generate labels')
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="equipment-labels-${params.id}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating labels:', error)
    return NextResponse.json(
      { error: 'Failed to generate labels' },
      { status: 500 }
    )
  }
} 