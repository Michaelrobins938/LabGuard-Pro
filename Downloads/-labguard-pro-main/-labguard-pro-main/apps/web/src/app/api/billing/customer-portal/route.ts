import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, returnUrl } = body

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID,
    })

    return NextResponse.json({
      url: session.url,
      success: true
    })
  } catch (error: any) {
    console.error('Customer portal session creation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create customer portal session' 
    }, { status: 500 })
  }
}