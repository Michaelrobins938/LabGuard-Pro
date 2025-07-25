'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  TestTube,
  Thermometer,
  Bot,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface ComplianceMetric {
  name: string
  value: number
  target: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  icon: React.ReactNode
  color: string
}

const complianceMetrics: ComplianceMetric[] = [
  {
    name: 'PCR Protocol Compliance',
    value: 98,
    target: 95,
    status: 'excellent',
    icon: <TestTube className="h-4 w-4" />,
    color: 'text-blue-600'
  },
  {
    name: 'Media Safety Validation',
    value: 95,
    target: 90,
    status: 'good',
    icon: <Thermometer className="h-4 w-4" />,
    color: 'text-green-600'
  },
  {
    name: 'Safety Incident Response',
    value: 100,
    target: 95,
    status: 'excellent',
    icon: <Shield className="h-4 w-4" />,
    color: 'text-purple-600'
  },
  {
    name: 'AI Assistant Usage',
    value: 87,
    target: 80,
    status: 'good',
    icon: <Bot className="h-4 w-4" />,
    color: 'text-indigo-600'
  }
]

const recentValidations = [
  {
    type: 'PCR Verification',
    status: 'success',
    time: '2 minutes ago',
    details: 'COVID-19 RT-PCR run validated'
  },
  {
    type: 'Media Validation',
    status: 'warning',
    time: '15 minutes ago',
    details: 'Catalase media expires in 3 days'
  },
  {
    type: 'Safety Incident',
    status: 'success',
    time: '1 hour ago',
    details: 'Chemical spill properly documented'
  },
  {
    type: 'AI Assistant',
    status: 'success',
    time: '2 hours ago',
    details: 'Protocol validation assistance provided'
  }
]

export function ComplianceStatusWidget() {
  const overallCompliance = Math.round(
    complianceMetrics.reduce((sum, metric) => sum + metric.value, 0) / complianceMetrics.length
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4" />
      case 'good':
        return <TrendingUp className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Overall Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="relative inline-flex">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{overallCompliance}%</span>
              </div>
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Excellent
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Laboratory compliance status</p>
              <p className="text-xs text-gray-500">Updated in real-time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Compliance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {complianceMetrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{metric.value}%</span>
                  <Badge className={getStatusColor(metric.status)}>
                    {getStatusIcon(metric.status)}
                    <span className="ml-1 capitalize">{metric.status}</span>
                  </Badge>
                </div>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2"
                style={{
                  '--progress-background': metric.status === 'excellent' ? '#10b981' :
                                          metric.status === 'good' ? '#3b82f6' :
                                          metric.status === 'warning' ? '#f59e0b' : '#ef4444'
                } as React.CSSProperties}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Validations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Validations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentValidations.map((validation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    validation.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {validation.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{validation.type}</p>
                    <p className="text-xs text-gray-600">{validation.details}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{validation.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/dashboard/compliance?tool=pcr">
            <Button variant="outline" className="w-full justify-start">
              <TestTube className="h-4 w-4 mr-2" />
              PCR Verification
            </Button>
          </Link>
          
          <Link href="/dashboard/compliance?tool=media">
            <Button variant="outline" className="w-full justify-start">
              <Thermometer className="h-4 w-4 mr-2" />
              Media Validation
            </Button>
          </Link>
          
          <Link href="/dashboard/compliance?tool=incident">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Safety Incidents
            </Button>
          </Link>
          
          <Link href="/dashboard/ai-assistant-demo">
            <Button variant="outline" className="w-full justify-start">
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
} 