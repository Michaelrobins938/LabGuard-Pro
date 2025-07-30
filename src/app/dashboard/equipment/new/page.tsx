'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewEquipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    manufacturer: '',
    equipmentType: '',
    location: '',
    installDate: '',
    warrantyExpiry: '',
    specifications: {
      capacity: '',
      accuracy: '',
      operatingRange: '',
      powerRequirement: ''
    }
  })

  const equipmentTypes = [
    { value: 'ANALYTICAL_BALANCE', label: 'Analytical Balance' },
    { value: 'CENTRIFUGE', label: 'Centrifuge' },
    { value: 'INCUBATOR', label: 'Incubator' },
    { value: 'AUTOCLAVE', label: 'Autoclave' },
    { value: 'SPECTROPHOTOMETER', label: 'Spectrophotometer' },
    { value: 'PCR_MACHINE', label: 'PCR Machine' },
    { value: 'MICROSCOPE', label: 'Microscope' },
    { value: 'PIPETTE', label: 'Pipette' },
    { value: 'WATER_BATH', label: 'Water Bath' },
    { value: 'REFRIGERATOR', label: 'Refrigerator' },
    { value: 'FREEZER', label: 'Freezer' },
    { value: 'OTHER', label: 'Other' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to equipment list on success
      router.push('/dashboard/equipment')
    } catch (error) {
      setError('Failed to create equipment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    if (field.startsWith('specifications.')) {
      const specField = field.replace('specifications.', '')
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/equipment">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Equipment
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Equipment</h1>
          <p className="text-sm text-gray-600">
            Add a new piece of laboratory equipment to your inventory
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about the equipment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., Precision Balance PB-220"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="equipmentType">Equipment Type *</Label>
                  <select
                    id="equipmentType"
                    value={formData.equipmentType}
                    onChange={(e) => updateFormData('equipmentType', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select equipment type</option>
                    {equipmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => updateFormData('manufacturer', e.target.value)}
                    placeholder="e.g., Mettler Toledo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => updateFormData('model', e.target.value)}
                    placeholder="e.g., PB-220"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => updateFormData('serialNumber', e.target.value)}
                    placeholder="e.g., PB220-2024-001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="e.g., Chemistry Lab - Bench 1"
                  />
                </div>

                <div>
                  <Label htmlFor="installDate">Install Date</Label>
                  <Input
                    id="installDate"
                    type="date"
                    value={formData.installDate}
                    onChange={(e) => updateFormData('installDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                  <Input
                    id="warrantyExpiry"
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => updateFormData('warrantyExpiry', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>
                Add technical specifications for calibration and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity/Range</Label>
                  <Input
                    id="capacity"
                    value={formData.specifications.capacity}
                    onChange={(e) => updateFormData('specifications.capacity', e.target.value)}
                    placeholder="e.g., 0-220g"
                  />
                </div>

                <div>
                  <Label htmlFor="accuracy">Accuracy</Label>
                  <Input
                    id="accuracy"
                    value={formData.specifications.accuracy}
                    onChange={(e) => updateFormData('specifications.accuracy', e.target.value)}
                    placeholder="e.g., ±0.1mg"
                  />
                </div>

                <div>
                  <Label htmlFor="operatingRange">Operating Range</Label>
                  <Input
                    id="operatingRange"
                    value={formData.specifications.operatingRange}
                    onChange={(e) => updateFormData('specifications.operatingRange', e.target.value)}
                    placeholder="e.g., 18-25°C, 45-75% RH"
                  />
                </div>

                <div>
                  <Label htmlFor="powerRequirement">Power Requirement</Label>
                  <Input
                    id="powerRequirement"
                    value={formData.specifications.powerRequirement}
                    onChange={(e) => updateFormData('specifications.powerRequirement', e.target.value)}
                    placeholder="e.g., 120V/60Hz"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/equipment">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Equipment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 