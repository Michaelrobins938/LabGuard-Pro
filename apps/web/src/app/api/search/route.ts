import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface SearchResult {
  id: string
  type: 'equipment' | 'calibration' | 'maintenance' | 'user' | 'report' | 'document'
  title: string
  description: string
  status: string
  location?: string
  date?: string
  tags: string[]
  relevance: number
  metadata: Record<string, any>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const filters = searchParams.get('filters') ? JSON.parse(searchParams.get('filters')!) : {}
    const types = searchParams.get('types') ? JSON.parse(searchParams.get('types')!) : []
    const dateRange = searchParams.get('dateRange') ? JSON.parse(searchParams.get('dateRange')!) : {}
    const location = searchParams.get('location') || ''
    const status = searchParams.get('status') || ''

    // Mock search results
    // In production, this would search your database
    const searchResults: SearchResult[] = [
      {
        id: '1',
        type: 'equipment',
        title: 'PCR Machine',
        description: 'Thermal cycler for DNA amplification',
        status: 'active',
        location: 'Lab A',
        date: new Date().toISOString(),
        tags: ['PCR', 'DNA', 'Amplification'],
        relevance: 0.95,
        metadata: { model: 'Applied Biosystems 7500', serialNumber: 'AB7500-001' }
      },
      {
        id: '2',
        type: 'calibration',
        title: 'Centrifuge Calibration',
        description: 'Monthly calibration of laboratory centrifuge',
        status: 'completed',
        location: 'Lab B',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        tags: ['Calibration', 'Centrifuge', 'Monthly'],
        relevance: 0.87,
        metadata: { equipmentId: 'eq2', technician: 'Dr. Johnson' }
      },
      {
        id: '3',
        type: 'maintenance',
        title: 'Microscope Maintenance',
        description: 'Scheduled maintenance for research microscope',
        status: 'scheduled',
        location: 'Lab C',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tags: ['Maintenance', 'Microscope', 'Scheduled'],
        relevance: 0.82,
        metadata: { equipmentId: 'eq3', maintenanceType: 'preventive' }
      }
    ]

    // Filter results based on search parameters
    let filteredResults = searchResults

    if (query) {
      filteredResults = filteredResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }

    if (types.length > 0) {
      filteredResults = filteredResults.filter(result => types.includes(result.type))
    }

    if (location) {
      filteredResults = filteredResults.filter(result => 
        result.location?.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (status) {
      filteredResults = filteredResults.filter(result => 
        result.status.toLowerCase() === status.toLowerCase()
      )
    }

    return NextResponse.json(filteredResults)
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 