'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle, ArrowRight, Sparkles, Crown, Globe } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  limits: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
  popular?: boolean
  recommended?: boolean
}

export default function PricingPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/billing/plans')
        const data = await response.json()
        if (data.success) {
          setPlans(data.plans)
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error)
        toast.error('Failed to load pricing plans')
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          isYearly,
          successUrl: `${window.location.origin}/dashboard/billing/subscription?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })

      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe checkout error:', error)
          toast.error('Failed to redirect to checkout')
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Failed to create checkout session')
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return <Sparkles className="w-6 h-6" />
      case 'professional':
        return <Crown className="w-6 h-6" />
      case 'enterprise':
        return <Globe className="w-6 h-6" />
      default:
        return <CheckCircle className="w-6 h-6" />
    }
  }

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading pricing plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-300 mb-8">
            Choose the right plan for your laboratory compliance needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="mx-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                backgroundColor: isYearly ? '#3b82f6' : '#374151'
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
              <span className="ml-1 text-green-400 text-xs">(Save 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`enhanced-pricing-card relative ${
                plan.popular ? 'popular ring-2 ring-purple-500/50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-white mb-2">
                  ${formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                  <span className="text-lg text-gray-400">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && (
                  <div className="text-sm text-green-400">
                    Save ${formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)} annually
                  </div>
                )}
              </div>

              <ul className="space-y-3 text-gray-300 mb-8">
                {plan.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {plan.popular ? 'Start Free Trial' : 'Get Started'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              {/* Plan Limits */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-3 text-sm">Plan Limits:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">
                      {plan.limits.equipment === -1 ? '∞' : plan.limits.equipment} Equipment
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">
                      {plan.limits.aiChecks === -1 ? '∞' : plan.limits.aiChecks} AI Checks
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">
                      {plan.limits.teamMembers === -1 ? '∞' : plan.limits.teamMembers} Team Members
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">
                      {plan.limits.storage} GB Storage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact us for custom enterprise plans with dedicated support, on-premise deployment, and custom integrations.
            </p>
            <button 
              onClick={() => router.push('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Contact Sales
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 