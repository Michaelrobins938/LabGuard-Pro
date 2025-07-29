import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would fetch invoice data from your database or Stripe
    // For now, we'll return mock invoice data for demonstration
    const invoices = [
      {
        id: 'inv_1234567890',
        number: 'INV-2024-001',
        description: 'Professional Plan - Monthly',
        amount: 59900,
        currency: 'USD',
        status: 'paid',
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        pdfUrl: '/api/billing/invoices/inv_1234567890/download'
      },
      {
        id: 'inv_1234567891',
        number: 'INV-2024-002',
        description: 'Professional Plan - Monthly',
        amount: 59900,
        currency: 'USD',
        status: 'paid',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '/api/billing/invoices/inv_1234567891/download'
      },
      {
        id: 'inv_1234567892',
        number: 'INV-2024-003',
        description: 'Professional Plan - Monthly',
        amount: 59900,
        currency: 'USD',
        status: 'paid',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '/api/billing/invoices/inv_1234567892/download'
      }
    ]

    return NextResponse.json({
      invoices,
      success: true
    })
  } catch (error: any) {
    console.error('Invoices fetch error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch invoices' 
    }, { status: 500 })
  }
} 