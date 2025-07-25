'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bug, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Phone, 
  Mail, 
  FileText,
  Users,
  Settings,
  TrendingUp,
  Shield,
  Activity,
  Zap,
  Target,
  Globe
} from 'lucide-react'

interface VectorTest {
  id: string
  type: 'mosquito' | 'tick' | 'rodent' | 'waterborne'
  priority: 'outbreak' | 'routine' | 'research'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  qcStatus: 'pass' | 'fail' | 'pending'
  sampleCount: number
  expectedCompletion: Date
  actualCompletion?: Date
  stakeholders: string[]
  location: string
  technician: string
  equipment: string
  notes: string
}

interface VectorAlert {
  id: string
  testId: string
  type: 'qc_failure' | 'delay' | 'outbreak' | 'equipment'
  priority: 'critical' | 'high' | 'medium' | 'low'
  message: string
  timestamp: Date
  actions: string[]
  resolved: boolean
  stakeholders: string[]
}

export default function VectorControlWorkflow() {
  const [vectorTests, setVectorTests] = useState<VectorTest[]>([])
  const [alerts, setAlerts] = useState<VectorAlert[]>([])
  const [selectedTest, setSelectedTest] = useState<VectorTest | null>(null)
  const [activeTab, setActiveTab] = useState<'tests' | 'alerts' | 'analytics'>('tests')

  // Simulate vector control data
  useEffect(() => {
    const mockVectorTests: VectorTest[] = [
      {
        id: "VC-2024-001",
        type: "mosquito",
        priority: "outbreak",
        status: "failed",
        qcStatus: "fail",
        sampleCount: 150,
        expectedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        stakeholders: ["vector-control@health.gov", "emergency-services@health.gov"],
        location: "Downtown District",
        technician: "Dr. Sarah Johnson",
        equipment: "Analyzer-01",
        notes: "West Nile Virus screening - QC failure detected"
      },
      {
        id: "VC-2024-002",
        type: "tick",
        priority: "routine",
        status: "in_progress",
        qcStatus: "pass",
        sampleCount: 75,
        expectedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        stakeholders: ["vector-control@health.gov"],
        location: "Rural Area A",
        technician: "Mike Chen",
        equipment: "Analyzer-02",
        notes: "Lyme disease surveillance - routine monitoring"
      },
      {
        id: "VC-2024-003",
        type: "waterborne",
        priority: "research",
        status: "pending",
        qcStatus: "pending",
        sampleCount: 200,
        expectedCompletion: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        stakeholders: ["research-institute@university.edu"],
        location: "Lake District",
        technician: "Lisa Rodriguez",
        equipment: "Analyzer-03",
        notes: "Water quality research project"
      }
    ]

    const mockAlerts: VectorAlert[] = [
      {
        id: "alert-001",
        testId: "VC-2024-001",
        type: "qc_failure",
        priority: "critical",
        message: "Critical QC Failure: Vector Control Test VC-2024-001",
        timestamp: new Date(),
        actions: [
          "Automated retest scheduled",
          "Vector Control notified",
          "Emergency services alerted",
          "Compliance documentation generated"
        ],
        resolved: false,
        stakeholders: ["vector-control@health.gov", "emergency-services@health.gov"]
      },
      {
        id: "alert-002",
        testId: "VC-2024-002",
        type: "delay",
        priority: "medium",
        message: "Test delay: Equipment maintenance required",
        timestamp: new Date(),
        actions: [
          "Maintenance scheduled",
          "Alternative equipment assigned",
          "Stakeholders notified of delay"
        ],
        resolved: false,
        stakeholders: ["vector-control@health.gov"]
      }
    ]

    setVectorTests(mockVectorTests)
    setAlerts(mockAlerts)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mosquito': return <Bug className="w-5 h-5" />
      case 'tick': return <Target className="w-5 h-5" />
      case 'rodent': return <Activity className="w-5 h-5" />
      case 'waterborne': return <Globe className="w-5 h-5" />
      default: return <Shield className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mosquito': return 'text-red-400'
      case 'tick': return 'text-orange-400'
      case 'rodent': return 'text-brown-400'
      case 'waterborne': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'outbreak': return 'bg-red-500'
      case 'routine': return 'bg-blue-500'
      case 'research': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'in_progress': return 'text-blue-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getQCStatusColor = (qcStatus: string) => {
    switch (qcStatus) {
      case 'pass': return 'text-green-400'
      case 'fail': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const handleQCFailure = (test: VectorTest) => {
    const newAlert: VectorAlert = {
      id: `alert-${Date.now()}`,
      testId: test.id,
      type: "qc_failure",
      priority: test.priority === 'outbreak' ? 'critical' : 'high',
      message: `QC Failure: ${test.type} test ${test.id}`,
      timestamp: new Date(),
      actions: [
        "Automated retest initiated",
        "Stakeholders notified",
        "Emergency protocols activated",
        "Compliance documentation generated",
        "Resource allocation optimized"
      ],
      resolved: false,
      stakeholders: test.stakeholders
    }

    setAlerts(prev => [newAlert, ...prev])
  }

  const getCommunicationProtocol = (priority: string) => {
    switch (priority) {
      case 'outbreak': return "SMS + Email + Phone + Emergency Broadcast"
      case 'routine': return "Email + Dashboard"
      case 'research': return "Email only"
      default: return "Email"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Vector Control Workflow</h2>
          <p className="text-gray-300">Specialized management for vector-borne disease testing</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-400">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Emergency Protocols Active</span>
          </div>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'tests', label: 'Active Tests', icon: Activity },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-500/20 text-teal-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tests' && (
          <motion.div
            key="tests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vectorTests.map((test) => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card rounded-xl p-6 cursor-pointer"
                  onClick={() => setSelectedTest(test)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(test.type)}`}>
                        {getTypeIcon(test.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white capitalize">{test.type}</h4>
                        <p className="text-sm text-gray-400">ID: {test.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(test.priority)}`}>
                      {test.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Status:</span>
                      <span className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                        {test.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">QC Status:</span>
                      <span className={`text-sm font-medium ${getQCStatusColor(test.qcStatus)}`}>
                        {test.qcStatus.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Samples:</span>
                      <span className="text-sm text-white">{test.sampleCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Location:</span>
                      <span className="text-sm text-white">{test.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Completion:</span>
                      <span className="text-sm text-white">
                        {test.expectedCompletion.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {test.qcStatus === 'fail' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQCFailure(test)
                      }}
                      className="w-full mt-4 py-2 px-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Trigger Emergency Response
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.priority === 'critical' ? 'border-red-500 bg-red-500/10' :
                  alert.priority === 'high' ? 'border-orange-500 bg-orange-500/10' :
                  alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                  'border-green-500 bg-green-500/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.priority === 'critical' ? 'bg-red-500' :
                        alert.priority === 'high' ? 'bg-orange-500' :
                        alert.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-white mb-2">{alert.message}</h4>
                    <div className="space-y-1 mb-3">
                      {alert.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>Stakeholders: {alert.stakeholders.length}</span>
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
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Test Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mosquito Tests:</span>
                  <span className="text-white font-medium">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tick Tests:</span>
                  <span className="text-white font-medium">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Waterborne:</span>
                  <span className="text-white font-medium">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rodent:</span>
                  <span className="text-white font-medium">10%</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">QC Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Pass Rate:</span>
                  <span className="text-green-400 font-medium">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Fail Rate:</span>
                  <span className="text-red-400 font-medium">5.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Avg Response Time:</span>
                  <span className="text-blue-400 font-medium">2.3 min</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Communication Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Auto Notifications:</span>
                  <span className="text-green-400 font-medium">98.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Manual Calls:</span>
                  <span className="text-orange-400 font-medium">1.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Avg Resolution:</span>
                  <span className="text-blue-400 font-medium">15 min</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Test Details Modal */}
      <AnimatePresence>
        {selectedTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Vector Control Test Details</h3>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Test Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Test ID:</span>
                      <p className="text-white">{selectedTest.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-white capitalize">{selectedTest.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Priority:</span>
                      <p className="text-white capitalize">{selectedTest.priority}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <p className="text-white">{selectedTest.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Communication Protocol</h4>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-white">
                      {getCommunicationProtocol(selectedTest.priority)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Stakeholders</h4>
                  <div className="space-y-2">
                    {selectedTest.stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-white">{stakeholder}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 py-2 px-4 bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-400 hover:bg-teal-500/30 transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Call
                  </button>
                  <button className="flex-1 py-2 px-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Alert
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 