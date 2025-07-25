'use client'

import { useState, useEffect } from 'react'
import { 
  Upload, 
  Download, 
  Database, 
  FileText, 
  Users, 
  Settings, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react'

interface DataExport {
  id: string
  name: string
  type: 'equipment' | 'calibrations' | 'users' | 'reports' | 'settings' | 'all'
  format: 'csv' | 'excel' | 'json' | 'pdf'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  size?: string
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  error?: string
}

interface DataImport {
  id: string
  name: string
  type: 'equipment' | 'calibrations' | 'users' | 'settings'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  recordsCount: number
  processedCount: number
  createdAt: string
  completedAt?: string
  errors?: string[]
}

interface ImportTemplate {
  id: string
  name: string
  description: string
  type: 'equipment' | 'calibrations' | 'users' | 'settings'
  icon: React.ReactNode
  color: string
  sampleUrl: string
}

const IMPORT_TEMPLATES: ImportTemplate[] = [
  {
    id: 'equipment-import',
    name: 'Equipment Import',
    description: 'Import equipment data from CSV/Excel files',
    type: 'equipment',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-blue-500',
    sampleUrl: '/api/data-management/templates/equipment-sample.csv'
  },
  {
    id: 'calibrations-import',
    name: 'Calibration History Import',
    description: 'Import calibration records from legacy systems',
    type: 'calibrations',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-green-500',
    sampleUrl: '/api/data-management/templates/calibrations-sample.csv'
  },
  {
    id: 'users-import',
    name: 'User Import',
    description: 'Import users from HR systems or spreadsheets',
    type: 'users',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-500',
    sampleUrl: '/api/data-management/templates/users-sample.csv'
  },
  {
    id: 'settings-import',
    name: 'Settings Import',
    description: 'Import configuration and settings data',
    type: 'settings',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-orange-500',
    sampleUrl: '/api/data-management/templates/settings-sample.json'
  }
]

export default function DataManagementPage() {
  const [selectedImportType, setSelectedImportType] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [importConfig, setImportConfig] = useState<any>({})
  const [isImporting, setIsImporting] = useState(false)
  const [exports, setExports] = useState<DataExport[]>([])
  const [imports, setImports] = useState<DataImport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  useEffect(() => {
    fetchDataManagementHistory()
  }, [])

  const fetchDataManagementHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch exports and imports
      const [exportsResponse, importsResponse] = await Promise.all([
        fetch('/api/data-management/exports', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/data-management/imports', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (!exportsResponse.ok) { throw new Error('Failed to fetch exports') }
      if (!importsResponse.ok) { throw new Error('Failed to fetch imports') }

      const exportsData = await exportsResponse.json()
      const importsData = await importsResponse.json()

      setExports(exportsData.data || [])
      setImports(importsData.data || [])
    } catch (err) {
      console.error('Error fetching data management history:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data management history')
      // Fallback to mock data
      setExports([
        {
          id: '1',
          name: 'Equipment Export - Q1 2024',
          type: 'equipment',
          format: 'csv',
          status: 'completed',
          size: '2.3 MB',
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T10:32:00Z',
          downloadUrl: '/api/data-management/exports/1/download'
        },
        {
          id: '2',
          name: 'Complete Data Backup',
          type: 'all',
          format: 'json',
          status: 'processing',
          createdAt: '2024-01-15T09:15:00Z'
        }
      ])
      setImports([
        {
          id: '1',
          name: 'Equipment Import from Legacy System',
          type: 'equipment',
          status: 'completed',
          recordsCount: 25,
          processedCount: 25,
          createdAt: '2024-01-14T16:45:00Z',
          completedAt: '2024-01-14T16:48:00Z'
        },
        {
          id: '2',
          name: 'User Import from HR System',
          type: 'users',
          status: 'failed',
          recordsCount: 10,
          processedCount: 3,
          createdAt: '2024-01-14T14:20:00Z',
          errors: ['Invalid email format for user@example', 'Duplicate user ID: 12345']
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleImportTypeSelect = (templateId: string) => {
    setSelectedImportType(templateId)
    setUploadedFile(null)
    setImportConfig({})
  }

  const handleStartImport = async () => {
    if (!selectedImportType || !uploadedFile) {
      alert('Please select an import type and upload a file')
      return
    }

    try {
      setIsImporting(true)
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('importType', selectedImportType)
      formData.append('config', JSON.stringify(importConfig))

      const response = await fetch('/api/data-management/imports', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })

      if (!response.ok) { throw new Error('Failed to start import') }
      
      const result = await response.json()
      alert('Import started successfully!')
      
      // Reset form
      setSelectedImportType(null)
      setUploadedFile(null)
      setImportConfig({})
      
      // Refresh history
      fetchDataManagementHistory()
    } catch (err) {
      console.error('Error starting import:', err)
      alert('Failed to start import. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleStartExport = async (type: string, format: string) => {
    try {
      const response = await fetch('/api/data-management/exports', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ type, format })
      })

      if (!response.ok) { throw new Error('Failed to start export') }
      
      const result = await response.json()
      alert('Export started successfully!')
      
      // Refresh history
      fetchDataManagementHistory()
    } catch (err) {
      console.error('Error starting export:', err)
      alert('Failed to start export. Please try again.')
    }
  }

  const handleDownloadExport = async (exportId: string, downloadUrl: string) => {
    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!response.ok) { throw new Error('Failed to download export') }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${exportId}-${Date.now()}.${blob.type.includes('csv') ? 'csv' : 'json'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading export:', err)
      alert('Failed to download export. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">Import and export data in various formats</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Data Import</h2>
              <p className="text-gray-600 mt-1">Import data from CSV, Excel, or JSON files</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-6">
                {IMPORT_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedImportType === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImportTypeSelect(template.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${template.color} text-white`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedImportType && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          CSV, Excel, or JSON files up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showAdvancedOptions ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
                      Advanced Options
                    </button>
                  </div>

                  {showAdvancedOptions && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Skip validation</span>
                        <input
                          type="checkbox"
                          checked={importConfig.skipValidation || false}
                          onChange={(e) => setImportConfig((prev: any) => ({ ...prev, skipValidation: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Create backup before import</span>
                        <input
                          type="checkbox"
                          checked={importConfig.createBackup !== false}
                          onChange={(e) => setImportConfig((prev: any) => ({ ...prev, createBackup: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Notify on completion</span>
                        <input
                          type="checkbox"
                          checked={importConfig.notifyOnCompletion || false}
                          onChange={(e) => setImportConfig((prev: any) => ({ ...prev, notifyOnCompletion: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleStartImport}
                    disabled={!uploadedFile || isImporting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? 'Importing...' : 'Start Import'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Data Export</h2>
              <p className="text-gray-600 mt-1">Export data in various formats</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Equipment Data</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartExport('equipment', 'csv')}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => handleStartExport('equipment', 'excel')}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                    >
                      Export Excel
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Calibration Data</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartExport('calibrations', 'csv')}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => handleStartExport('calibrations', 'excel')}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                    >
                      Export Excel
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Complete Backup</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartExport('all', 'json')}
                      className="flex-1 bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700"
                    >
                      Export JSON
                    </button>
                    <button
                      onClick={() => handleStartExport('all', 'pdf')}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Export History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {exports.map((exportItem) => (
                  <div key={exportItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(exportItem.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exportItem.status)}`}>
                          {exportItem.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(exportItem.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      {exportItem.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="capitalize">
                        {exportItem.type} • {exportItem.format.toUpperCase()}
                      </span>
                      {exportItem.size && <span>{exportItem.size}</span>}
                    </div>

                    {exportItem.status === 'completed' && exportItem.downloadUrl && (
                      <button
                        onClick={() => handleDownloadExport(exportItem.id, exportItem.downloadUrl!)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </button>
                    )}
                  </div>
                ))}

                {exports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Download className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No exports yet</p>
                    <p className="text-sm">Start your first export using the options above</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Import History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Import History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {imports.map((importItem) => (
                  <div key={importItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(importItem.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(importItem.status)}`}>
                          {importItem.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(importItem.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      {importItem.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="capitalize">
                        {importItem.type}
                      </span>
                      <span>
                        {importItem.processedCount} of {importItem.recordsCount} records
                      </span>
                    </div>

                    {importItem.errors && importItem.errors.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        <p className="font-medium mb-1">Errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {importItem.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {imports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No imports yet</p>
                    <p className="text-sm">Start your first import using the templates above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 