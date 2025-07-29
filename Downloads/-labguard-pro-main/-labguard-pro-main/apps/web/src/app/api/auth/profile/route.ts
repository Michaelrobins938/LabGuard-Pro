// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '../../../../lib/backend';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const res = await backendFetch('/auth/profile', {
      method: 'GET',
      headers: { Authorization: authHeader }
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })

  } catch (error) {
    console.error('❌ Profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 