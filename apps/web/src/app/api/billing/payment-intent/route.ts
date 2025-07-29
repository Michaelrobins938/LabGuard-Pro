import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, isYearly, successUrl, cancelUrl } = body

    // Validate required fields
    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // Get plan details from your database or configuration
    const plans = {
      starter: {
        monthlyPrice: 29900, // $299.00
        yearlyPrice: 23900, // $239.00
        name: 'Starter Plan'
      },
      professional: {
        monthlyPrice: 59900, // $599.00
        yearlyPrice: 47900, // $479.00
        name: 'Professional Plan'
      },
      enterprise: {
        monthlyPrice: 129900, // $1,299.00
        yearlyPrice: 103900, // $1,039.00
        name: 'Enterprise Plan'
      }
    }

    const plan = plans[planId as keyof typeof plans]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId,
        isYearly: isYearly.toString(),
        planName: plan.name
      },
      description: `${plan.name} - ${isYearly ? 'Annual' : 'Monthly'} billing`,
      receipt_email: body.email || undefined,
      application_fee_amount: Math.round(amount * 0.029 + 30), // 2.9% + 30 cents
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency: paymentIntent.currency,
      plan: {
        id: planId,
        name: plan.name,
        isYearly,
        amount: amount / 100
      }
    })
  } catch (error: any) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}