'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X,
  Mail,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Settings
} from 'lucide-react'

interface NotificationTemplate {
  id: string
  name: string
  type: string
  subject: string
  body: string
  htmlBody: string
  smsBody?: string
  variables: Record<string, any>
  isActive: boolean
  version: number
  createdAt: string
  updatedAt: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = () => {
    const newTemplate: Partial<NotificationTemplate> = {
      name: '',
      type: 'CALIBRATION_DUE',
      subject: '',
      body: '',
      htmlBody: '',
      smsBody: '',
      variables: {},
      isActive: true
    }
    setEditingTemplate(newTemplate as NotificationTemplate)
    setShowEditor(true)
  }

  const editTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setShowEditor(true)
  }

  const saveTemplate = async () => {
    if (!editingTemplate) return

    try {
      const method = editingTemplate.id ? 'PUT' : 'POST'
      const url = editingTemplate.id 
        ? `/api/notifications/templates/${editingTemplate.id}`
        : '/api/notifications/templates'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate)
      })

      if (response.ok) {
        await fetchTemplates()
        setShowEditor(false)
        setEditingTemplate(null)
      }
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      await fetch(`/api/notifications/templates/${templateId}`, {
        method: 'DELETE'
      })
      await fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CALIBRATION_DUE':
      case 'CALIBRATION_OVERDUE':
        return <Calendar className="w-4 h-4 text-orange-600" />
      case 'EQUIPMENT_FAILURE':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'COMPLIANCE_ALERT':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'SYSTEM_NOTIFICATION':
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Mail className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CALIBRATION_DUE':
      case 'CALIBRATION_OVERDUE':
        return 'bg-orange-100 text-orange-800'
      case 'EQUIPMENT_FAILURE':
        return 'bg-red-100 text-red-800'
      case 'COMPLIANCE_ALERT':
        return 'bg-yellow-100 text-yellow-800'
      case 'SYSTEM_NOTIFICATION':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderPreview = (template: NotificationTemplate) => {
    const sampleData = {
      userName: 'John Doe',
      equipmentName: 'Analytical Balance AB-001',
      dueDate: '2024-01-15',
      laboratoryName: 'Main Laboratory',
      calibrationType: 'Periodic',
      priority: 'High'
    }

    let previewHtml = template.htmlBody
    Object.entries(sampleData).forEach(([key, value]) => {
      previewHtml = previewHtml.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })

    return previewHtml
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">
            Create and manage notification email templates
          </p>
        </div>
        
        <button
          onClick={createTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(template.type)}
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(template.type)}`}>
                    {template.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editTemplate(template)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Edit template"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Preview template"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {template.subject}
              </p>

              {previewMode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                  <div 
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderPreview(template) }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-sm text-gray-600">
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  v{template.version}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Editor Modal */}
      {showEditor && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTemplate.id ? 'Edit Template' : 'Create Template'}
                </h2>
                <button
                  onClick={() => setShowEditor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <select
                    value={editingTemplate.type}
                    onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, type: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CALIBRATION_DUE">Calibration Due</option>
                    <option value="CALIBRATION_OVERDUE">Calibration Overdue</option>
                    <option value="EQUIPMENT_FAILURE">Equipment Failure</option>
                    <option value="COMPLIANCE_ALERT">Compliance Alert</option>
                    <option value="SYSTEM_NOTIFICATION">System Notification</option>
                    <option value="TEAM_ACTIVITY">Team Activity</option>
                    <option value="REPORT_GENERATED">Report Generated</option>
                    <option value="BILLING_ALERT">Billing Alert</option>
                  </select>
                </div>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email subject"
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body (HTML)
                </label>
                <textarea
                  value={editingTemplate.htmlBody}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, htmlBody: e.target.value } : null)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter HTML email body. Use {{variableName}} for dynamic content."
                />
              </div>

              {/* Plain Text Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plain Text Body
                </label>
                <textarea
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, body: e.target.value } : null)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter plain text email body"
                />
              </div>

              {/* SMS Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Body (Optional)
                </label>
                <textarea
                  value={editingTemplate.smsBody || ''}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, smsBody: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter SMS message (shorter version for mobile)"
                />
              </div>

              {/* Available Variables */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Available Variables</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <code className="bg-white px-2 py-1 rounded border">{'{{userName}}'}</code>
                  <code className="bg-white px-2 py-1 rounded border">{'{{equipmentName}}'}</code>
                  <code className="bg-white px-2 py-1 rounded border">{'{{dueDate}}'}</code>
                  <code className="bg-white px-2 py-1 rounded border">{'{{laboratoryName}}'}</code>
                  <code className="bg-white px-2 py-1 rounded border">{'{{calibrationType}}'}</code>
                  <code className="bg-white px-2 py-1 rounded border">{'{{priority}}'}</code>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingTemplate.isActive}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Template is active
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 