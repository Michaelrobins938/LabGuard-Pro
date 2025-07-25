'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Users,
  DollarSign,
  Calendar,
  Bell,
  Zap,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Download,
  Share2,
  MessageSquare,
  FileText,
  Shield
} from 'lucide-react'
import { format } from 'date-fns'

interface QCMetrics {
  totalTests: number
  passedTests: number
  failedTests: number
  warningTests: number
  passRate: number
  upcomingCalibrations: number
}

interface QCTrend {
  date: string
  passRate: number
  totalTests: number
  failures: number
}

interface RiskAlert {
  id: string
  equipmentName: string
  testType: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  confidence: number
  predictedFailureTime: Date | null
  recommendedActions: string[]
  affectedTests: string[]
  estimatedImpact: {
    delayedResults: number
    affectedClients: number
    costImpact: number
  }
}

interface RecentQC {
  id: string
  equipmentName: string
  equipmentModel: string
  result: 'PASS' | 'FAIL' | 'WARNING'
  performedAt: Date
  performedBy: string
  complianceScore: number
}

interface UpcomingCalibration {
  equipmentId: string
  equipmentName: string
  equipmentModel: string
  nextCalibration: Date
}

interface ClientImpact {
  clientId: string
  clientName: string
  organization: string
  affectedTests: string[]
  urgency: 'ROUTINE' | 'URGENT' | 'STAT'
  notificationStatus: 'PENDING' | 'SENT' | 'ACKNOWLEDGED'
}

