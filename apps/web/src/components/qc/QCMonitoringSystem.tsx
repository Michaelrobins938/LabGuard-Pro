'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingDown, 
  TrendingUp,
  Bell,
  Phone,
  Mail,
  FileText,
  Users,
  Settings,
  Activity
} from 'lucide-react'

interface QCTest {
  id: string
  name: string
  type: 'positive' | 'negative' | 'calibration'
  expectedRange: { min: number; max: number }
  actualValue: number
  status: 'pass' | 'fail' | 'warning' | 'trending'
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  stakeholders: string[]
  autoRetest: boolean
  equipment: string
  technician: string
}

interface QCAlert {
  id: string
  testId: string
  type: 'failure' | 'warning' | 'trend' | 'prevention'
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  actions: string[]
  resolved: boolean
}

export default function QCMonitoringSystem() {
  const [qcTests, setQcTests] = useState<QCTest[]>([])
  const [alerts, setAlerts] = useState<QCAlert[]>([])
  const [selectedTest, setSelectedTest] = useState<QCTest | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(true)

  // Simulate real-time QC monitoring
  useEffect(() => {
    const mockQCTests: QCTest[] = [
      {
        id: "VC-2024-001",
        name: "Vector Control Panel",
        type: "positive",
        expectedRange: { min: 0.8, max: 1.2 },
        actualValue: 0.3,
        status: "fail",
        timestamp: new Date(),
        priority: "critical",
        stakeholders: ["vector-control@health.gov", "lab-manager@hospital.com"],
        autoRetest: true,
        equipment: "Analyzer-01",
        technician: "Dr. Sarah Johnson"
      },
      {
        id: "QC-2024-002",
        name: "Blood Chemistry Panel",
        type: "calibration",
        expectedRange: { min: 0.9, max: 1.1 },
        actualValue: 0.95,
        status: "pass",
        timestamp: new Date(),
        priority: "medium",
        stakeholders: ["chemistry-team@hospital.com"],
        autoRetest: false,
        equipment: "Analyzer-02",
        technician: "Mike Chen"
      },
      {
        id: "QC-2024-003",
        name: "Microbiology Culture",
        type: "negative",
        expectedRange: { min: 0.0, max: 0.1 },
        actualValue: 0.05,
        status: "trending",
        timestamp: new Date(),
        priority: "high",
        stakeholders: ["microbiology@hospital.com"],
        autoRetest: true,
        equipment: "Incubator-01",
        technician: "Lisa Rodriguez"
      }
    ]

    const mockAlerts: QCAlert[] = [
      {
        id: "alert-001",
        testId: "VC-2024-001",
        type: "failure",
        message: "Critical QC Failure: Vector Control Positive Control",
        priority: "critical",
        timestamp: new Date(),
        actions: ["Auto-retest scheduled", "Stakeholders notified", "Compliance documented"],
        resolved: false
      },
      {
        id: "alert-002",
        testId: "QC-2024-003",
        type: "trend",
        message: "QC Trend Warning: Microbiology Culture trending upward",
        priority: "high",
        timestamp: new Date(),
        actions: ["Monitor closely", "Schedule preventive maintenance"],
        resolved: false
      }
    ]

    setQcTests(mockQCTests)
    setAlerts(mockAlerts)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-500'
      case 'fail': return 'text-red-500'
      case 'warning': return 'text-yellow-500'
      case 'trending': return 'text-orange-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5" />
      case 'fail': return <AlertTriangle className="w-5 h-5" />
      case 'warning': return <Clock className="w-5 h-5" />
      case 'trending': return <TrendingUp className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
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

  const handleQCAlert = (test: QCTest) => {
    // Simulate automated QC failure response
    const newAlert: QCAlert = {
      id: `alert-${Date.now()}`,
      testId: test.id,
      type: test.status === 'fail' ? 'failure' : 'warning',
      message: `QC ${test.status.toUpperCase()}: ${test.name}`,
      priority: test.priority,
      timestamp: new Date(),
      actions: [
        "Automated retest scheduled",
        "Stakeholders notified",
        "Compliance documentation generated",
        "Resource allocation optimized"
      ],
      resolved: false
    }

    setAlerts(prev => [newAlert, ...prev])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">QC Monitoring System</h2>
          <p className="text-gray-300">Real-time quality control monitoring and automated response</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isMonitoring ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-sm font-medium">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
            </span>
          </div>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active QC Alerts</h3>
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

      {/* QC Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qcTests.map((test) => (
          <motion.div
            key={test.id}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-6 cursor-pointer"
            onClick={() => setSelectedTest(test)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-white mb-1">{test.name}</h4>
                <p className="text-sm text-gray-400">ID: {test.id}</p>
              </div>
              <div className={`p-2 rounded-lg ${getStatusColor(test.status)}`}>
                {getStatusIcon(test.status)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">QC Type:</span>
                <span className="text-sm font-medium text-white capitalize">{test.type}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Expected Range:</span>
                <span className="text-sm text-white">
                  {test.expectedRange.min} - {test.expectedRange.max}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Actual Value:</span>
                <span className={`text-sm font-medium ${
                  test.actualValue >= test.expectedRange.min && test.actualValue <= test.expectedRange.max
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {test.actualValue}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Priority:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(test.priority)}`}>
                  {test.priority.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto Retest:</span>
                <span className={`text-sm ${test.autoRetest ? 'text-green-400' : 'text-gray-400'}`}>
                  {test.autoRetest ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {test.status === 'fail' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleQCAlert(test)
                }}
                className="w-full mt-4 py-2 px-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Trigger Automated Response
              </button>
            )}
          </motion.div>
        ))}
      </div>

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
                <h3 className="text-xl font-bold text-white">QC Test Details</h3>
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
                      <span className="text-gray-400">Name:</span>
                      <p className="text-white">{selectedTest.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Equipment:</span>
                      <p className="text-white">{selectedTest.equipment}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Technician:</span>
                      <p className="text-white">{selectedTest.technician}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">QC Results</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Expected Range:</span>
                      <span className="text-white font-medium">
                        {selectedTest.expectedRange.min} - {selectedTest.expectedRange.max}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Actual Value:</span>
                      <span className={`font-medium ${
                        selectedTest.actualValue >= selectedTest.expectedRange.min && 
                        selectedTest.actualValue <= selectedTest.expectedRange.max
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {selectedTest.actualValue}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedTest.priority)}`}>
                        {selectedTest.status.toUpperCase()}
                      </span>
                    </div>
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
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Stakeholders
                  </button>
                  <button className="flex-1 py-2 px-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
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