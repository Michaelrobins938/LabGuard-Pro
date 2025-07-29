import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { planId, successUrl, cancelUrl } = await request.json()

    // Get the price ID based on the plan
    const priceId = getPriceIdForPlan(planId)
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/dashboard/billing/subscription?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/dashboard/billing/plans?canceled=true`,
      metadata: {
        planId: planId,
      },
      subscription_data: {
        metadata: {
          planId: planId,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

function getPriceIdForPlan(planId: string): string | null {
  const planPriceMap: Record<string, string> = {
    'starter': process.env.STRIPE_STARTER_PRICE_ID!,
    'professional': process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    'enterprise': process.env.STRIPE_ENTERPRISE_PRICE_ID!,
  }

  return planPriceMap[planId] || null
}