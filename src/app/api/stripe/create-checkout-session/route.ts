import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { planId, isYearly = false, successUrl, cancelUrl } = await request.json()

    // Fetch plan details from billing API
    const plansResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/plans`)
    const plansData = await plansResponse.json()
    
    if (!plansData.success) {
      return NextResponse.json(
        { error: 'Failed to fetch plan details' },
        { status: 500 }
      )
    }

    const plan = plansData.plans.find((p: any) => p.id === planId)
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Get the appropriate price ID based on billing interval
    const priceId = isYearly ? plan.stripeYearlyId : plan.stripeId
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
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
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        planId: planId,
        isYearly: isYearly.toString(),
      },
      subscription_data: {
        metadata: {
          planId: planId,
          isYearly: isYearly.toString(),
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
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