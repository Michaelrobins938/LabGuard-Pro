'use client'

import { useState, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Camera, 
  Upload, 
  Play, 
  Download, 
  Eye,
  AlertCircle,
  CheckCircle,
  Brain,
  Target,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  Filter,
  Sparkles,
  Lightbulb,
  BarChart3,
  Settings,
  X,
  Plus,
  Minus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AnalysisResult {
  id: string
  type: string
  confidence: number
  boundingBox: { x: number; y: number; width: number; height: number }
  description: string
  severity: 'low' | 'medium' | 'high'
  recommendations: string[]
}

interface VisualOverlay {
  id: string
  type: 'detection' | 'measurement' | 'annotation'
  x: number
  y: number
  width: number
  height: number
  color: string
  label: string
  confidence: number
}

export function InteractiveVisualAnalysis() {
  const { data: session } = useSession()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [overlays, setOverlays] = useState<VisualOverlay[]>([])
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('SAMPLE_QUALITY')
  const [error, setError] = useState('')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analysisTypes = [
    { value: 'SAMPLE_QUALITY', label: 'Sample Quality', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500' },
    { value: 'EQUIPMENT_CONDITION', label: 'Equipment Condition', icon: <Settings className="w-4 h-4" />, color: 'bg-blue-500' },
    { value: 'CULTURE_GROWTH', label: 'Culture Growth', icon: <BarChart3 className="w-4 h-4" />, color: 'bg-purple-500' },
    { value: 'CONTAMINATION_DETECTION', label: 'Contamination', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-500' },
    { value: 'MICROSCOPY_INTERPRETATION', label: 'Microscopy', icon: <Eye className="w-4 h-4" />, color: 'bg-orange-500' }
  ]

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setError('')
      }
      reader.readAsDataURL(file)
    } else {
      setError('Please select a valid image file')
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string)
          setError('')
        }
        reader.readAsDataURL(file)
      } else {
        setError('Please select a valid image file')
      }
    }
  }, [])

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload an image first')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      // Simulate analysis with visual feedback
      await simulateAnalysis()
    } catch (error) {
      setError('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const simulateAnalysis = async () => {
    // Simulate real-time analysis with visual overlays
    const mockResults: AnalysisResult[] = [
      {
        id: '1',
        type: 'sample_quality',
        confidence: 0.85,
        boundingBox: { x: 100, y: 100, width: 200, height: 150 },
        description: 'Sample appears healthy with good cell density',
        severity: 'low',
        recommendations: ['Continue monitoring', 'Maintain current conditions']
      },
      {
        id: '2',
        type: 'contamination',
        confidence: 0.92,
        boundingBox: { x: 300, y: 200, width: 100, height: 80 },
        description: 'Potential contamination detected in upper right quadrant',
        severity: 'high',
        recommendations: ['Isolate affected area', 'Review sterile technique', 'Consider antibiotics']
      }
    ]

    // Add visual overlays gradually
    for (let i = 0; i < mockResults.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const result = mockResults[i]
      const overlay: VisualOverlay = {
        id: result.id,
        type: 'detection',
        x: result.boundingBox.x,
        y: result.boundingBox.y,
        width: result.boundingBox.width,
        height: result.boundingBox.height,
        color: result.severity === 'high' ? '#ef4444' : result.severity === 'medium' ? '#f59e0b' : '#10b981',
        label: result.type,
        confidence: result.confidence
      }
      
      setOverlays(prev => [...prev, overlay])
      setAnalysisResults(prev => [...prev, result])
    }
  }

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2
      return Math.min(Math.max(newZoom, 0.5), 3)
    })
  }

  const handleReset = () => {
    setZoom(1)
    setImagePosition({ x: 0, y: 0 })
    setOverlays([])
    setAnalysisResults([])
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interactive Visual Analysis</h2>
          <p className="text-gray-600 mt-1">
            Upload images and get real-time AI analysis with visual overlays
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Brain className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Analysis Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Image Analysis</span>
              </CardTitle>
              <CardDescription>
                Upload an image and watch AI analyze it in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              {!selectedImage ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <Camera className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload Laboratory Image</p>
                      <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Display with Overlays */}
                  <div className="relative border rounded-lg overflow-hidden bg-gray-100">
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={selectedImage}
                        alt="Analysis target"
                        className="w-full h-auto"
                        style={{
                          transform: `scale(${zoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      
                      {/* Analysis Overlays */}
                      {overlays.map((overlay) => (
                        <div
                          key={overlay.id}
                          className="absolute border-2 border-dashed animate-pulse"
                          style={{
                            left: overlay.x,
                            top: overlay.y,
                            width: overlay.width,
                            height: overlay.height,
                            borderColor: overlay.color,
                            backgroundColor: `${overlay.color}20`
                          }}
                        >
                          <div
                            className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded"
                            style={{ backgroundColor: overlay.color }}
                          >
                            {overlay.label} ({Math.round(overlay.confidence * 100)}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleZoom('out')}
                        disabled={zoom <= 0.5}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleZoom('in')}
                        disabled={zoom >= 3}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>AI Analysis in Progress</span>
                        <span>{overlays.length} / 2 detections</span>
                      </div>
                      <Progress value={(overlays.length / 2) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          {/* Analysis Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedAnalysisType === type.value ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedAnalysisType(type.value)}
                  >
                    <div className={`w-4 h-4 rounded-full ${type.color} mr-2`}></div>
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          {analysisResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getSeverityColor(result.severity)}>
                          {result.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {Math.round(result.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm font-medium">{result.description}</p>
                      <div className="space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2 text-xs">
                            <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Mark for Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 