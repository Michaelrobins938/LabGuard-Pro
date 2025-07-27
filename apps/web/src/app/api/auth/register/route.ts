import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { backendFetch } from '../../../../lib/backend'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  laboratoryName: z.string().min(1, 'Laboratory name is required').max(100),
  laboratoryType: z.enum(['clinical', 'research', 'industrial', 'academic']).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Registration attempt:', body)
    
    const validatedData = registerSchema.parse(body)

    // Validate password confirmation
    if (validatedData.password !== validatedData.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    const res = await backendFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(validatedData)
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 