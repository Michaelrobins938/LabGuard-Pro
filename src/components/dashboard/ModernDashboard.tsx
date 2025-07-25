'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Microscope, 
  Beaker, 
  Dna, 
  Brain, 
  Sparkles,
  Bot,
  Zap,
  Target,
  BarChart3,
  Users,
  Settings
} from 'lucide-react'
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'

interface DashboardStats {
  totalEquipment: number
  activeCalibrations: number
  complianceScore: number
  pendingAlerts: number
  researchProjects: number
  aiAssistanceCount: number
}

interface RecentActivity {
  id: string
  type: 'calibration' | 'alert' | 'compliance' | 'research' | 'ai'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export function ModernDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 145,
    activeCalibrations: 3,
    complianceScore: 98.5,
    pendingAlerts: 2,
    researchProjects: 12,
    aiAssistanceCount: 47
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'ai',
      title: 'AI Protocol Generated',
      description: 'Stanford Biomni designed CRISPR-Cas9 gene editing protocol',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'calibration',
      title: 'Calibration Completed',
      description: 'Analytical balance PB-220 calibration passed all tests',
      timestamp: '15 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Equipment Alert',
      description: 'Centrifuge CF-16 temperature variance detected',
      timestamp: '1 hour ago',
      status: 'warning'
    },
    {
      id: '4',
      type: 'research',
      title: 'Research Analysis',
      description: 'Genomic data analysis completed using Biomni AI',
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: '5',
      type: 'compliance',
      title: 'Compliance Check',
      description: 'Monthly compliance audit completed - 98.5% score',
      timestamp: '3 hours ago',
      status: 'success'
    }
  ])

  const [showAIAssistant, setShowAIAssistant] = useState(true)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Bot className="w-4 h-4" />
      case 'calibration': return <Target className="w-4 h-4" />
      case 'alert': return <AlertTriangle className="w-4 h-4" />
      case 'research': return <Dna className="w-4 h-4" />
      case 'compliance': return <CheckCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-500/10'
      case 'warning': return 'text-yellow-500 bg-yellow-500/10'
      case 'error': return 'text-red-500 bg-red-500/10'
      case 'info': return 'text-blue-500 bg-blue-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              LabGuard Pro Dashboard
            </h1>
            <p className="text-gray-300">
              Powered by Stanford Biomni AI • Real-time Laboratory Intelligence
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Bot className="w-4 h-4 mr-2" />
              {showAIAssistant ? 'Hide AI' : 'Show AI'}
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Total Equipment</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEquipment}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Active Calibrations</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCalibrations}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Compliance Score</p>
                  <p className="text-2xl font-bold text-white">{stats.complianceScore}%</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Pending Alerts</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Research Projects</p>
                  <p className="text-2xl font-bold text-white">{stats.researchProjects}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Dna className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">AI Assistance</p>
                  <p className="text-2xl font-bold text-white">{stats.aiAssistanceCount}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-gray-300">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(activity.status)} border-current`}
                    >
                      {activity.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Assistant Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Stanford Biomni AI
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Your AI laboratory partner powered by Stanford's cutting-edge research
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Tools Available</span>
                    <span className="text-white font-medium">150+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Databases</span>
                    <span className="text-white font-medium">59</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Assistance Today</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => {
                    const event = new CustomEvent('toggle-assistant')
                    window.dispatchEvent(event)
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start AI Chat
                </Button>

                <div className="text-xs text-gray-400 text-center">
                  Powered by Stanford Biomni • 100x Research Acceleration
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Assistant Floating Component */}
              {showAIAssistant && <EnhancedBiomniAssistant />}
    </div>
  )
} 