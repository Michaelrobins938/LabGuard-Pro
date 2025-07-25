import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock invoices data for now
    const invoicesData = [
      {
        id: 'inv_001',
        amount: 2499.00,
        currency: 'usd',
        status: 'paid',
        createdAt: '2024-11-15T00:00:00Z',
        dueDate: '2024-11-15T00:00:00Z',
        invoiceUrl: 'https://invoice.stripe.com/i/acct_123/test'
      },
      {
        id: 'inv_002',
        amount: 2499.00,
        currency: 'usd',
        status: 'paid',
        createdAt: '2024-10-15T00:00:00Z',
        dueDate: '2024-10-15T00:00:00Z',
        invoiceUrl: 'https://invoice.stripe.com/i/acct_123/test'
      },
      {
        id: 'inv_003',
        amount: 2499.00,
        currency: 'usd',
        status: 'paid',
        createdAt: '2024-09-15T00:00:00Z',
        dueDate: '2024-09-15T00:00:00Z',
        invoiceUrl: 'https://invoice.stripe.com/i/acct_123/test'
      }
    ];

    return NextResponse.json({
      success: true,
      data: invoicesData
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices data' },
      { status: 500 }
    );
  }
} 