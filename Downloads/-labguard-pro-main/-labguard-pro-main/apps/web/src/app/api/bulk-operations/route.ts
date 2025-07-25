import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/bulk-operations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      }
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching bulk operations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bulk operations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const formData = await request.formData()
    
    const response = await fetch(`${API_BASE_URL}/api/bulk-operations`, {
      method: 'POST',
      headers: {
        'Authorization': token || ''
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating bulk operation:', error)
    return NextResponse.json(
      { error: 'Failed to create bulk operation' },
      { status: 500 }
    )
  }
} 