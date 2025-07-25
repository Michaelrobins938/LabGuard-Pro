'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Settings, Brain, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const calibrationSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment is required'),
  calibrationType: z.string().min(1, 'Calibration type is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().min(1, 'Time is required'),
  priority: z.string().min(1, 'Priority is required'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  specialRequirements: z.string().optional(),
  aiOptimization: z.boolean().default(true)
})

type CalibrationFormData = z.infer<typeof calibrationSchema>

export default function NewCalibrationPage() {
  const router = useRouter()
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CalibrationFormData>({
    resolver: zodResolver(calibrationSchema),
    defaultValues: {
      aiOptimization: true
    }
  })

  const watchedEquipment = watch('equipmentId')
  const watchedCalibrationType = watch('calibrationType')

  // Mock equipment data
  const equipment = [
    { id: '1', name: 'pH Meter', type: 'Analytical', location: 'Lab A' },
    { id: '2', name: 'Microscope', type: 'Optical', location: 'Lab B' },
    { id: '3', name: 'Centrifuge', type: 'Mechanical', location: 'Lab C' },
    { id: '4', name: 'Spectrophotometer', type: 'Analytical', location: 'Lab A' }
  ]

  const calibrationTypes = [
    { value: 'routine', label: 'Routine Calibration', description: 'Standard periodic calibration' },
    { value: 'preventive', label: 'Preventive Maintenance', description: 'Preventive maintenance calibration' },
    { value: 'corrective', label: 'Corrective Action', description: 'Corrective action calibration' },
    { value: 'emergency', label: 'Emergency Calibration', description: 'Emergency calibration due to issues' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ]

  const teamMembers = [
    { id: '1', name: 'Dr. Sarah Chen', role: 'Lab Director' },
    { id: '2', name: 'Mike Johnson', role: 'Senior Technician' },
    { id: '3', name: 'Lisa Wang', role: 'Lab Technician' },
    { id: '4', name: 'David Kim', role: 'Quality Control' }
  ]

  const handleAiInsights = async () => {
    if (!watchedEquipment || !watchedCalibrationType) return

    setLoading(true)
    try {
      // Mock AI insights
      const insights = {
        recommendations: [
          'Schedule during low-traffic hours for minimal disruption',
          'Prepare backup equipment in case of extended downtime',
          'Consider environmental factors (temperature, humidity)',
          'Review previous calibration records for patterns'
        ],
        estimatedDuration: '2-3 hours',
        requiredTools: ['Calibration kit', 'Reference standards', 'Documentation forms'],
        riskFactors: ['Equipment age may affect accuracy', 'Environmental conditions critical'],
        costEstimate: '$150-200'
      }
      setAiInsights(insights)
    } catch (error) {
      console.error('Failed to get AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CalibrationFormData) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Calibration scheduled:', data)
      router.push('/dashboard/calibrations')
    } catch (error) {
      console.error('Failed to schedule calibration:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 mobile-spacing">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </Button>
          <h1 className="mobile-heading text-white">Schedule Calibration</h1>
        </div>
        <p className="mobile-text text-gray-400">Schedule a new equipment calibration</p>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Schedule Calibration</h1>
            <p className="text-gray-400 mt-2">Schedule a new equipment calibration with AI optimization</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Calibrations
          </Button>
        </div>
      </div>

      <div className="mobile-grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="mobile-heading text-white flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Calibration Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Equipment Selection */}
                <div className="space-y-2">
                  <Label htmlFor="equipmentId" className="mobile-text text-white">Equipment *</Label>
                  <Select onValueChange={(value) => setValue('equipmentId', value)}>
                    <SelectTrigger className="mobile-input">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center space-x-2">
                            <span>{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.equipmentId && (
                    <p className="mobile-text text-red-400">{errors.equipmentId.message}</p>
                  )}
                </div>

                {/* Calibration Type */}
                <div className="space-y-2">
                  <Label htmlFor="calibrationType" className="mobile-text text-white">Calibration Type *</Label>
                  <Select onValueChange={(value) => setValue('calibrationType', value)}>
                    <SelectTrigger className="mobile-input">
                      <SelectValue placeholder="Select calibration type" />
                    </SelectTrigger>
                    <SelectContent>
                      {calibrationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.calibrationType && (
                    <p className="mobile-text text-red-400">{errors.calibrationType.message}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="mobile-grid-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate" className="mobile-text text-white">Date *</Label>
                    <Input
                      type="date"
                      {...register('scheduledDate')}
                      className="mobile-input"
                    />
                    {errors.scheduledDate && (
                      <p className="mobile-text text-red-400">{errors.scheduledDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime" className="mobile-text text-white">Time *</Label>
                    <Input
                      type="time"
                      {...register('scheduledTime')}
                      className="mobile-input"
                    />
                    {errors.scheduledTime && (
                      <p className="mobile-text text-red-400">{errors.scheduledTime.message}</p>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="mobile-text text-white">Priority *</Label>
                  <Select onValueChange={(value) => setValue('priority', value)}>
                    <SelectTrigger className="mobile-input">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center space-x-2">
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="mobile-text text-red-400">{errors.priority.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="mobile-text text-white">Description</Label>
                  <Textarea
                    {...register('description')}
                    placeholder="Additional details about the calibration..."
                    className="mobile-input"
                    rows={3}
                  />
                </div>

                {/* Assignment */}
                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="mobile-text text-white">Assign To</Label>
                  <Select onValueChange={(value) => setValue('assignedTo', value)}>
                    <SelectTrigger className="mobile-input">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.role}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements" className="mobile-text text-white">Special Requirements</Label>
                  <Textarea
                    {...register('specialRequirements')}
                    placeholder="Any special requirements or notes..."
                    className="mobile-input"
                    rows={2}
                  />
                </div>

                {/* AI Optimization Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="mobile-text text-white font-medium">AI Optimization</p>
                      <p className="mobile-text text-gray-400">Get AI-powered recommendations</p>
                    </div>
                  </div>
                  <Switch
                    checked={watch('aiOptimization')}
                    onCheckedChange={(checked) => setValue('aiOptimization', checked)}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 mobile-button-primary"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Calibration'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="mobile-button-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="mobile-heading text-white flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {watchedEquipment && watchedCalibrationType ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleAiInsights}
                    disabled={loading}
                    className="w-full mobile-button-secondary"
                  >
                    {loading ? 'Loading...' : 'Get AI Recommendations'}
                  </Button>

                  {aiInsights && (
                    <div className="space-y-4">
                      {/* Recommendations */}
                      <div>
                        <h4 className="mobile-text text-white font-medium mb-2">Recommendations</h4>
                        <div className="space-y-2">
                          {aiInsights.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                              <p className="mobile-text text-gray-300">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estimated Duration */}
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="mobile-text text-blue-400 font-medium">Estimated Duration</span>
                        </div>
                        <p className="mobile-text text-white">{aiInsights.estimatedDuration}</p>
                      </div>

                      {/* Required Tools */}
                      <div>
                        <h4 className="mobile-text text-white font-medium mb-2">Required Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiInsights.requiredTools.map((tool: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div>
                        <h4 className="mobile-text text-white font-medium mb-2 flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span>Risk Factors</span>
                        </h4>
                        <div className="space-y-1">
                          {aiInsights.riskFactors.map((risk: string, index: number) => (
                            <p key={index} className="mobile-text text-yellow-400 text-sm">{risk}</p>
                          ))}
                        </div>
                      </div>

                      {/* Cost Estimate */}
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="mobile-text text-green-400 font-medium">Cost Estimate</span>
                        </div>
                        <p className="mobile-text text-white">{aiInsights.costEstimate}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="mobile-text text-gray-400">Select equipment and calibration type to get AI insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 