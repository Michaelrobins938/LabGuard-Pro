// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  laboratoryName: z.string().min(1, 'Laboratory name is required'),
  phone: z.string().optional(),
  licenseNumber: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create laboratory and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create laboratory
      const laboratory = await tx.laboratory.create({
        data: {
          name: validatedData.laboratoryName,
          phone: validatedData.phone,
          licenseNumber: validatedData.licenseNumber,
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            language: 'en'
          }
        }
      })

      // Create admin user
      const user = await tx.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          name: validatedData.name,
          hashedPassword,
          role: 'ADMIN',
          laboratoryId: laboratory.id
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          laboratoryId: true
        }
      })

      return { user, laboratory }
    })

    return NextResponse.json({
      message: 'Account created successfully',
      user: result.user
    }, { status: 201 })

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

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
} 