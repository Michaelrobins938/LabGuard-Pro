'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { CreditCard, Settings, Users, BarChart3, Shield, Zap, CheckCircle, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  description: string
  features: string[]
  limits: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
}

interface CurrentSubscription {
  id: string
  status: string
  plan: {
    id: string
    name: string
    price: number
    currency: string
    interval: string
  }
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29900,
    currency: 'USD',
    interval: 'month',
    description: 'Perfect for small laboratories getting started with compliance automation',
    features: [
      'Up to 10 equipment items',
      '100 AI compliance checks per month',
      'Basic reporting and analytics',
      'Email support',
      '2 team members',
      '10 GB storage'
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
    price: 59900,
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
      '100 GB storage'
    ],
    limits: {
      equipment: 50,
      aiChecks: 500,
      teamMembers: 10,
      storage: 100
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 129900,
    currency: 'USD',
    interval: 'month',
    description: 'Complete solution for large laboratories and enterprise deployments',
    features: [
      'Unlimited equipment items',
      '2,000 AI compliance checks per month',
      'White-label options',
      'Dedicated support',
      'Unlimited team members',
      'API access',
      'Custom integrations',
      '500 GB storage'
    ],
    limits: {
      equipment: -1,
      aiChecks: 2000,
      teamMembers: -1,
      storage: 500
    }
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
  const [portalLoading, setPortalLoading] = useState(false)

  // Fetch current subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiService.billing.getSubscription()
      return response.subscription as CurrentSubscription
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
    mutationFn: (id: string) => apiService.billing.cancelSubscription(id),
    onSuccess: () => {
      toast.success('Subscription cancelled successfully')
      setCancelDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: (error: any) => {
      toast.error('Failed to cancel subscription')
    }
  })

  // Customer portal mutation
  const portalMutation = useMutation({
    mutationFn: (data: any) => apiService.billing.getBillingPortal(data),
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank')
      }
      setPortalLoading(false)
    },
    onError: (error: any) => {
      toast.error('Failed to open customer portal')
      setPortalLoading(false)
    }
  })

  const handleUpgrade = () => {
    if (selectedPlan) {
      upgradeMutation.mutate(selectedPlan)
    }
  }

  const handleCancel = () => {
    if (subscription?.id) {
      cancelMutation.mutate(subscription.id)
    }
  }

  const handleCustomerPortal = () => {
    if (subscription?.stripeCustomerId) {
      setPortalLoading(true)
      portalMutation.mutate({
        customerId: subscription.stripeCustomerId,
        returnUrl: `${window.location.origin}/dashboard/billing`
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
          <p className="text-gray-300">Manage your subscription, upgrade plans, and access billing information</p>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Current Subscription</span>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(subscription.status)}>
                    {subscription.status}
                  </Badge>
                  {subscription.cancelAtPeriodEnd && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Canceling
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">{subscription.plan.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{subscription.plan.interval} billing</p>
                  <div className="text-2xl font-bold text-white">{formatCurrency(subscription.plan.price)}</div>
                  <p className="text-gray-300 text-sm">per {subscription.plan.interval}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Current period</p>
                  <p className="text-white font-semibold">{formatDate(subscription.currentPeriodStart)}</p>
                  <p className="text-gray-300 text-sm">to</p>
                  <p className="text-white font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
                <div className="text-right">
                  <Button 
                    onClick={handleCustomerPortal}
                    disabled={portalLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {portalLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    Manage Billing
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Change Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/10 border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">Upgrade Your Plan</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Choose a new plan that better fits your needs
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedPlan === plan.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-semibold">{plan.name}</h3>
                              <p className="text-gray-300 text-sm">{plan.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">
                                {plan.price === 0 ? 'Custom' : formatCurrency(plan.price)}
                              </div>
                              <div className="text-gray-300 text-sm">per {plan.interval}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleUpgrade}
                        disabled={!selectedPlan || upgradeMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade Plan'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white/10 border-white/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                        Keep Subscription
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        disabled={cancelMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {cancelMutation.isPending ? 'Canceling...' : 'Cancel Subscription'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-white">
                  {plan.price === 0 ? 'Custom' : formatCurrency(plan.price)}
                </div>
                <p className="text-gray-300 text-sm">per {plan.interval}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    setUpgradeDialogOpen(true)
                  }}
                >
                  {subscription?.plan.id === plan.id ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 