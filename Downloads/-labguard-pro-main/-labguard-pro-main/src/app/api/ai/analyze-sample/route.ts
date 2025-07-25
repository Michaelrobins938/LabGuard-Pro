import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData } = body

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Simulate AI analysis
    const results = await AIService.analyzeSample(imageData)

    return NextResponse.json({
      success: true,
      results,
      analysisTime: new Date().toISOString()
    })

  } catch (error) {
    console.error('Sample analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
} 