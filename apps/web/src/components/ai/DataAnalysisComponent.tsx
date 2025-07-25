'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  BarChart3, 
  Upload, 
  Play, 
  Download, 
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Brain,
  Eye,
  Settings,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DataAnalysisResult {
  id: string
  dataType: string
  analysisType: string
  results: {
    summary: string
    insights: string[]
    recommendations: string[]
    qualityScore: number
    confidence: number
    anomalies: string[]
    trends: string[]
  }
  metadata: {
    dataPoints: number
    timeRange: string
    format: string
    timestamp: Date
  }
}

const dataTypes = [
  { value: 'SEQUENCING', label: 'Sequencing Data', icon: <FileText className="w-4 h-4" /> },
  { value: 'FLOW_CYTOMETRY', label: 'Flow Cytometry', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'MICROSCOPY', label: 'Microscopy Images', icon: <Eye className="w-4 h-4" /> },
  { value: 'PCR', label: 'PCR Results', icon: <Activity className="w-4 h-4" /> },
  { value: 'CELL_CULTURE', label: 'Cell Culture Data', icon: <Settings className="w-4 h-4" /> }
]

const analysisTypes = [
  { value: 'STATISTICAL', label: 'Statistical Analysis', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'QUALITY_CONTROL', label: 'Quality Control', icon: <CheckCircle className="w-4 h-4" /> },
  { value: 'TREND_ANALYSIS', label: 'Trend Analysis', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'ANOMALY_DETECTION', label: 'Anomaly Detection', icon: <AlertCircle className="w-4 h-4" /> }
]

export function DataAnalysisComponent() {
  const { data: session } = useSession()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DataAnalysisResult | null>(null)
  const [error, setError] = useState('')

  // Form state
  const [dataType, setDataType] = useState('')
  const [analysisType, setAnalysisType] = useState('')
  const [dataInput, setDataInput] = useState('')

  const handleAnalyzeData = async () => {
    if (!dataType || !analysisType || !dataInput) {
      setError('Please fill in all required fields')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/biomni/data/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`
        },
        body: JSON.stringify({
          dataType,
          analysisType,
          data: dataInput
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Data analysis failed')
      }
    } catch (error) {
      setError('Failed to analyze data. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExportResults = () => {
    if (!analysisResult) return

    const resultsText = `
# Data Analysis Results

## Analysis Details
- **Data Type:** ${analysisResult.dataType}
- **Analysis Type:** ${analysisResult.analysisType}
- **Data Points:** ${analysisResult.metadata.dataPoints}
- **Time Range:** ${analysisResult.metadata.timeRange}
- **Quality Score:** ${analysisResult.results.qualityScore}%
- **Confidence:** ${(analysisResult.results.confidence * 100).toFixed(1)}%

## Summary
${analysisResult.results.summary}

## Key Insights
${analysisResult.results.insights.map(insight => `- ${insight}`).join('\n')}

## Recommendations
${analysisResult.results.recommendations.map(rec => `- ${rec}`).join('\n')}

## Anomalies Detected
${analysisResult.results.anomalies.length > 0 
  ? analysisResult.results.anomalies.map(anomaly => `- ${anomaly}`).join('\n')
  : 'No anomalies detected'
}

## Trends Identified
${analysisResult.results.trends.map(trend => `- ${trend}`).join('\n')}
    `.trim()

    const blob = new Blob([resultsText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data_analysis_${analysisResult.dataType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          <h2 className="text-2xl font-bold text-gray-900">Data Analysis</h2>
          <p className="text-gray-600 mt-1">
            Analyze research data with AI-powered insights
          </p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          <Brain className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Data Input</span>
            </CardTitle>
            <CardDescription>
              Upload or paste your research data for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-type">Data Type *</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((type) => (
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

            <div className="space-y-2">
              <Label htmlFor="analysis-type">Analysis Type *</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
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

            <div className="space-y-2">
              <Label htmlFor="data-input">Data Input *</Label>
              <Textarea
                id="data-input"
                placeholder="Paste your data here or upload a file..."
                rows={8}
                value={dataInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDataInput(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </Button>
              <Button 
                onClick={handleAnalyzeData}
                disabled={!dataType || !analysisType || !dataInput || isAnalyzing}
                className="flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Analyze Data</span>
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Analysis Preview</span>
            </CardTitle>
            <CardDescription>
              Preview the analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Analysis Summary</h3>
                  <p className="text-sm text-gray-600">{analysisResult.results.summary}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{analysisResult.dataType}</Badge>
                    <Badge variant="outline">{analysisResult.analysisType}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getQualityColor(analysisResult.results.qualityScore)}`}>
                      {analysisResult.results.qualityScore}%
                    </div>
                    <div className="text-sm text-gray-600">Quality Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getConfidenceColor(analysisResult.results.confidence)}`}>
                      {(analysisResult.results.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">AI Confidence</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Key Insights</h4>
                    <div className="space-y-1 mt-1">
                      {analysisResult.results.insights.slice(0, 3).map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">Anomalies</h4>
                    <div className="space-y-1 mt-1">
                      {analysisResult.results.anomalies.length > 0 ? (
                        analysisResult.results.anomalies.slice(0, 2).map((anomaly, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>{anomaly}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>No anomalies detected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExportResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>No analysis results yet</p>
                  <p className="text-sm">Upload data and click analyze</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Detailed Analysis</span>
            </CardTitle>
            <CardDescription>
              Comprehensive analysis results and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="insights" className="space-y-4">
              <TabsList>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                <div className="space-y-4">
                  {analysisResult.results.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Insight {index + 1}</h4>
                        <p className="text-sm text-gray-600">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-4">
                  {analysisResult.results.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Brain className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recommendation {index + 1}</h4>
                        <p className="text-sm text-gray-600">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="anomalies" className="space-y-4">
                <div className="space-y-4">
                  {analysisResult.results.anomalies.length > 0 ? (
                    analysisResult.results.anomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Anomaly {index + 1}</h4>
                          <p className="text-sm text-gray-600">{anomaly}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-8 bg-green-50 rounded-lg">
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-green-800">No Anomalies Detected</h4>
                        <p className="text-sm text-green-600">Your data appears to be within normal parameters</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <div className="space-y-4">
                  {analysisResult.results.trends.map((trend, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Trend {index + 1}</h4>
                        <p className="text-sm text-gray-600">{trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 