import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would get the user's subscription from your database
    // For now, we'll return a mock subscription for demonstration
    const subscription = {
      id: 'sub_1234567890',
      status: 'active',
      plan: {
        id: 'professional',
        name: 'Professional Plan',
        price: 59900,
        currency: 'USD',
        interval: 'month'
      },
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      stripeCustomerId: 'cus_1234567890'
    }

    return NextResponse.json({
      subscription,
      success: true
    })
  } catch (error: any) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch subscription' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, cancelAtPeriodEnd } = body

    // In a real implementation, you would update the subscription in your database
    // and potentially update the Stripe subscription as well

    return NextResponse.json({
      message: 'Subscription updated successfully',
      success: true
    })
  } catch (error: any) {
    console.error('Subscription update error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update subscription' 
    }, { status: 500 })
  }
} 