import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/equipment/${params.id}/labels/print`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Failed to print labels')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error printing labels:', error)
    return NextResponse.json(
      { error: 'Failed to print labels' },
      { status: 500 }
    )
  }
} 