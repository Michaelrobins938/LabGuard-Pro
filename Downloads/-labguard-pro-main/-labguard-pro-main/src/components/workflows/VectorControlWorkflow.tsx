'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, Bell, CheckCircle, Clock, MapPin, Users, Beaker, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Types based on the backend Prisma schema
interface VectorTest {
  id: string
  type: 'MOSQUITO' | 'TICK' | 'RODENT' | 'WATERBORNE'
  priority: 'OUTBREAK' | 'ROUTINE' | 'RESEARCH'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  qcStatus: 'PASS' | 'FAIL' | 'PENDING'
  sampleCount: number
  expectedCompletion: string
  actualCompletion?: string
  location: string
  notes?: string
  technician?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
  equipment?: {
    id: string
    name: string
    model: string
    location: string
  } | null
  stakeholders: {
    id: string
    email: string
    role: string | null
    organization: string | null
  }[]
  alerts: VectorAlert[]
  createdAt: string
  updatedAt: string
}

interface VectorAlert {
  id: string
  type: 'QC_FAILURE' | 'DELAY' | 'OUTBREAK' | 'EQUIPMENT'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  message: string
  actions: string[]
  resolved: boolean
  createdAt: string
}

interface VectorStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  failed: number
  criticalAlerts: number
  overdueTests: number
}

// API client functions
const vectorControlAPI = {
  async getTests(params?: {
    status?: string
    type?: string
    priority?: string
    limit?: number
    offset?: number
  }): Promise<{ data: VectorTest[], count: number }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const response = await fetch(`/api/vector-control/tests?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch vector tests')
    }
    
    return response.json()
  },

  async createTest(data: {
    type: string
    priority: string
    sampleCount: number
    expectedCompletion: string
    location: string
    notes?: string
    technicianId?: string
    equipmentId?: string
    stakeholders?: { email: string; role?: string; organization?: string }[]
  }): Promise<{ data: VectorTest }> {
    const response = await fetch('/api/vector-control/tests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create vector test')
    }
    
    return response.json()
  },

  async updateTest(id: string, data: {
    status?: string
    qcStatus?: string
    actualCompletion?: string
    notes?: string
    technicianId?: string
    equipmentId?: string
  }): Promise<{ data: VectorTest }> {
    const response = await fetch(`/api/vector-control/tests/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update vector test')
    }
    
    return response.json()
  },

  async deleteTest(id: string): Promise<void> {
    const response = await fetch(`/api/vector-control/tests/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete vector test')
    }
  },

  async getAlerts(): Promise<{ data: VectorAlert[], count: number }> {
    const response = await fetch('/api/vector-control/alerts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch vector alerts')
    }
    
    return response.json()
  },

  async createAlert(data: {
    type: string
    priority: string
    message: string
    actions: string[]
    testId: string
  }): Promise<{ data: VectorAlert }> {
    const response = await fetch('/api/vector-control/alerts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create vector alert')
    }
    
    return response.json()
  },

  async resolveAlert(id: string): Promise<{ data: VectorAlert }> {
    const response = await fetch(`/api/vector-control/alerts/${id}/resolve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to resolve vector alert')
    }
    
    return response.json()
  },

  async getStats(): Promise<{ data: VectorStats }> {
    const response = await fetch('/api/vector-control/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch vector stats')
    }
    
    return response.json()
  }
}

