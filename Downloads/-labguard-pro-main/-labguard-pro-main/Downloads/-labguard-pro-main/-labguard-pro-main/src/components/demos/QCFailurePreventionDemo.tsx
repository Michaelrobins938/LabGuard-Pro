'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  FileText,
  Users,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Activity,
  Bell,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  time: string
  status: 'pending' | 'active' | 'completed'
  actions: string[]
  manualTime: string
  automatedTime: string
  savings: string
}

interface DemoAlert {
  id: string
  type: 'qc_failure' | 'prevention' | 'notification' | 'resolution'
  message: string
  timestamp: Date
  priority: 'critical' | 'high' | 'medium' | 'low'
  actions: string[]
  resolved: boolean
}

export default function QCFailurePreventionDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [alerts, setAlerts] = useState<DemoAlert[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const demoSteps: DemoStep[] = [
    {
      id: 'step-1',
      title: 'QC Failure Detection',
      description: 'System detects positive QC control failure instantly',
      time: '2:30 PM',
      status: 'pending',
      actions: ['Real-time monitoring', 'Instant failure detection', 'Automated alert generation'],
      manualTime: '30 minutes',
      automatedTime: '30 seconds',
      savings: '29.5 minutes'
    },
    {
      id: 'step-2',
      title: 'Stakeholder Notification',
      description: 'Automated notifications sent to all stakeholders',
      time: '2:30:30 PM',
      status: 'pending',
      actions: ['Vector Control notified', 'Lab manager alerted', 'Emergency services contacted'],
      manualTime: '45 minutes',
      automatedTime: '2 minutes',
      savings: '43 minutes'
    },
    {
      id: 'step-3',
      title: 'Retest Scheduling',
      description: 'Automated retest scheduled with optimized resources',
      time: '2:32 PM',
      status: 'pending',
      actions: ['Backup equipment assigned', 'Technician scheduled', 'Priority queue updated'],
      manualTime: '30 minutes',
      automatedTime: '1 minute',
      savings: '29 minutes'
    },
    {
      id: 'step-4',
      title: 'Compliance Documentation',
      description: 'Complete documentation generated automatically',
      time: '2:33 PM',
      status: 'pending',
      actions: ['Regulatory report created', 'Audit trail established', 'Corrective action documented'],
      manualTime: '30 minutes',
      automatedTime: '30 seconds',
      savings: '29.5 minutes'
    },
    {
      id: 'step-5',
      title: 'Resource Allocation',
      description: 'Optimal resource allocation for minimal delay',
      time: '2:33:30 PM',
      status: 'pending',
      actions: ['Equipment availability checked', 'Technician availability verified', 'Alternative methods identified'],
      manualTime: '20 minutes',
      automatedTime: '1 minute',
      savings: '19 minutes'
    }
  ]

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    setAlerts([])
    setShowComparison(false)
    
    // Simulate demo progression
    demoSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index)
        
        // Add corresponding alert
        const alert: DemoAlert = {
          id: `alert-${index}`,
          type: index === 0 ? 'qc_failure' : index === 1 ? 'notification' : 'resolution',
          message: step.description,
          timestamp: new Date(),
          priority: index === 0 ? 'critical' : index === 1 ? 'high' : 'medium',
          actions: step.actions,
          resolved: false
        }
        
        setAlerts(prev => [...prev, alert])
        
        // Show comparison after all steps
        if (index === demoSteps.length - 1) {
          setTimeout(() => setShowComparison(true), 2000)
        }
      }, (index + 1) * 3000) // 3 seconds per step
    })
  }

  const pauseDemo = () => {
    setIsPlaying(false)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setAlerts([])
    setShowComparison(false)
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'active': return 'text-blue-400'
      case 'pending': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />
      case 'active': return <Activity className="w-5 h-5" />
      case 'pending': return <Clock className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'qc_failure': return 'border-red-500 bg-red-500/10'
      case 'prevention': return 'border-green-500 bg-green-500/10'
      case 'notification': return 'border-blue-500 bg-blue-500/10'
      case 'resolution': return 'border-orange-500 bg-orange-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">QC Failure Prevention Demo</h2>
          <p className="text-gray-300">Real-world scenario: Vector Control QC Failure Crisis Resolution</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-400">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Live Demo Mode</span>
          </div>
          <div className="flex space-x-2">
            {!isPlaying ? (
              <button
                onClick={startDemo}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-400 hover:bg-teal-500/30 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Demo</span>
              </button>
            ) : (
              <button
                onClick={pauseDemo}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={resetDemo}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-400 hover:bg-gray-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Progress */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Demo Progress</h3>
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {demoSteps.length}
          </span>
        </div>
        
        <div className="space-y-4">
          {demoSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                index <= currentStep 
                  ? 'border-teal-500 bg-teal-500/10' 
                  : 'border-gray-500 bg-gray-500/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStepStatusColor(
                    index < currentStep ? 'completed' : 
                    index === currentStep ? 'active' : 'pending'
                  )}`}>
                    {getStepStatusIcon(
                      index < currentStep ? 'completed' : 
                      index === currentStep ? 'active' : 'pending'
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{step.title}</h4>
                    <p className="text-sm text-gray-300">{step.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Time: {step.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Manual: {step.manualTime}</div>
                  <div className="text-sm text-teal-400">Automated: {step.automatedTime}</div>
                  <div className="text-sm text-green-400 font-medium">Saved: {step.savings}</div>
                </div>
              </div>
              
              {index <= currentStep && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-1"
                >
                  {step.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{action}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Alerts */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Live System Alerts</h3>
          <span className="text-sm text-gray-400">{alerts.length} active alerts</span>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`p-4 rounded-lg border-l-4 ${getAlertTypeColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-white mb-2">{alert.message}</h4>
                    <div className="space-y-1">
                      {alert.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Phone className="w-4 h-4 text-gray-300" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Mail className="w-4 h-4 text-gray-300" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <FileText className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Comparison Results */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Time Savings Comparison</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual Process */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <h4 className="font-semibold text-red-400 mb-3">Traditional Manual Process</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">QC Detection:</span>
                    <span className="text-red-400">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Communication:</span>
                    <span className="text-red-400">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Retest Scheduling:</span>
                    <span className="text-red-400">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Documentation:</span>
                    <span className="text-red-400">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Resource Allocation:</span>
                    <span className="text-red-400">20 minutes</span>
                  </div>
                  <div className="border-t border-red-500/30 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Time:</span>
                      <span className="text-red-400">2 hours 35 minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Process */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-3">LabGuard Pro Automated Process</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">QC Detection:</span>
                    <span className="text-green-400">30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Communication:</span>
                    <span className="text-green-400">2 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Retest Scheduling:</span>
                    <span className="text-green-400">1 minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Documentation:</span>
                    <span className="text-green-400">30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Resource Allocation:</span>
                    <span className="text-green-400">1 minute</span>
                  </div>
                  <div className="border-t border-green-500/30 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Time:</span>
                      <span className="text-green-400">5 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <div className="text-center">
                <h4 className="font-semibold text-teal-400 mb-2">Total Time Saved</h4>
                <div className="text-3xl font-bold text-teal-400 mb-2">2 hours 30 minutes</div>
                <p className="text-sm text-gray-300">
                  That's a <span className="text-teal-400 font-semibold">96.8% reduction</span> in response time!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-semibold text-white mb-2">Preventive Action</h4>
          <p className="text-sm text-gray-300">
            AI-powered QC monitoring prevents failures before they occur
          </p>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-semibold text-white mb-2">Instant Communication</h4>
          <p className="text-sm text-gray-300">
            Automated notifications reach all stakeholders within minutes
          </p>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-orange-400" />
          </div>
          <h4 className="font-semibold text-white mb-2">Optimized Resources</h4>
          <p className="text-sm text-gray-300">
            Smart scheduling minimizes delays and maximizes efficiency
          </p>
        </div>
      </div>
    </div>
  )
} 