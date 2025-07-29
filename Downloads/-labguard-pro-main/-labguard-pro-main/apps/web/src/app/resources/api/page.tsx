'use client'

import React, { useState } from 'react'
import { 
  Code, 
  Database, 
  Shield, 
  Zap, 
  Brain, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Copy,
  ExternalLink,
  Terminal,
  Key,
  Lock,
  Globe,
  Download,
  BookOpen,
  Users,
  Settings,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function APIReferencePage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('authentication')
  const [copiedCode, setCopiedCode] = useState('')

  const endpoints = [
    {
      id: 'authentication',
      name: 'Authentication',
      description: 'Secure API access with JWT tokens',
      icon: Key,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      description: 'Biomni AI integration endpoints',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'Regulatory compliance monitoring',
      icon: Shield,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Real-time data analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'equipment',
      name: 'Equipment',
      description: 'Laboratory equipment management',
      icon: Settings,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'protocols',
      name: 'Protocols',
      description: 'Experimental protocol management',
      icon: BookOpen,
      color: 'from-teal-500 to-cyan-500'
    }
  ]

  const codeExamples = {
    authentication: `curl -X POST https://api.labguardpro.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "scientist@lab.com",
    "password": "secure_password"
  }'

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}`,
    'ai-assistant': `curl -X POST https://api.labguardpro.com/v1/ai/chat \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Design a PCR protocol for gene expression analysis",
    "context": "molecular_biology",
    "temperature": 0.7
  }'

// Response
{
  "response": "Here's an optimized PCR protocol for gene expression analysis...",
  "protocol": {
    "steps": [...],
    "materials": [...],
    "timing": "2-3 hours"
  },
  "confidence": 0.95
}`,
    compliance: `curl -X GET https://api.labguardpro.com/v1/compliance/status \\
  -H "Authorization: Bearer YOUR_TOKEN"

// Response
{
  "status": "compliant",
  "last_audit": "2024-01-15T10:30:00Z",
  "next_audit": "2024-04-15T10:30:00Z",
  "violations": [],
  "certifications": [
    "FDA_APPROVED",
    "CLIA_CERTIFIED",
    "ISO_17025"
  ]
}`,
    analytics: `curl -X POST https://api.labguardpro.com/v1/analytics/experiment \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "experiment_id": "exp_12345",
    "data_points": [...],
    "metrics": ["accuracy", "precision", "recall"]
  }'

// Response
{
  "analysis": {
    "accuracy": 0.987,
    "precision": 0.994,
    "recall": 0.976,
    "confidence_interval": [0.982, 0.992]
  },
  "recommendations": [...]
}`,
    equipment: `curl -X GET https://api.labguardpro.com/v1/equipment/status \\
  -H "Authorization: Bearer YOUR_TOKEN"

// Response
{
  "equipment": [
    {
      "id": "eq_001",
      "name": "Thermal Cycler",
      "status": "operational",
      "last_calibration": "2024-01-10T09:00:00Z",
      "next_calibration": "2024-02-10T09:00:00Z",
      "usage_hours": 1247.5
    }
  ]
}`,
    protocols: `curl -X POST https://api.labguardpro.com/v1/protocols/create \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "PCR Amplification Protocol",
    "category": "molecular_biology",
    "steps": [...],
    "materials": [...],
    "safety_notes": [...]
  }'

// Response
{
  "protocol_id": "prot_67890",
  "version": "1.0",
  "created_at": "2024-01-15T14:30:00Z",
  "status": "active",
  "approval_status": "approved"
}`
  }

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(endpoint)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">API Reference</h1>
                <p className="text-gray-400">Complete API documentation for LabGuard Pro</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download SDK
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                Interactive Docs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">API Endpoints</h3>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      selectedEndpoint === endpoint.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${endpoint.color} rounded-lg flex items-center justify-center`}>
                        <endpoint.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{endpoint.name}</div>
                        <div className="text-xs text-gray-400">{endpoint.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className={selectedEndpoint === endpoint.id ? 'block' : 'hidden'}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${endpoint.color} rounded-lg flex items-center justify-center`}>
                      <endpoint.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{endpoint.name}</h2>
                      <p className="text-gray-300">{endpoint.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* API Endpoint Info */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">Base URL</span>
                        </div>
                        <code className="text-sm text-gray-300">https://api.labguardpro.com/v1</code>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-white">Authentication</span>
                        </div>
                        <code className="text-sm text-gray-300">Bearer Token</code>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-white">Rate Limit</span>
                        </div>
                        <code className="text-sm text-gray-300">1000 requests/hour</code>
                      </div>
                    </div>

                    {/* Code Example */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Code Example</h3>
                        <button
                          onClick={() => copyToClipboard(codeExamples[endpoint.id as keyof typeof codeExamples], endpoint.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                          {copiedCode === endpoint.id ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copiedCode === endpoint.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-slate-800 border border-white/10 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{codeExamples[endpoint.id as keyof typeof codeExamples]}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Response Schema */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Response Schema</h3>
                      <div className="bg-slate-800 border border-white/10 rounded-lg p-4">
                        <pre className="text-sm text-gray-300">
{`{
  "status": "success",
  "data": {
    // Response data structure
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Error Handling */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Error Handling</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-400">401 Unauthorized</span>
                          </div>
                          <p className="text-sm text-gray-300">Invalid or expired authentication token</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-400">429 Rate Limited</span>
                          </div>
                          <p className="text-sm text-gray-300">Too many requests, please try again later</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SDK Downloads */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">SDK Downloads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Python SDK</h3>
              </div>
              <p className="text-gray-300 mb-4">Official Python client library for LabGuard Pro API</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                Download Python SDK
              </button>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">JavaScript SDK</h3>
              </div>
              <p className="text-gray-300 mb-4">Official JavaScript/Node.js client library</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                Download JS SDK
              </button>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">R SDK</h3>
              </div>
              <p className="text-gray-300 mb-4">Official R client library for data scientists</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                Download R SDK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}