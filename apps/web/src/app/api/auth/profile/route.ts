// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For immediate Vercel deployment, use mock data
    // TODO: Replace with real database when DATABASE_URL is configured
    const mockUser = {
      id: 'user_123',
      email: 'demo@labguard.com',
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
    };

    console.log('✅ Profile fetched successfully for:', mockUser.email);

    return NextResponse.json({
      success: true,
      user: mockUser
    });

  } catch (error) {
    console.error('❌ Profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 