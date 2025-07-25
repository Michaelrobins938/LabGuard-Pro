// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { generateToken } from '@/lib/auth';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  laboratoryName: z.string().min(1, 'Laboratory name is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']).default('ADMIN')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔄 Registration attempt for:', body.email);
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password, firstName, lastName, laboratoryName, role } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create laboratory and user in transaction
    console.log('🏗️ Creating laboratory and user...');
    const result = await prisma.$transaction(async (tx) => {
      // Create laboratory
      const laboratory = await tx.laboratory.create({
        data: {
          name: laboratoryName,
          email: email.toLowerCase(),
          planType: 'starter',
          subscriptionStatus: 'trial',
        }
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: role as any,
          laboratoryId: laboratory.id,
        }
      });

      return { user, laboratory };
    });

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      laboratoryId: result.laboratory.id,
      role: result.user.role,
      email: result.user.email
    });

    console.log('✅ User registered successfully:', result.user.email);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        laboratoryId: result.user.laboratoryId,
        laboratory: {
          id: result.laboratory.id,
          name: result.laboratory.name,
          planType: result.laboratory.planType
        }
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 