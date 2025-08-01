import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: Record<string, any>
  createdAt: string
  lastUsed: string
}

export async function GET(request: NextRequest) {
  try {
    // Mock saved searches data
    // In production, this would fetch from your database
    const savedSearches: SavedSearch[] = [
      {
        id: '1',
        name: 'Overdue Calibrations',
        query: 'calibration overdue',
        filters: { status: 'overdue', type: 'calibration' },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'PCR Equipment',
        query: 'PCR machine',
        filters: { type: 'equipment', tags: ['PCR'] },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Recent Maintenance',
        query: 'maintenance completed',
        filters: { type: 'maintenance', status: 'completed', dateRange: { start: '2024-01-01' } },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json(savedSearches)
  } catch (error) {
    console.error('Error fetching saved searches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, query, filters } = body

    // Mock saved search creation
    // In production, this would save to your database
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      query,
      filters,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }

    return NextResponse.json(newSavedSearch)
  } catch (error) {
    console.error('Error creating saved search:', error)
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    )
  }
} 