// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthUser(request);
    
    if (authResult.success) {
      console.log('✅ User logged out:', authResult.user?.email);
    }

    // Since we're using stateless JWT, logout is handled client-side
    // by removing the token from localStorage
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 