import { NextResponse } from 'next/server'
import { AIService } from '@/lib/ai.service'

export async function GET() {
  try {
    // Get AI insights
    const insights = await AIService.getInsights()

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
} 