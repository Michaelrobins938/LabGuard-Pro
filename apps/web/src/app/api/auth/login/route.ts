import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login attempt:', body)
    
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For immediate Vercel deployment, use mock data
    // TODO: Replace with real database when DATABASE_URL is configured
    const mockUser = {
      id: 'user_123',
      email: email,
      firstName: 'Michael',
      lastName: 'Robinson',
      role: 'ADMIN',
      laboratoryId: 'lab_123',
      laboratory: {
        id: 'lab_123',
        name: 'Demo Laboratory',
        type: 'clinical',
        planType: 'starter'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const mockToken = 'jwt_token_' + Date.now() + '_' + mockUser.id

    console.log('✅ Login successful for:', email)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: mockToken,
      user: mockUser
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 