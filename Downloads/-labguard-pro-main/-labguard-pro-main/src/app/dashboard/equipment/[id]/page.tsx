'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Download,
  Edit,
  Trash2,
  QrCode,
  Camera,
  BarChart3,
  Wrench,
  Shield,
  Activity,
  MapPin,
  Building,
  Zap
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface Equipment {
  id: string
  name: string
  type: string
  model: string
  serialNumber: string
  manufacturer: string
  location: string
  status: 'active' | 'maintenance' | 'inactive' | 'retired'
  healthScore: number
  lastCalibration: string
  nextCalibration: string
  specifications: {
    accuracy: string
    range: string
    resolution: string
    units: string
    environmentalConditions: string
  }
  compliance: {
    isCompliant: boolean
    lastCheck: string
    score: number
    issues: string[]
  }
  utilization: {
    totalUptime: number
    lastUsed: string
    usageCount: number
    efficiency: number
  }
  cost: {
    purchasePrice: number
    maintenanceCost: number
    operatingCost: number
    totalCost: number
  }
  photos: {
    id: string
    url: string
    caption: string
    createdAt: string
  }[]
  documents: {
    id: string
    name: string
    type: string
    url: string
    uploadedAt: string
  }[]
  recentActivity: {
    id: string
    type: string
    description: string
    timestamp: string
    user: string
  }[]
}

export default function EquipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')

  const equipmentId = params.id as string

  // Fetch equipment details
  const { data: equipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: async () => {
      const response = await apiService.equipment.getById(equipmentId)
      return response as Equipment
    },
    enabled: !!equipmentId && !!session
  })

  // Delete equipment mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.equipment.delete(id),
    onSuccess: () => {
      toast.success('Equipment deleted successfully')
      router.push('/dashboard/equipment')
    },
    onError: (error: any) => {
      toast.error('Failed to delete equipment')
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'retired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this equipment? This action cannot be undone.')) {
      deleteMutation.mutate(equipmentId)
    }
  }

  if (equipmentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Equipment Not Found</h2>
          <p className="text-muted-foreground mb-4">The equipment you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard/equipment')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Equipment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/equipment')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
            <p className="text-muted-foreground">
              {equipment.manufacturer} {equipment.model} • {equipment.serialNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(equipment.status)}>
                {equipment.status.toUpperCase()}
              </Badge>
              {equipment.status === 'active' && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              {equipment.status === 'maintenance' && (
                <Wrench className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getHealthColor(equipment.healthScore)}>
                {equipment.healthScore}%
              </span>
            </div>
            <Progress value={equipment.healthScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={equipment.compliance.isCompliant ? 'default' : 'destructive'}>
                {equipment.compliance.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {equipment.compliance.score}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calibrations">Calibrations</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Information</CardTitle>
                <CardDescription>Basic details and specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm text-muted-foreground">{equipment.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Model</Label>
                    <p className="text-sm text-muted-foreground">{equipment.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Serial Number</Label>
                    <p className="text-sm text-muted-foreground">{equipment.serialNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Manufacturer</Label>
                    <p className="text-sm text-muted-foreground">{equipment.manufacturer}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{equipment.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Accuracy:</span>
                      <p className="text-muted-foreground">{equipment.specifications.accuracy}</p>
                    </div>
                    <div>
                      <span className="font-medium">Range:</span>
                      <p className="text-muted-foreground">{equipment.specifications.range}</p>
                    </div>
                    <div>
                      <span className="font-medium">Resolution:</span>
                      <p className="text-muted-foreground">{equipment.specifications.resolution}</p>
                    </div>
                    <div>
                      <span className="font-medium">Units:</span>
                      <p className="text-muted-foreground">{equipment.specifications.units}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Environmental Conditions:</span>
                      <p className="text-muted-foreground">{equipment.specifications.environmentalConditions}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calibration Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Calibration Schedule</CardTitle>
                <CardDescription>Upcoming and recent calibrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Calibration</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(equipment.lastCalibration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Next Calibration</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(equipment.nextCalibration)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Calibration
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Utilization Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Utilization Metrics</CardTitle>
                <CardDescription>Usage statistics and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {equipment.utilization.usageCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Uses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {equipment.utilization.efficiency}%
                    </div>
                    <div className="text-sm text-muted-foreground">Efficiency</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uptime</span>
                    <span>{equipment.utilization.totalUptime} hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Used</span>
                    <span>{formatDate(equipment.utilization.lastUsed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Financial overview and ROI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Purchase Price</span>
                    <span>{formatCurrency(equipment.cost.purchasePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Maintenance Cost</span>
                    <span>{formatCurrency(equipment.cost.maintenanceCost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Operating Cost</span>
                    <span>{formatCurrency(equipment.cost.operatingCost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium border-t pt-2">
                    <span>Total Cost</span>
                    <span>{formatCurrency(equipment.cost.totalCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-muted rounded-lg">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.user} • {formatDate(activity.timestamp)}
                      </div>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs will be implemented in separate files */}
        <TabsContent value="calibrations" className="space-y-6">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Calibration History</h3>
            <p className="text-muted-foreground">Calibration history will be implemented here</p>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Maintenance Records</h3>
            <p className="text-muted-foreground">Maintenance tracking will be implemented here</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">Analytics dashboard will be implemented here</p>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Document Management</h3>
            <p className="text-muted-foreground">Document storage will be implemented here</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Equipment Settings</h3>
            <p className="text-muted-foreground">Configuration options will be implemented here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 