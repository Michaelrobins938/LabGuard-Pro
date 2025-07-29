'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  Brain,
  Settings,
  Loader2,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  BarChart3,
  Microscope,
  Database,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data for demonstration
  const dashboardStats = {
    totalEquipment: 24,
    activeEquipment: 22,
    overdueCalibrations: 3,
    pendingReports: 7,
    complianceRate: 98.5,
    aiAssistanceSessions: 156
  };

  const recentActivities = [
    {
      id: 1,
      type: 'calibration',
      equipment: 'PCR Machine',
      status: 'completed',
      time: '2 hours ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'maintenance',
      equipment: 'Centrifuge',
      status: 'scheduled',
      time: '4 hours ago',
      icon: Clock
    },
    {
      id: 3,
      type: 'ai_assistant',
      equipment: 'Protocol Design',
      status: 'completed',
      time: '6 hours ago',
      icon: Brain
    },
    {
      id: 4,
      type: 'compliance',
      equipment: 'Safety Audit',
      status: 'pending',
      time: '1 day ago',
      icon: Shield
    }
  ];

  const quickActions = [
    {
      title: 'AI Assistant',
      description: 'Get help with protocols and research',
      icon: Brain,
      href: '/dashboard/ai',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Equipment Management',
      description: 'Monitor and maintain equipment',
      icon: Microscope,
      href: '/dashboard/equipment',
      color: 'from-green-500 to-blue-600'
    },
    {
      title: 'Compliance Reports',
      description: 'Generate compliance documentation',
      icon: Shield,
      href: '/dashboard/compliance',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Analytics',
      description: 'View laboratory performance metrics',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Dr. Smith
                </span>
              </h1>
              <p className="text-gray-300">Here's what's happening in your laboratory today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Equipment</p>
                  <p className="text-2xl font-bold text-white">{dashboardStats.totalEquipment}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Equipment</p>
                  <p className="text-2xl font-bold text-white">{dashboardStats.activeEquipment}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Compliance Rate</p>
                  <p className="text-2xl font-bold text-white">{dashboardStats.complianceRate}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">AI Sessions</p>
                  <p className="text-2xl font-bold text-white">{dashboardStats.aiAssistanceSessions}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={action.href}>
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-gray-300 text-sm">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest updates from your laboratory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-500/20' :
                        activity.status === 'pending' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <activity.icon className={`w-5 h-5 ${
                          activity.status === 'completed' ? 'text-green-400' :
                          activity.status === 'pending' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.equipment}</p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {activity.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Alerts & Notifications</CardTitle>
                <CardDescription className="text-gray-400">Important updates and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Overdue Calibrations</p>
                      <p className="text-gray-300 text-sm">3 equipment items require immediate calibration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Maintenance Due</p>
                      <p className="text-gray-300 text-sm">Centrifuge maintenance scheduled for tomorrow</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Compliance Update</p>
                      <p className="text-gray-300 text-sm">Monthly compliance report generated successfully</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 