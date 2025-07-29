import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const plans = [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small laboratories getting started with compliance automation',
        monthlyPrice: 29900, // $299.00
        yearlyPrice: 23900, // $239.00 (20% discount)
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 10 equipment items',
          '100 AI compliance checks per month',
          'Basic reporting and analytics',
          'Email support',
          '2 team members',
          'Standard calibration workflows',
          'Basic audit trail',
          'Stanford Biomni AI Integration',
          'Real-time Compliance Monitoring',
          'Automated Calibration Tracking',
          'Advanced Analytics Dashboard',
          '24/7 Customer Support',
          'SOC 2 Compliance',
          '99.9% Uptime SLA'
        ],
        limits: {
          equipment: 10,
          aiChecks: 100,
          teamMembers: 2,
          storage: 10
        },
        stripeId: process.env.STRIPE_STARTER_PRICE_ID,
        stripeYearlyId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Ideal for growing laboratories with advanced compliance needs',
        monthlyPrice: 59900, // $599.00
        yearlyPrice: 47900, // $479.00 (20% discount)
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 50 equipment items',
          '500 AI compliance checks per month',
          'Advanced analytics and reporting',
          'Priority support',
          '10 team members',
          'Custom branding',
          'Advanced audit trails',
          'API access',
          'Custom integrations',
          'Stanford Biomni AI Integration',
          'Real-time Compliance Monitoring',
          'Automated Calibration Tracking',
          'Advanced Analytics Dashboard',
          '24/7 Customer Support',
          'SOC 2 Compliance',
          '99.9% Uptime SLA'
        ],
        limits: {
          equipment: 50,
          aiChecks: 500,
          teamMembers: 10,
          storage: 100
        },
        popular: true,
        stripeId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
        stripeYearlyId: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Complete solution for large laboratories and enterprise deployments',
        monthlyPrice: 129900, // $1,299.00
        yearlyPrice: 103900, // $1,039.00 (20% discount)
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited equipment items',
          '2,000 AI compliance checks per month',
          'White-label options',
          'Dedicated support',
          'Unlimited team members',
          'Advanced API access',
          'Custom integrations',
          'SLA guarantees',
          'On-premise deployment options',
          'Stanford Biomni AI Integration',
          'Real-time Compliance Monitoring',
          'Automated Calibration Tracking',
          'Advanced Analytics Dashboard',
          '24/7 Customer Support',
          'SOC 2 Compliance',
          '99.9% Uptime SLA'
        ],
        limits: {
          equipment: -1, // Unlimited
          aiChecks: 2000,
          teamMembers: -1, // Unlimited
          storage: 500
        },
        recommended: true,
        stripeId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
        stripeYearlyId: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID
      }
    ]

    return NextResponse.json({
      plans,
      success: true
    })
  } catch (error: any) {
    console.error('Plans API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}