export function VectorControlWorkflow() {
  const [tests, setTests] = useState<VectorTest[]>([])
  const [alerts, setAlerts] = useState<VectorAlert[]>([])
  const [stats, setStats] = useState<VectorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState<VectorTest | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Form state for creating new tests
  const [newTest, setNewTest] = useState({
    type: '',
    priority: '',
    sampleCount: '',
    expectedCompletion: '',
    location: '',
    notes: '',
    stakeholderEmails: ''
  })

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [testsResponse, alertsResponse, statsResponse] = await Promise.all([
        vectorControlAPI.getTests({ limit: 50 }),
        vectorControlAPI.getAlerts(),
        vectorControlAPI.getStats()
      ])
      
      setTests(testsResponse.data)
      setAlerts(alertsResponse.data)
      setStats(statsResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Error loading vector control data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const stakeholders = newTest.stakeholderEmails
        ? newTest.stakeholderEmails.split(',').map(email => ({ email: email.trim() }))
        : []
      
      await vectorControlAPI.createTest({
        type: newTest.type,
        priority: newTest.priority,
        sampleCount: parseInt(newTest.sampleCount),
        expectedCompletion: newTest.expectedCompletion,
        location: newTest.location,
        notes: newTest.notes || undefined,
        stakeholders: stakeholders.length > 0 ? stakeholders : undefined
      })
      
      // Reset form and reload data
      setNewTest({
        type: '',
        priority: '',
        sampleCount: '',
        expectedCompletion: '',
        location: '',
        notes: '',
        stakeholderEmails: ''
      })
      setIsCreating(false)
      
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create test')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTestStatus = async (id: string, status: string, qcStatus?: string) => {
    try {
      setLoading(true)
      
      await vectorControlAPI.updateTest(id, {
        status,
        qcStatus,
        actualCompletion: status === 'COMPLETED' ? new Date().toISOString() : undefined
      })
      
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update test')
    } finally {
      setLoading(false)
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      await vectorControlAPI.resolveAlert(alertId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'OUTBREAK': case 'CRITICAL': return 'destructive'
      case 'ROUTINE': case 'HIGH': return 'default'
      case 'RESEARCH': case 'MEDIUM': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': case 'PASS': return 'default'
      case 'IN_PROGRESS': return 'secondary'
      case 'FAILED': case 'FAIL': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading && !tests.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <Beaker className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.overdueTests}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      <Badge variant="outline">{alert.type}</Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    {alert.actions.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Actions: {alert.actions.join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleResolveAlert(alert.id)}
                    disabled={loading}
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Test */}
      <Card>
        <CardHeader>
          <CardTitle>Vector Control Tests</CardTitle>
          <CardDescription>
            Manage vector control testing workflows and track progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCreating ? (
            <Button onClick={() => setIsCreating(true)} className="mb-4">
              Create New Test
            </Button>
          ) : (
            <form onSubmit={handleCreateTest} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Test Type</label>
                  <Select value={newTest.type} onValueChange={(value) => setNewTest({...newTest, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOSQUITO">Mosquito</SelectItem>
                      <SelectItem value="TICK">Tick</SelectItem>
                      <SelectItem value="RODENT">Rodent</SelectItem>
                      <SelectItem value="WATERBORNE">Waterborne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newTest.priority} onValueChange={(value) => setNewTest({...newTest, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OUTBREAK">Outbreak</SelectItem>
                      <SelectItem value="ROUTINE">Routine</SelectItem>
                      <SelectItem value="RESEARCH">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Sample Count</label>
                  <Input
                    type="number"
                    min="1"
                    value={newTest.sampleCount}
                    onChange={(e) => setNewTest({...newTest, sampleCount: e.target.value})}
                    placeholder="Number of samples"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Expected Completion</label>
                  <Input
                    type="datetime-local"
                    value={newTest.expectedCompletion}
                    onChange={(e) => setNewTest({...newTest, expectedCompletion: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={newTest.location}
                    onChange={(e) => setNewTest({...newTest, location: e.target.value})}
                    placeholder="Test location"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Stakeholder Emails (comma-separated)</label>
                  <Input
                    value={newTest.stakeholderEmails}
                    onChange={(e) => setNewTest({...newTest, stakeholderEmails: e.target.value})}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={newTest.notes}
                    onChange={(e) => setNewTest({...newTest, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  Create Test
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Tests List */}
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{test.type} Test</h3>
                      <Badge variant={getPriorityColor(test.priority)}>
                        {test.priority}
                      </Badge>
                      <Badge variant={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.qcStatus !== 'PENDING' && (
                        <Badge variant={getStatusColor(test.qcStatus)}>
                          QC: {test.qcStatus}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {test.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Beaker className="h-3 w-3" />
                        {test.sampleCount} samples
                      </span>
                      {test.stakeholders.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {test.stakeholders.length} stakeholders
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {test.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateTestStatus(test.id, 'IN_PROGRESS')}
                        disabled={loading}
                      >
                        Start
                      </Button>
                    )}
                    {test.status === 'IN_PROGRESS' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTestStatus(test.id, 'COMPLETED', 'PASS')}
                          disabled={loading}
                        >
                          Complete (Pass)
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateTestStatus(test.id, 'FAILED', 'FAIL')}
                          disabled={loading}
                        >
                          Mark Failed
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Expected: {new Date(test.expectedCompletion).toLocaleDateString()}
                  {test.actualCompletion && (
                    <span> • Completed: {new Date(test.actualCompletion).toLocaleDateString()}</span>
                  )}
                </div>
                
                {test.notes && (
                  <p className="text-sm mt-2">{test.notes}</p>
                )}
                
                {test.technician && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Technician: {test.technician.firstName} {test.technician.lastName}
                  </div>
                )}
                
                {test.alerts.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {test.alerts.map((alert) => (
                      <div key={alert.id} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                        <Badge variant={getPriorityColor(alert.priority)} className="mr-2">
                          {alert.priority}
                        </Badge>
                        {alert.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {tests.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                No vector control tests found. Create your first test to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 