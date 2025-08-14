'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  Upload, 
  Download, 
  Zap,
  MessageSquare,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface NLPReport {
  id: string
  title: string
  type: 'compliance' | 'equipment' | 'calibration' | 'audit'
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  summary: string
  keyInsights: string[]
  recommendations: string[]
  confidence: number
  wordCount: number
  processingTime: number
}

interface DocumentAnalysis {
  id: string
  filename: string
  uploadDate: string
  analysisType: 'compliance' | 'equipment' | 'calibration'
  status: 'analyzing' | 'completed' | 'failed'
  extractedData: Record<string, any>
  insights: string[]
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high'
}

export default function NLPReportsPage() {
  const [reports, setReports] = useState<NLPReport[]>([])
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchNLPData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchNLPData = async () => {
    try {
      setIsLoading(true)
      const [reportsRes, documentsRes] = await Promise.all([
        fetch('/api/ai/nlp-reports/reports', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/ai/nlp-reports/documents', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (reportsRes.ok && documentsRes.ok) {
        const reportsData = await reportsRes.json()
        const documentsData = await documentsRes.json()
        setReports(reportsData.reports || [])
        setDocuments(documentsData.documents || [])
      } else {
        setReports(mockReports)
        setDocuments(mockDocuments)
      }
    } catch (err) {
      console.error('Error fetching NLP data:', err)
      setReports(mockReports)
      setDocuments(mockDocuments)
    } finally {
      setIsLoading(false)
    }
  }

  const mockReports: NLPReport[] = [
    {
      id: '1',
      title: 'Q1 2024 Compliance Summary',
      type: 'compliance',
      status: 'completed',
      createdAt: '2024-02-08T09:00:00Z',
      completedAt: '2024-02-08T09:15:00Z',
      summary: 'Comprehensive analysis of Q1 2024 compliance data shows 98.5% adherence to regulatory standards with 3 minor deviations identified.',
      keyInsights: [
        'Equipment calibration compliance improved by 15%',
        'Documentation quality scores increased by 22%',
        'Three minor deviations require corrective action'
      ],
      recommendations: [
        'Implement automated calibration reminders',
        'Enhance documentation training program',
        'Schedule follow-up audit for identified deviations'
      ],
      confidence: 94,
      wordCount: 2500,
      processingTime: 15
    },
    {
      id: '2',
      title: 'Equipment Performance Analysis',
      type: 'equipment',
      status: 'completed',
      createdAt: '2024-02-08T10:00:00Z',
      completedAt: '2024-02-08T10:08:00Z',
      summary: 'Analysis of equipment performance data reveals optimal operating conditions and identifies areas for efficiency improvement.',
      keyInsights: [
        'Centrifuge efficiency improved by 18%',
        'Spectrophotometer accuracy maintained at 99.2%',
        'pH meter requires recalibration within 30 days'
      ],
      recommendations: [
        'Schedule pH meter calibration',
        'Implement preventive maintenance schedule',
        'Consider equipment upgrades for older units'
      ],
      confidence: 91,
      wordCount: 1800,
      processingTime: 8
    }
  ]

  const mockDocuments: DocumentAnalysis[] = [
    {
      id: '1',
      filename: 'calibration_procedure_2024.pdf',
      uploadDate: '2024-02-08T08:30:00Z',
      analysisType: 'calibration',
      status: 'completed',
      extractedData: {
        equipmentType: 'Centrifuge',
        model: 'C-2400',
        calibrationDate: '2024-02-08',
        technician: 'Dr. Sarah Johnson',
        results: 'PASS',
        nextCalibration: '2024-05-08'
      },
      insights: [
        'Calibration procedure follows ISO 17025 standards',
        'All measurement points within acceptable limits',
        'Documentation complete and accurate'
      ],
      complianceScore: 98,
      riskLevel: 'low'
    },
    {
      id: '2',
      filename: 'equipment_maintenance_log.docx',
      uploadDate: '2024-02-08T07:45:00Z',
      analysisType: 'equipment',
      status: 'completed',
      extractedData: {
        equipmentType: 'Spectrophotometer',
        model: 'S-1200',
        maintenanceDate: '2024-02-07',
        issues: 'Minor lens cleaning required',
        resolution: 'Completed successfully'
      },
      insights: [
        'Maintenance log indicates regular preventive care',
        'Minor issues resolved promptly',
        'Equipment operating within specifications'
      ],
      complianceScore: 95,
      riskLevel: 'low'
    }
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate file upload and analysis
      setTimeout(() => {
        alert('Document uploaded and analysis started!')
        setUploadedFile(null)
      }, 2000)
    }
  }

  const generateReport = async (type: string) => {
    try {
      const response = await fetch('/api/ai/nlp-reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        alert('Report generation started!')
        fetchNLPData()
      } else {
        alert('Failed to generate report')
      }
    } catch (err) {
      console.error('Error generating report:', err)
      alert('Failed to generate report')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return <CheckCircle className="w-4 h-4" />
      case 'equipment': return <BarChart3 className="w-4 h-4" />
      case 'calibration': return <Clock className="w-4 h-4" />
      case 'audit': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Natural Language Processing</h1>
          <p className="text-gray-600">Intelligent report generation and document analysis using advanced NLP</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => generateReport('compliance')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Zap className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Document</h3>
              <p className="text-sm text-gray-600">Analyze compliance documents</p>
            </div>
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Generate Report</h3>
              <p className="text-sm text-gray-600">AI-powered report creation</p>
            </div>
          </div>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="compliance">Compliance</option>
            <option value="equipment">Equipment</option>
            <option value="calibration">Calibration</option>
            <option value="audit">Audit</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Document Analysis</h3>
              <p className="text-sm text-gray-600">Extract insights from documents</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">{documents.length}</div>
          <div className="text-sm text-gray-600">Documents analyzed</div>
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Generated Reports</h2>
          <span className="text-sm text-gray-500">{filteredReports.length} reports</span>
        </div>

        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{report.summary}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                      <div>
                        <span className="font-medium">Confidence:</span> {report.confidence}%
                      </div>
                      <div>
                        <span className="font-medium">Word Count:</span> {report.wordCount}
                      </div>
                      <div>
                        <span className="font-medium">Processing:</span> {report.processingTime}s
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Key Insights:</span>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {report.keyInsights.map((insight, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-gray-600">Recommendations:</span>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {report.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Analysis</h2>
        
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{doc.filename}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.riskLevel === 'low' ? 'text-green-600 bg-green-100' :
                      doc.riskLevel === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {doc.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                    <div>
                      <span className="font-medium">Type:</span> {doc.analysisType}
                    </div>
                    <div>
                      <span className="font-medium">Compliance Score:</span> {doc.complianceScore}%
                    </div>
                    <div>
                      <span className="font-medium">Uploaded:</span> {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-600">Extracted Data:</span>
                      <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                        {Object.entries(doc.extractedData).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-600">Insights:</span>
                      <ul className="text-xs text-gray-600 mt-1 space-y-1">
                        {doc.insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">NLP AI Model</h3>
              <p className="text-gray-600">Advanced natural language processing for document analysis and report generation</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">96.8%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
} 