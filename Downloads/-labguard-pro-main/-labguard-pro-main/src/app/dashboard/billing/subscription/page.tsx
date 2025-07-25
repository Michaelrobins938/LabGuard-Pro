'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Check,
  X,
  Zap,
  Users,
  Shield,
  Clock,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Calendar,
  FileText
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  description: string
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

interface CurrentSubscription {
  id: string
  planId: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  usage: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29900, // $299.00
    currency: 'USD',
    interval: 'month',
    description: 'Perfect for small laboratories getting started with compliance automation',
    features: [
      'Up to 10 equipment items',
      '100 AI compliance checks per month',
      'Basic reporting and analytics',
      'Email support',
      '2 team members',
      'Standard calibration workflows',
      'Basic audit trail'
    ],
    limits: {
      equipment: 10,
      aiChecks: 100,
      teamMembers: 2,
      storage: 10
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 59900, // $599.00
    currency: 'USD',
    interval: 'month',
    description: 'Ideal for growing laboratories with advanced compliance needs',
    features: [
      'Up to 50 equipment items',
      '500 AI compliance checks per month',
      'Advanced analytics and reporting',
      'Priority support',
      '10 team members',
      'Custom branding',
      'Advanced audit trails',
      'API access',
      'Custom integrations'
    ],
    limits: {
      equipment: 50,
      aiChecks: 500,
      teamMembers: 10,
      storage: 100
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 129900, // $1,299.00
    currency: 'USD',
    interval: 'month',
    description: 'Complete solution for large laboratories and enterprise deployments',
    features: [
      'Unlimited equipment items',
      '2,000 AI compliance checks per month',
      'White-label options',
      'Dedicated support',
      'Unlimited team members',
      'Advanced API access',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment options'
    ],
    limits: {
      equipment: -1, // Unlimited
      aiChecks: 2000,
      teamMembers: -1, // Unlimited
      storage: 500
    },
    recommended: true
  },
  {
    id: 'enterprise-plus',
    name: 'Enterprise Plus',
    price: 0, // Custom pricing
    currency: 'USD',
    interval: 'month',
    description: 'Custom solution for enterprise organizations with specific requirements',
    features: [
      'Custom AI check limits',
      'Volume discounts',
      'On-premise deployment',
      'SLA guarantees',
      'Custom development',
      'Dedicated account manager',
      'Custom integrations',
      'Training and onboarding',
      '24/7 phone support'
    ],
    limits: {
      equipment: -1,
      aiChecks: -1,
      teamMembers: -1,
      storage: -1
    }
  }
]

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  // Fetch current subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiService.billing.getSubscription()
      return response as CurrentSubscription
    },
    enabled: !!session
  })

  // Upgrade subscription mutation
  const upgradeMutation = useMutation({
    mutationFn: (planId: string) => apiService.billing.upgradeSubscription(planId),
    onSuccess: () => {
      toast.success('Subscription upgraded successfully')
      setUpgradeDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: (error: any) => {
      toast.error('Failed to upgrade subscription')
    }
  })

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: () => apiService.billing.cancelSubscription(subscription?.id || ''),
    onSuccess: () => {
      toast.success('Subscription will be canceled at the end of the current period')
      setCancelDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: (error: any) => {
      toast.error('Failed to cancel subscription')
    }
  })

  const currentPlan = subscription ? plans.find(p => p.id === subscription.planId) : null

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (amount === 0) return 'Custom Pricing'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const handleUpgrade = () => {
    if (!selectedPlan) {
      toast.error('Please select a plan')
      return
    }
    upgradeMutation.mutate(selectedPlan)
  }

  const handleCancel = () => {
    cancelMutation.mutate()
  }

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription plan and billing cycle
          </p>
        </div>
      </div>

      {/* Current Plan */}
      {subscription && currentPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Current Plan: {currentPlan.name}
                </CardTitle>
                <CardDescription>
                  {formatCurrency(currentPlan.price, currentPlan.currency)}/{currentPlan.interval}
                </CardDescription>
              </div>
              <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                {subscription.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Usage Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {subscription.usage.equipment}
                  {currentPlan.limits.equipment === -1 ? '+' : `/${currentPlan.limits.equipment}`}
                </div>
                <div className="text-sm text-muted-foreground">Equipment</div>
                {currentPlan.limits.equipment !== -1 && (
                  <Progress 
                    value={getUsagePercentage(subscription.usage.equipment, currentPlan.limits.equipment)} 
                    className="mt-2"
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {subscription.usage.aiChecks}
                  {currentPlan.limits.aiChecks === -1 ? '+' : `/${currentPlan.limits.aiChecks}`}
                </div>
                <div className="text-sm text-muted-foreground">AI Checks</div>
                {currentPlan.limits.aiChecks !== -1 && (
                  <Progress 
                    value={getUsagePercentage(subscription.usage.aiChecks, currentPlan.limits.aiChecks)} 
                    className="mt-2"
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {subscription.usage.teamMembers}
                  {currentPlan.limits.teamMembers === -1 ? '+' : `/${currentPlan.limits.teamMembers}`}
                </div>
                <div className="text-sm text-muted-foreground">Team Members</div>
                {currentPlan.limits.teamMembers !== -1 && (
                  <Progress 
                    value={getUsagePercentage(subscription.usage.teamMembers, currentPlan.limits.teamMembers)} 
                    className="mt-2"
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {subscription.usage.storage}GB
                  {currentPlan.limits.storage === -1 ? '+' : `/${currentPlan.limits.storage}GB`}
                </div>
                <div className="text-sm text-muted-foreground">Storage</div>
                {currentPlan.limits.storage !== -1 && (
                  <Progress 
                    value={getUsagePercentage(subscription.usage.storage, currentPlan.limits.storage)} 
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* Billing Period */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Current Billing Period</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Choose Your Plan</DialogTitle>
                    <DialogDescription>
                      Select the plan that best fits your laboratory's needs. You can upgrade or downgrade at any time.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        className={`cursor-pointer transition-all ${
                          selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                        } ${plan.popular ? 'border-primary' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            {plan.popular && (
                              <Badge variant="default">Most Popular</Badge>
                            )}
                            {plan.recommended && (
                              <Badge variant="secondary">Recommended</Badge>
                            )}
                          </div>
                          <CardDescription>
                            <span className="text-2xl font-bold">
                              {formatCurrency(plan.price, plan.currency)}
                            </span>
                            /{plan.interval}
                          </CardDescription>
                          <CardDescription className="text-sm">
                            {plan.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpgrade} 
                      disabled={!selectedPlan || upgradeMutation.isPending}
                    >
                      {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade Plan'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                      Keep Subscription
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancel}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending ? 'Canceling...' : 'Cancel Subscription'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Compare all available plans and their features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                    /{plan.interval}
                  </CardDescription>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    {plan.id === subscription?.planId ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Your billing details and payment history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Payment Method</h3>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <CreditCard className="h-4 w-4" />
                <span>•••• •••• •••• 4242</span>
                <Badge variant="default">Default</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Next Billing Date</h3>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Calendar className="h-4 w-4" />
                <span>{subscription ? formatDate(subscription.currentPeriodEnd) : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Download Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 