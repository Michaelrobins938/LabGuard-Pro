'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  Shield, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Download,
  Settings,
  History,
  TrendingUp,
  Zap
} from 'lucide-react'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'
import Link from 'next/link'

interface Subscription {
  id: string
  status: string
  plan: {
    name: string
    price: number
    interval: string
  }
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

interface Usage {
  equipment: {
    used: number
    limit: number
  }
  aiChecks: {
    used: number
    limit: number
  }
  teamMembers: {
    used: number
    limit: number
  }
  storage: {
    used: number
    limit: number
  }
}

interface Invoice {
  id: string
  amount: number
  status: string
  date: string
  description: string
}

export default function BillingDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      
      // Load subscription data
      const subscriptionData = await apiService.billing.getSubscription()
      setSubscription(subscriptionData.subscription)
      
      // Load usage data
      const usageData = await apiService.billing.getUsage()
      setUsage(usageData.usage)
      
      // Load invoices
      const invoicesData = await apiService.billing.getInvoices()
      setInvoices(invoicesData.invoices)
    } catch (error: any) {
      console.error('Failed to load billing data:', error)
      toast.error('Failed to load billing information')
    } finally {
      setLoading(false)
    }
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

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading billing information...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
          <p className="text-gray-300">
            Manage your subscription, view usage, and access billing history
          </p>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">{subscription.plan.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{subscription.plan.interval} billing</p>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                    {subscription.cancelAtPeriodEnd && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Canceling
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatCurrency(subscription.plan.price)}
                  </div>
                  <p className="text-gray-300 text-sm">per {subscription.plan.interval}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-300 text-sm">Next billing</p>
                  <p className="text-white font-semibold">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Link href="/dashboard/billing/subscription">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </Link>
                <Link href="/dashboard/billing/payment-methods">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Overview */}
        {usage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Equipment Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Equipment Items</span>
                    <span className="text-gray-300 text-sm">
                      {usage.equipment.used} / {usage.equipment.limit === -1 ? '∞' : usage.equipment.limit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(usage.equipment.used, usage.equipment.limit)} 
                    className="h-2"
                  />
                </div>

                {/* AI Checks Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">AI Compliance Checks</span>
                    <span className="text-gray-300 text-sm">
                      {usage.aiChecks.used} / {usage.aiChecks.limit === -1 ? '∞' : usage.aiChecks.limit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(usage.aiChecks.used, usage.aiChecks.limit)} 
                    className="h-2"
                  />
                </div>

                {/* Team Members Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Team Members</span>
                    <span className="text-gray-300 text-sm">
                      {usage.teamMembers.used} / {usage.teamMembers.limit === -1 ? '∞' : usage.teamMembers.limit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(usage.teamMembers.used, usage.teamMembers.limit)} 
                    className="h-2"
                  />
                </div>

                {/* Storage Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Storage</span>
                    <span className="text-gray-300 text-sm">
                      {usage.storage.used}GB / {usage.storage.limit}GB
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(usage.storage.used, usage.storage.limit)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard/billing/invoices">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                    <History className="w-4 h-4 mr-2" />
                    View Invoice History
                  </Button>
                </Link>
                
                <Link href="/dashboard/billing/usage">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Detailed Usage Analytics
                  </Button>
                </Link>
                
                <Link href="/dashboard/billing/plans">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Change Plan
                  </Button>
                </Link>
                
                <Link href="/support">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Invoices */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Recent Invoices</span>
              <Link href="/dashboard/billing/invoices">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{invoice.description}</p>
                      <p className="text-gray-300 text-sm">{formatDate(invoice.date)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">
                        {formatCurrency(invoice.amount)}
                      </span>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300">No invoices found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 