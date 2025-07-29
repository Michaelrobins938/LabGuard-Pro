'use client'

import { CheckCircle, Star, Zap, Shield, Users, BarChart3, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CheckoutSummaryProps {
  plan: any
  isYearly: boolean
}

export function CheckoutSummary({ plan, isYearly }: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100)
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Users className="w-6 h-6" />
      case 'professional':
        return <Star className="w-6 h-6" />
      case 'enterprise':
        return <Globe className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const getPlanFeatures = (planName: string) => {
    const baseFeatures = [
      'Stanford Biomni AI Integration',
      'Real-time Compliance Monitoring',
      'Automated Calibration Tracking',
      'Advanced Analytics Dashboard',
      '24/7 Customer Support',
      'SOC 2 Compliance',
      '99.9% Uptime SLA'
    ]

    switch (planName.toLowerCase()) {
      case 'starter':
        return [
          ...baseFeatures,
          'Up to 10 equipment items',
          '100 AI compliance checks/month',
          'Basic reporting and analytics',
          'Email support',
          '2 team members',
          'Standard calibration workflows'
        ]
      case 'professional':
        return [
          ...baseFeatures,
          'Up to 50 equipment items',
          '500 AI compliance checks/month',
          'Advanced analytics and reporting',
          'Priority support',
          '10 team members',
          'Custom branding',
          'Advanced audit trails',
          'API access',
          'Custom integrations'
        ]
      case 'enterprise':
        return [
          ...baseFeatures,
          'Unlimited equipment items',
          '2,000 AI compliance checks/month',
          'White-label options',
          'Dedicated support',
          'Unlimited team members',
          'Advanced API access',
          'Custom integrations',
          'SLA guarantees',
          'On-premise deployment options'
        ]
      default:
        return baseFeatures
    }
  }

  const features = getPlanFeatures(plan.name)
  const monthlyPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const yearlySavings = isYearly ? (plan.monthlyPrice - plan.yearlyPrice) * 12 : 0

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Plan Details */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {getPlanIcon(plan.name)}
              </div>
              <div>
                <h3 className="text-white font-semibold">{plan.name} Plan</h3>
                <p className="text-gray-300 text-sm">
                  {isYearly ? 'Annual billing' : 'Monthly billing'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatPrice(monthlyPrice)}
              </div>
              <div className="text-gray-300 text-sm">
                per {isYearly ? 'year' : 'month'}
              </div>
            </div>
          </div>

          {/* Savings */}
          {isYearly && yearlySavings > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm">Annual Savings</span>
                <span className="text-green-400 font-semibold">
                  {formatPrice(yearlySavings)}
                </span>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-white">
                {formatPrice(monthlyPrice)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {isYearly ? 'Billed annually' : 'Billed monthly'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            What's Included
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Limits */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Plan Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {plan.limits?.equipment === -1 ? '∞' : plan.limits?.equipment || 'N/A'}
              </div>
              <div className="text-gray-300 text-sm">Equipment Items</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {plan.limits?.aiChecks === -1 ? '∞' : plan.limits?.aiChecks || 'N/A'}
              </div>
              <div className="text-gray-300 text-sm">AI Checks/Month</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {plan.limits?.teamMembers === -1 ? '∞' : plan.limits?.teamMembers || 'N/A'}
              </div>
              <div className="text-gray-300 text-sm">Team Members</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {plan.limits?.storage || 'N/A'} GB
              </div>
              <div className="text-gray-300 text-sm">Storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money Back Guarantee */}
      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold">30-Day Money Back Guarantee</h4>
              <p className="text-gray-300 text-sm">
                Not satisfied? Get a full refund within 30 days. No questions asked.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}