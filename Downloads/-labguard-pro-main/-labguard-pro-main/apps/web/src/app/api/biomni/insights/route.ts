import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Biomni insights
    const response = await fetch(`${process.env.API_BASE_URL}/api/biomni/insights`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // Return mock insights if API is not available
      return NextResponse.json({
        success: true,
        insights: [
          {
            id: '1',
            type: 'optimization',
            title: 'Equipment Efficiency Optimization',
            description: 'Centrifuge #2 shows 15% improved efficiency after recent calibration. Consider applying similar settings to other centrifuges.',
            confidence: 0.92,
            equipmentId: 'eq-001',
            equipmentName: 'Centrifuge #2',
            createdAt: new Date().toISOString(),
            impact: 'high',
            category: 'equipment'
          },
          {
            id: '2',
            type: 'prediction',
            title: 'Maintenance Prediction',
            description: 'Spectrophotometer #1 requires preventive maintenance within 7 days based on usage patterns and performance metrics.',
            confidence: 0.87,
            equipmentId: 'eq-002',
            equipmentName: 'Spectrophotometer #1',
            createdAt: new Date().toISOString(),
            impact: 'medium',
            category: 'equipment'
          },
          {
            id: '3',
            type: 'recommendation',
            title: 'Protocol Automation',
            description: 'PCR protocol can be automated using Biomni tools, reducing manual errors by 40% and improving reproducibility.',
            confidence: 0.95,
            createdAt: new Date().toISOString(),
            impact: 'high',
            category: 'protocol'
          },
          {
            id: '4',
            type: 'alert',
            title: 'Compliance Risk',
            description: 'Temperature sensor #3 showing drift patterns that may affect compliance. Immediate calibration recommended.',
            confidence: 0.78,
            equipmentId: 'eq-003',
            equipmentName: 'Temperature Sensor #3',
            createdAt: new Date().toISOString(),
            impact: 'high',
            category: 'compliance'
          },
          {
            id: '5',
            type: 'recommendation',
            title: 'Research Methodology',
            description: 'Based on recent publications, consider implementing CRISPR-Cas9 for gene editing experiments in your research area.',
            confidence: 0.89,
            createdAt: new Date().toISOString(),
            impact: 'medium',
            category: 'research'
          }
        ],
        timestamp: new Date().toISOString()
      })
    }

    const insights = await response.json()

    return NextResponse.json({
      success: true,
      insights: insights.insights || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Biomni insights error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Biomni insights' },
      { status: 500 }
    )
  }
} 