'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Zap, Shield, Users, BarChart3, Globe, Crown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: {
    name: string
    included: boolean
    limit?: string
  }[]
  limits: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
  popular?: boolean
  recommended?: boolean
}

interface CurrentSubscription {
  planId: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  currentPeriodEnd: string
}

export default function PlansPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch available plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      const response = await apiService.billing.getPlans()
      return response as Plan[]
    },
    enabled: !!session
  })

  // Fetch current subscription
  const { data: currentSubscription } = useQuery({
    queryKey: ['billing-subscription'],
    queryFn: async () => {
      const response = await apiService.billing.getSubscription()
      return response as CurrentSubscription
    },
    enabled: !!session
  })

  // Upgrade subscription mutation
  const upgradeSubscriptionMutation = useMutation({
    mutationFn: (planId: string) => apiService.billing.upgradeSubscription(planId),
    onSuccess: () => {
      toast.success('Subscription upgraded successfully')
      setShowUpgradeDialog(false)
      setSelectedPlan(null)
      queryClient.invalidateQueries({ queryKey: ['billing-subscription'] })
    },
    onError: (error: any) => {
      toast.error('Failed to upgrade subscription')
    }
  })

  const handleUpgrade = () => {
    if (!selectedPlan) return
    
    setIsProcessing(true)
    upgradeSubscriptionMutation.mutate(selectedPlan, {
      onSettled: () => {
        setIsProcessing(false)
      }
    })
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Zap className="h-6 w-6" />
      case 'professional':
        return <Shield className="h-6 w-6" />
      case 'enterprise':
        return <Crown className="h-6 w-6" />
      case 'enterprise plus':
        return <Star className="h-6 w-6" />
      default:
        return <BarChart3 className="h-6 w-6" />
    }
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId
  }

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your laboratory's needs. All plans include our core features 
          with different limits and capabilities to match your scale.
        </p>
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans?.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''} ${
              isCurrentPlan(plan.id) ? 'border-green-500 bg-green-50' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            {isCurrentPlan(plan.id) && (
              <Badge className="absolute -top-3 right-4 bg-green-500">
                Current Plan
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {formatCurrency(plan.price, plan.currency)}
                </span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Limits */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Equipment Items</span>
                  <span className="font-medium">
                    {plan.limits.equipment === -1 ? 'Unlimited' : plan.limits.equipment}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>AI Compliance Checks</span>
                  <span className="font-medium">
                    {plan.limits.aiChecks === -1 ? 'Unlimited' : plan.limits.aiChecks}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Team Members</span>
                  <span className="font-medium">
                    {plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">
                    {plan.limits.storage === -1 ? 'Unlimited' : `${plan.limits.storage}GB`}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm">
                      {feature.name}
                      {feature.limit && (
                        <span className="text-muted-foreground ml-1">({feature.limit})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                variant={isCurrentPlan(plan.id) ? "outline" : "default"}
                disabled={isCurrentPlan(plan.id)}
                onClick={() => {
                  if (!isCurrentPlan(plan.id)) {
                    setSelectedPlan(plan.id)
                    setShowUpgradeDialog(true)
                  }
                }}
              >
                {isCurrentPlan(plan.id) ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise Plus Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-purple-600" />
            Enterprise Plus
          </CardTitle>
          <CardDescription>
            Custom solutions for large laboratory networks and enterprise deployments
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Custom Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Custom AI check limits</li>
                <li>• On-premise deployment</li>
                <li>• SLA guarantees</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Volume Discounts</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Multi-site licensing</li>
                <li>• Annual billing discounts</li>
                <li>• Custom payment terms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Dedicated Support</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Dedicated account manager</li>
                <li>• Custom development</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
          <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
            Contact Sales
          </Button>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately 
              with prorated billing for the current period.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">What happens if I exceed my limits?</h4>
            <p className="text-sm text-muted-foreground">
              You'll receive notifications when approaching limits. If exceeded, you can either upgrade 
              your plan or purchase additional capacity.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Is there a free trial?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, all plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Absolutely. You can cancel your subscription at any time with no cancellation fees.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              You're about to upgrade your subscription. The new plan will take effect immediately 
              with prorated billing for the current period.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to upgrade to the selected plan? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 