'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Eye,
  Settings,
  Zap,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  Receipt,
  Wallet
} from 'lucide-react'

export default function BillingPage() {
  const session = useSession()
  const { data: sessionData } = session || { data: null }

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Billing & Subscription</h1>
          <p className="text-gray-400 mt-2">Manage your subscription and billing information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
          <Badge variant="outline" className="border-teal-500/30 text-teal-400">
            <Shield className="w-3 h-3 mr-1" />
            Enterprise
          </Badge>
        </div>
      </div>

      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Plan</p>
                <p className="text-lg font-semibold text-white">Enterprise</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Next Billing</p>
                <p className="text-lg font-semibold text-white">Dec 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Monthly Cost</p>
                <p className="text-lg font-semibold text-white">$2,499</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Usage</p>
                <p className="text-lg font-semibold text-white">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Usage Breakdown</span>
            </CardTitle>
            <CardDescription>
              Current month's resource utilization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Queries</span>
                <span className="text-sm font-medium">1,247 / 2,000</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium">78.5 GB / 100 GB</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Calls</span>
                <span className="text-sm font-medium">45,892 / 50,000</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Team Members</span>
                <span className="text-sm font-medium">12 / 15</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              <span>Cost Analysis</span>
            </CardTitle>
            <CardDescription>
              Monthly cost breakdown by service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base Plan</span>
                <span className="text-sm font-medium">$1,999</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Services</span>
                <span className="text-sm font-medium">$350</span>
              </div>
              <Progress value={14} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium">$100</span>
              </div>
              <Progress value={4} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Support</span>
                <span className="text-sm font-medium">$50</span>
              </div>
              <Progress value={2} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Manage your billing and subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Receipt className="w-6 h-6" />
              <span>View Invoices</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <CreditCard className="w-6 h-6" />
              <span>Payment Methods</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Settings className="w-6 h-6" />
              <span>Billing Settings</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Download className="w-6 h-6" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>Recent Transactions</span>
          </CardTitle>
          <CardDescription>
            Latest billing activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium">November 2024</p>
                  <p className="text-sm text-gray-400">Enterprise Plan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$2,499.00</p>
                <p className="text-sm text-green-400">Paid</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium">October 2024</p>
                  <p className="text-sm text-gray-400">Enterprise Plan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$2,499.00</p>
                <p className="text-sm text-green-400">Paid</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium">September 2024</p>
                  <p className="text-sm text-gray-400">Enterprise Plan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$2,499.00</p>
                <p className="text-sm text-green-400">Paid</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 