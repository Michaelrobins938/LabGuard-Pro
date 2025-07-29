'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Database, 
  Globe, 
  Code,
  Crown,
  TrendingUp,
  Check,
  X
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    description: 'Perfect for small laboratories',
    features: [
      'Up to 10 equipment items',
      '100 AI compliance checks',
      'Basic reporting',
      'Email support',
      '2 team members'
    ],
    popular: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 599,
    description: 'Advanced features for growing laboratories',
    features: [
      'Up to 50 equipment items',
      '500 AI compliance checks',
      'Advanced analytics',
      'Priority support',
      '10 team members',
      'Custom branding'
    ],
    popular: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1299,
    description: 'Complete solution for large laboratories',
    features: [
      'Unlimited equipment',
      '2,000 AI compliance checks',
      'White-label options',
      'Dedicated support',
      'Unlimited team members',
      'API access',
      'Custom integrations'
    ],
    popular: false,
    color: 'from-orange-500 to-red-500'
  }
]

export default function BillingPlansPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(planId)
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/dashboard/billing/subscription?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/billing/plans?canceled=true`,
        }),
      })

      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe checkout error:', error)
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {' '}Plan
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the perfect plan for your laboratory's needs. All plans include our core features with different limits and capabilities.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''
              }`}>
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {plan.id === 'starter' && <Zap className="w-8 h-8 text-white" />}
                    {plan.id === 'professional' && <Shield className="w-8 h-8 text-white" />}
                    {plan.id === 'enterprise' && <Crown className="w-8 h-8 text-white" />}
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3`}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Get ${plan.name} Plan`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Plan?</h3>
            <p className="text-gray-300 mb-6">
              For enterprise customers with specific requirements, we offer custom pricing and features.
            </p>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 