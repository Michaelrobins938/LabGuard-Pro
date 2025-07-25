import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate database lookup for available test types
    const testTypes = [
      {
        id: 'catalase',
        name: 'Catalase Test',
        category: 'Biochemical',
        mediaType: 'Agar',
        storageTemp: '2-8°C',
        shelfLife: '30 days',
        qcFrequency: 'Weekly',
        sterilityMarkers: 'Clear, no growth'
      },
      {
        id: 'oxidase',
        name: 'Oxidase Test',
        category: 'Biochemical',
        mediaType: 'Reagent',
        storageTemp: '2-8°C',
        shelfLife: '90 days',
        qcFrequency: 'Monthly',
        sterilityMarkers: 'Purple color change'
      },
      {
        id: 'indole',
        name: 'Indole Test',
        category: 'Biochemical',
        mediaType: 'Broth',
        storageTemp: '2-8°C',
        shelfLife: '60 days',
        qcFrequency: 'Bi-weekly',
        sterilityMarkers: 'Clear, no turbidity'
      },
      {
        id: 'urease',
        name: 'Urease Test',
        category: 'Biochemical',
        mediaType: 'Agar',
        storageTemp: '2-8°C',
        shelfLife: '45 days',
        qcFrequency: 'Weekly',
        sterilityMarkers: 'Pink color'
      },
      {
        id: 'citrate',
        name: 'Citrate Utilization',
        category: 'Biochemical',
        mediaType: 'Agar',
        storageTemp: '2-8°C',
        shelfLife: '60 days',
        qcFrequency: 'Bi-weekly',
        sterilityMarkers: 'Green color'
      },
      {
        id: 'maltose',
        name: 'Maltose Fermentation',
        category: 'Carbohydrate',
        mediaType: 'Broth',
        storageTemp: '2-8°C',
        shelfLife: '30 days',
        qcFrequency: 'Weekly',
        sterilityMarkers: 'Clear, no growth'
      },
      {
        id: 'lactose',
        name: 'Lactose Fermentation',
        category: 'Carbohydrate',
        mediaType: 'Broth',
        storageTemp: '2-8°C',
        shelfLife: '30 days',
        qcFrequency: 'Weekly',
        sterilityMarkers: 'Clear, no growth'
      },
      {
        id: 'glucose',
        name: 'Glucose Fermentation',
        category: 'Carbohydrate',
        mediaType: 'Broth',
        storageTemp: '2-8°C',
        shelfLife: '30 days',
        qcFrequency: 'Weekly',
        sterilityMarkers: 'Clear, no growth'
      }
    ]

    return NextResponse.json({ testTypes })
  } catch (error) {
    console.error('Failed to fetch test types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test types' },
      { status: 500 }
    )
  }
} 