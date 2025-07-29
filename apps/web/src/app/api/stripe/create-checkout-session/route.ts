import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { planId, billingCycle, customerEmail } = await request.json()

    // Define pricing plans
    const plans = {
      starter: {
        monthly: {
          priceId: 'price_starter_monthly', // Replace with actual Stripe price IDs
          amount: 9900, // $99.00 in cents
        },
        yearly: {
          priceId: 'price_starter_yearly',
          amount: 94800, // $948.00 in cents (79 * 12)
        }
      },
      professional: {
        monthly: {
          priceId: 'price_professional_monthly',
          amount: 29900, // $299.00 in cents
        },
        yearly: {
          priceId: 'price_professional_yearly',
          amount: 286800, // $2,868.00 in cents (239 * 12)
        }
      },
      enterprise: {
        monthly: {
          priceId: 'price_enterprise_monthly',
          amount: 99900, // $999.00 in cents
        },
        yearly: {
          priceId: 'price_enterprise_yearly',
          amount: 958800, // $9,588.00 in cents (799 * 12)
        }
      }
    }

    const selectedPlan = plans[planId as keyof typeof plans]
    const pricing = selectedPlan[billingCycle as keyof typeof selectedPlan]

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
              description: `LabGuard Pro ${planId.charAt(0).toUpperCase() + planId.slice(1)} subscription`,
              images: ['https://labguardpro.com/logo.png'], // Replace with actual logo URL
            },
            unit_amount: pricing.amount,
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      customer_email: customerEmail,
      metadata: {
        planId,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          planId,
          billingCycle,
        },
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}