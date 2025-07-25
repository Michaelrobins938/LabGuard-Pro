import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/api-management/keys`, {
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
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const body = await request.json()
    
    const response = await fetch(`${API_BASE_URL}/api/api-management/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
} 