'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Camera, 
  Upload, 
  Play, 
  Download, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  FileImage,
  X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface VisualAnalysisResult {
  id: string
  imageUrl: string
  analysisType: string
  results: {
    quality: number
    issues: string[]
    recommendations: string[]
    confidence: number
  }
  metadata: {
    imageSize: number
    format: string
    timestamp: Date
  }
}

interface AnalysisType {
  value: string
  label: string
  description: string
  icon: React.ReactNode
}

const analysisTypes: AnalysisType[] = [
  {
    value: 'SAMPLE_QUALITY',
    label: 'Sample Quality Assessment',
    description: 'Analyze sample quality, clarity, and concentration',
    icon: <Eye className="w-4 h-4" />
  },
  {
    value: 'EQUIPMENT_CONDITION',
    label: 'Equipment Condition',
    description: 'Monitor equipment status and maintenance needs',
    icon: <Settings className="w-4 h-4" />
  },
  {
    value: 'CULTURE_GROWTH',
    label: 'Culture Growth Analysis',
    description: 'Analyze cell culture growth patterns and health',
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    value: 'CONTAMINATION_DETECTION',
    label: 'Contamination Detection',
    description: 'Detect microbial contamination in samples',
    icon: <AlertCircle className="w-4 h-4" />
  },
  {
    value: 'MICROSCOPY_INTERPRETATION',
    label: 'Microscopy Interpretation',
    description: 'Interpret microscopy images and cell morphology',
    icon: <Camera className="w-4 h-4" />
  }
]

export function VisualAnalysisComponent() {
  const { data: session } = useSession()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file)
        setImageUrl(URL.createObjectURL(file))
        setError('')
      } else {
        setError('Please select a valid image file')
      }
    }
  }

  const handleUrlInput = (url: string) => {
    setImageUrl(url)
    setSelectedImage(null)
    setError('')
  }

  const handleAnalysis = async () => {
    if (!imageUrl || !selectedAnalysisType) {
      setError('Please provide an image and select an analysis type')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      // If we have a file, upload it first
      let finalImageUrl = imageUrl
      if (selectedImage) {
        // In a real implementation, you would upload the file to your server
        // and get back a URL. For now, we'll use the object URL
        finalImageUrl = imageUrl
      }

      const response = await fetch('/api/biomni/visual-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          analysisType: selectedAnalysisType
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Analysis failed')
      }
    } catch (error) {
      setError('Failed to perform analysis. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600'
    if (quality >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visual Analysis</h2>
          <p className="text-gray-600 mt-1">
            Analyze images using Biomni AI for laboratory applications
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Camera className="w-4 h-4 mr-1" />
          Biomni AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Image Input</span>
            </CardTitle>
            <CardDescription>
              Upload an image or provide a URL for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="space-y-2">
                  <FileImage className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="image-url">Or provide image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => handleUrlInput(e.target.value)}
              />
            </div>

            {/* Analysis Type Selection */}
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <Select value={selectedAnalysisType} onValueChange={setSelectedAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Analysis Button */}
            <Button
              onClick={handleAnalysis}
              disabled={!imageUrl || !selectedAnalysisType || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Image Preview</span>
            </CardTitle>
            <CardDescription>
              Preview the image to be analyzed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null)
                      setImageUrl('')
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {selectedImage && (
                  <div className="text-sm text-gray-600">
                    <p>File: {selectedImage.name}</p>
                    <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Type: {selectedImage.type}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p>No image selected</p>
                  <p className="text-sm">Upload an image or provide a URL</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Analysis Results</span>
            </CardTitle>
            <CardDescription>
              AI-powered analysis results and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResult.results.quality}%
                    </div>
                    <div className="text-sm text-gray-600">Quality Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getConfidenceColor(analysisResult.results.confidence)}`}>
                      {(analysisResult.results.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">AI Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysisResult.results.issues.length}
                    </div>
                    <div className="text-sm text-gray-600">Issues Detected</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Quality Assessment</Label>
                    <Progress 
                      value={analysisResult.results.quality} 
                      className="h-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label>AI Confidence</Label>
                    <Progress 
                      value={analysisResult.results.confidence * 100} 
                      className="h-2 mt-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Analysis Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Analysis Type:</span>
                        <span className="font-medium">{analysisResult.analysisType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Image Format:</span>
                        <span className="font-medium">{analysisResult.metadata.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Image Size:</span>
                        <span className="font-medium">
                          {(analysisResult.metadata.imageSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analysis Time:</span>
                        <span className="font-medium">
                          {new Date(analysisResult.metadata.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Issues Detected</h4>
                    <div className="space-y-2">
                      {analysisResult.results.issues.length > 0 ? (
                        analysisResult.results.issues.map((issue, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span>{issue}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>No issues detected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">AI Recommendations</h4>
                  <div className="space-y-2">
                    {analysisResult.results.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 mt-6">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Full Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 