export function QCMonitoringDashboard() {
  const [qcMetrics, setQcMetrics] = useState<QCMetrics | null>(null)
  const [qcTrends, setQcTrends] = useState<QCTrend[]>([])
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])
  const [recentQC, setRecentQC] = useState<RecentQC[]>([])
  const [upcomingCalibrations, setUpcomingCalibrations] = useState<UpcomingCalibration[]>([])
  const [clientImpact, setClientImpact] = useState<ClientImpact[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock data - replace with API calls
  useEffect(() => {
    const fetchQCMonitoringData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock QC metrics
        setQcMetrics({
          totalTests: 156,
          passedTests: 142,
          failedTests: 8,
          warningTests: 6,
          passRate: 91.0,
          upcomingCalibrations: 12
        })

        // Mock QC trends
        setQcTrends([
          { date: '2024-01-10', passRate: 94.2, totalTests: 45, failures: 2 },
          { date: '2024-01-11', passRate: 92.8, totalTests: 38, failures: 3 },
          { date: '2024-01-12', passRate: 89.5, totalTests: 42, failures: 4 },
          { date: '2024-01-13', passRate: 91.0, totalTests: 31, failures: 2 },
          { date: '2024-01-14', passRate: 88.9, totalTests: 36, failures: 4 },
          { date: '2024-01-15', passRate: 91.0, totalTests: 33, failures: 3 }
        ])

        // Mock risk alerts
        setRiskAlerts([
          {
            id: 'risk-1',
            equipmentName: 'PCR Machine #1',
            testType: 'West Nile Virus',
            riskLevel: 'HIGH',
            confidence: 87,
            predictedFailureTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            recommendedActions: [
              'Replace reagent lot immediately',
              'Run additional QC controls',
              'Schedule preventive maintenance'
            ],
            affectedTests: ['test-1', 'test-2', 'test-3'],
            estimatedImpact: {
              delayedResults: 24,
              affectedClients: 8,
              costImpact: 3600
            }
          },
          {
            id: 'risk-2',
            equipmentName: 'Centrifuge #2',
            testType: 'COVID-19',
            riskLevel: 'MEDIUM',
            confidence: 65,
            predictedFailureTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
            recommendedActions: [
              'Monitor temperature stability',
              'Check calibration status',
              'Review recent QC trends'
            ],
            affectedTests: ['test-4', 'test-5'],
            estimatedImpact: {
              delayedResults: 12,
              affectedClients: 4,
              costImpact: 1800
            }
          }
        ])

        // Mock recent QC
        setRecentQC([
          {
            id: 'qc-1',
            equipmentName: 'PCR Machine #1',
            equipmentModel: 'Applied Biosystems 7500',
            result: 'PASS',
            performedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            performedBy: 'Dr. Sarah Chen',
            complianceScore: 96.2
          },
          {
            id: 'qc-2',
            equipmentName: 'Centrifuge #2',
            equipmentModel: 'Eppendorf 5810R',
            result: 'WARNING',
            performedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            performedBy: 'Mike Rodriguez',
            complianceScore: 78.5
          },
          {
            id: 'qc-3',
            equipmentName: 'Incubator #1',
            equipmentModel: 'Thermo Scientific 3111',
            result: 'PASS',
            performedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            performedBy: 'Emily Johnson',
            complianceScore: 94.8
          }
        ])

        // Mock upcoming calibrations
        setUpcomingCalibrations([
          {
            equipmentId: 'eq-1',
            equipmentName: 'Analytical Balance AB-001',
            equipmentModel: 'Sartorius ME36S',
            nextCalibration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          },
          {
            equipmentId: 'eq-2',
            equipmentName: 'pH Meter PH-002',
            equipmentModel: 'Thermo Scientific Orion 3-Star',
            nextCalibration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          }
        ])

        // Mock client impact
        setClientImpact([
          {
            clientId: 'client-1',
            clientName: 'Dr. Sarah Johnson',
            organization: 'Downtown Medical Clinic',
            affectedTests: ['West Nile Virus', 'COVID-19'],
            urgency: 'URGENT',
            notificationStatus: 'SENT'
          },
          {
            clientId: 'client-2',
            clientName: 'Dr. Michael Chen',
            organization: 'City General Hospital',
            affectedTests: ['Influenza A/B'],
            urgency: 'ROUTINE',
            notificationStatus: 'PENDING'
          }
        ])

        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch QC monitoring data:', error)
        setLoading(false)
      }
    }

    fetchQCMonitoringData()

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(fetchQCMonitoringData, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-600 bg-red-100 border-red-200'
      case 'HIGH': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'LOW': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'PASS': return 'text-green-600 bg-green-100'
      case 'FAIL': return 'text-red-600 bg-red-100'
      case 'WARNING': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleRiskAlertAction = async (alertId: string, action: string) => {
    console.log(`Taking action ${action} on alert ${alertId}`)
    // Implement action handling
  }

  const handleClientNotification = async (clientId: string) => {
    console.log(`Sending notification to client ${clientId}`)
    // Implement notification sending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading QC monitoring data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QC Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time quality control monitoring with AI-powered predictions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QC Pass Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qcMetrics?.passRate.toFixed(1)}%</div>
            <Progress value={qcMetrics?.passRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {qcMetrics?.passedTests} of {qcMetrics?.totalTests} tests passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {riskAlerts.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affected Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientImpact.length}</div>
            <p className="text-xs text-muted-foreground">
              {clientImpact.filter(c => c.urgency === 'URGENT' || c.urgency === 'STAT').length} urgent cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${riskAlerts.reduce((sum, alert) => sum + alert.estimatedImpact.costImpact, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Potential cost impact
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="clients">Client Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent QC Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent QC Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQC.map((qc) => (
                    <div key={qc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getResultColor(qc.result)}`}>
                          {qc.result === 'PASS' && <CheckCircle className="w-4 h-4" />}
                          {qc.result === 'FAIL' && <AlertTriangle className="w-4 h-4" />}
                          {qc.result === 'WARNING' && <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{qc.equipmentName}</p>
                          <p className="text-sm text-gray-600">{qc.equipmentModel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{qc.performedBy}</p>
                        <p className="text-xs text-gray-500">
                          {format(qc.performedAt, 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Calibrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Upcoming Calibrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingCalibrations.map((cal) => (
                    <div key={cal.equipmentId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">{cal.equipmentName}</p>
                        <p className="text-sm text-gray-600">{cal.equipmentModel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(cal.nextCalibration, 'MMM dd')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(cal.nextCalibration, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Risk Alerts */}
          <div className="space-y-4">
            {riskAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getRiskColor(alert.riskLevel)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5" />
                      <span>AI Risk Prediction</span>
                    </CardTitle>
                    <Badge className={getRiskColor(alert.riskLevel)}>
                      {alert.riskLevel} RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">{alert.equipmentName}</h4>
                      <p className="text-sm text-gray-600 mb-4">Test Type: {alert.testType}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Confidence:</span>
                          <span className="text-sm font-medium">{alert.confidence}%</span>
                        </div>
                        {alert.predictedFailureTime && (
                          <div className="flex justify-between">
                            <span className="text-sm">Predicted Failure:</span>
                            <span className="text-sm font-medium">
                              {format(alert.predictedFailureTime, 'MMM dd, HH:mm')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h5 className="font-medium text-sm mb-2">Recommended Actions:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {alert.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Impact Assessment</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Delayed Results:</span>
                          <span className="text-sm font-medium">{alert.estimatedImpact.delayedResults}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Affected Clients:</span>
                          <span className="text-sm font-medium">{alert.estimatedImpact.affectedClients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Cost Impact:</span>
                          <span className="text-sm font-medium">${alert.estimatedImpact.costImpact.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleRiskAlertAction(alert.id, 'acknowledge')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Acknowledge Alert
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleRiskAlertAction(alert.id, 'investigate')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* QC Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>QC Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">QC Trends Chart</p>
                  <p className="text-sm text-gray-500">Chart visualization would be implemented here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {/* Client Impact Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Client Impact Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientImpact.map((client) => (
                  <div key={client.clientId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{client.clientName}</h4>
                        <p className="text-sm text-gray-600">{client.organization}</p>
                      </div>
                      <Badge 
                        variant={client.urgency === 'STAT' ? 'destructive' : 
                                client.urgency === 'URGENT' ? 'default' : 'secondary'}
                      >
                        {client.urgency}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Affected Tests:</h5>
                        <div className="space-y-1">
                          {client.affectedTests.map((test, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>{test}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Notification Status:</h5>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={client.notificationStatus === 'SENT' ? 'default' : 
                                    client.notificationStatus === 'ACKNOWLEDGED' ? 'secondary' : 'outline'}
                          >
                            {client.notificationStatus}
                          </Badge>
                          {client.notificationStatus === 'PENDING' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleClientNotification(client.clientId)}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Notification
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Automated Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Automated Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">QA Reports Generated</h4>
              <p className="text-sm text-gray-600">3 reports auto-generated</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Client Notifications</h4>
              <p className="text-sm text-gray-600">8 notifications sent</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Rerun Scheduling</h4>
              <p className="text-sm text-gray-600">5 tests rescheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 