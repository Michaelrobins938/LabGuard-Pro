import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthService } from '@/lib/auth-service'

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = verifyEmailSchema.parse(body)

    // Verify email
    await AuthService.verifyEmail(validatedData.token)

    return NextResponse.json({
      message: 'Email verified successfully. You can now log in to your account.'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 