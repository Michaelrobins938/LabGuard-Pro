'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TestTube, 
  Thermometer, 
  Shield, 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  badge?: string
  status?: 'success' | 'warning' | 'error' | 'info'
}

const quickActions: QuickAction[] = [
  {
    id: 'pcr-verification',
    title: 'PCR Verification',
    description: 'Validate PCR run setup',
    icon: <TestTube className="h-5 w-5" />,
    href: '/dashboard/compliance?tool=pcr',
    color: 'bg-blue-500',
    badge: 'Live',
    status: 'success'
  },
  {
    id: 'media-validation',
    title: 'Media Validation',
    description: 'Check biochemical media',
    icon: <Thermometer className="h-5 w-5" />,
    href: '/dashboard/compliance?tool=media',
    color: 'bg-green-500',
    badge: 'Live',
    status: 'success'
  },
  {
    id: 'safety-incidents',
    title: 'Safety Incidents',
    description: 'Verify CAP compliance',
    icon: <Shield className="h-5 w-5" />,
    href: '/dashboard/compliance?tool=incident',
    color: 'bg-red-500',
    badge: 'Live',
    status: 'info'
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Get compliance help',
    icon: <Bot className="h-5 w-5" />,
    href: '/dashboard/ai-assistant-demo',
    color: 'bg-purple-500',
    badge: 'New',
    status: 'success'
  }
]

const stats = [
  {
    label: 'PCR Runs Validated',
    value: '24',
    change: '+12%',
    icon: <TestTube className="h-4 w-4" />,
    color: 'text-blue-600'
  },
  {
    label: 'Media Lots Checked',
    value: '156',
    change: '+8%',
    icon: <Thermometer className="h-4 w-4" />,
    color: 'text-green-600'
  },
  {
    label: 'Compliance Score',
    value: '98%',
    change: '+2%',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-emerald-600'
  },
  {
    label: 'Safety Incidents',
    value: '2',
    change: '-50%',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-orange-600'
  }
]

export function QuickAccessWidget() {
  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.id} href={action.href}>
                <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      {action.badge && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            action.badge === 'New' && "bg-green-100 text-green-700",
                            action.badge === 'Live' && "bg-blue-100 text-blue-700"
                          )}
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                    <div className="flex items-center mt-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        action.status === 'success' && "bg-green-500",
                        action.status === 'warning' && "bg-yellow-500",
                        action.status === 'error' && "bg-red-500",
                        action.status === 'info' && "bg-blue-500"
                      )} />
                      <span className="text-xs text-gray-500">
                        {action.status === 'success' && 'Ready'}
                        {action.status === 'warning' && 'Attention'}
                        {action.status === 'error' && 'Issue'}
                        {action.status === 'info' && 'Active'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Compliance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg bg-white ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600">
                    {stat.label}
                  </p>
                </div>
                <div className={cn(
                  "text-xs font-medium",
                  stat.change.startsWith('+') ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Compliance Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">PCR Run Approved</p>
                  <p className="text-sm text-green-700">COVID-19 RT-PCR run validated successfully</p>
                </div>
              </div>
              <span className="text-sm text-green-600">2 min ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Media Expiration Warning</p>
                  <p className="text-sm text-yellow-700">Catalase test media expires in 3 days</p>
                </div>
              </div>
              <span className="text-sm text-yellow-600">15 min ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Incident Report Filed</p>
                  <p className="text-sm text-blue-700">Minor chemical spill properly documented</p>
                </div>
              </div>
              <span className="text-sm text-blue-600">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
} 