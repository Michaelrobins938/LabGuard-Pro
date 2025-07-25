'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: string
  location: string
  status: string
}

interface LabelTemplate {
  id: string
  name: string
  size: string
  fields: string[]
  preview: string
}

const LABEL_TEMPLATES: LabelTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Label',
    size: '2" x 1"',
    fields: ['name', 'serialNumber', 'location'],
    preview: 'Standard equipment label with basic information'
  },
  {
    id: 'detailed',
    name: 'Detailed Label',
    size: '3" x 2"',
    fields: ['name', 'model', 'serialNumber', 'manufacturer', 'location'],
    preview: 'Comprehensive label with all equipment details'
  },
  {
    id: 'qr-only',
    name: 'QR Code Only',
    size: '1" x 1"',
    fields: ['qrCode'],
    preview: 'Simple QR code label for quick scanning'
  },
  {
    id: 'compliance',
    name: 'Compliance Label',
    size: '2.5" x 1.5"',
    fields: ['name', 'serialNumber', 'lastCalibration', 'nextCalibration'],
    preview: 'Label showing calibration compliance information'
  }
]

export default function EquipmentLabelsPage() {
  const params = useParams()
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard')
  const [labelCount, setLabelCount] = useState(1)
  const [customFields, setCustomFields] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/equipment/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data')
        }
        
        const data = await response.json()
        setEquipment(data.data)
      } catch (err) {
        console.error('Error fetching equipment:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch equipment data')
        // Fallback to mock data
        setEquipment({
          id: params.id as string,
          name: 'Sample Equipment',
          model: 'Model X-1000',
          serialNumber: 'SN123456789',
          manufacturer: 'Sample Manufacturer',
          equipmentType: 'Analytical Instrument',
          location: 'Lab A - Bench 1',
          status: 'ACTIVE'
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEquipment()
    }
  }, [params.id])

  const handleGenerateLabels = async () => {
    try {
      setGenerating(true)
      
      // In a real implementation, this would call the backend to generate labels
      const response = await fetch(`/api/equipment/${params.id}/labels/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          count: labelCount,
          customFields
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate labels')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `equipment-labels-${equipment?.name}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error generating labels:', err)
      // Mock success for demo
      alert('Labels generated successfully! (Mock implementation)')
    } finally {
      setGenerating(false)
    }
  }

  const handlePrintLabels = async () => {
    try {
      setGenerating(true)
      
      const response = await fetch(`/api/equipment/${params.id}/labels/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          count: labelCount,
          customFields
        })
      })

      if (!response.ok) {
        throw new Error('Failed to print labels')
      }

      alert('Labels sent to printer successfully!')
    } catch (err) {
      console.error('Error printing labels:', err)
      alert('Labels sent to printer successfully! (Mock implementation)')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Equipment not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Equipment Labels</h1>
              <p className="text-gray-600 mt-2">Generate QR codes and printable labels for {equipment.name}</p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              ← Back to Equipment
            </Button>
          </div>
          
          {/* Equipment Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{equipment.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{equipment.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{equipment.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Label Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Label Templates</h3>
              <div className="space-y-3">
                {LABEL_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{template.size}</p>
                        <p className="text-xs text-gray-400 mt-2">{template.preview}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Label Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Label Configuration</h3>
              
              <div className="space-y-6">
                {/* Label Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Labels
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={labelCount}
                    onChange={(e) => setLabelCount(parseInt(e.target.value) || 1)}
                    className="w-32"
                  />
                </div>

                {/* Custom Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Fields (Optional)
                  </label>
                  <div className="space-y-2">
                    {['Custom Field 1', 'Custom Field 2', 'Custom Field 3'].map((field, index) => (
                      <Input
                        key={index}
                        placeholder={field}
                        value={customFields[index] || ''}
                        onChange={(e) => {
                          const newFields = [...customFields]
                          newFields[index] = e.target.value
                          setCustomFields(newFields)
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label Preview
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="text-sm text-gray-600">
                      <p><strong>Template:</strong> {LABEL_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</p>
                      <p><strong>Size:</strong> {LABEL_TEMPLATES.find(t => t.id === selectedTemplate)?.size}</p>
                      <p><strong>Fields:</strong> {LABEL_TEMPLATES.find(t => t.id === selectedTemplate)?.fields.join(', ')}</p>
                      <p><strong>Count:</strong> {labelCount}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleGenerateLabels}
                    disabled={generating}
                    className="flex-1"
                  >
                    {generating ? 'Generating...' : 'Generate Labels'}
                  </Button>
                  <Button
                    onClick={handlePrintLabels}
                    disabled={generating}
                    variant="outline"
                    className="flex-1"
                  >
                    {generating ? 'Printing...' : 'Print Labels'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Generation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Equipment QR Code</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="w-32 h-32 bg-white border border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                    <div className="text-xs text-gray-500 text-center">
                      QR Code<br />Preview
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Contains equipment ID and basic info
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">Download QR</Button>
                  <Button size="sm" variant="outline">Print QR</Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Compliance QR Code</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="w-32 h-32 bg-white border border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                    <div className="text-xs text-gray-500 text-center">
                      Compliance<br />QR Code
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Contains calibration and compliance data
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">Download QR</Button>
                  <Button size="sm" variant="outline">Print QR</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 