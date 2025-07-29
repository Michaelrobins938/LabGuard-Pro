import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Shield, ExternalLink, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resources - LabGuard Pro',
  description: 'Documentation, API reference, and support resources for LabGuard Pro.',
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Resources</h1>
          <p className="text-xl text-gray-300">
            Everything you need to get the most out of LabGuard Pro
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Documentation
              </CardTitle>
              <CardDescription>
                Access comprehensive guides and technical documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available Guides</span>
                  <Badge>12+</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>User Manuals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>API Documentation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Best Practices</span>
                  </div>
                </div>
                <Button className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance Tools
              </CardTitle>
              <CardDescription>
                Comprehensive laboratory compliance validation system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available Tools</span>
                  <Badge>24</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Equipment Calibration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Sample Handling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Result Validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Audit Preparation</span>
                  </div>
                </div>
                <Link href="/resources/documentation/compliance-tools">
                  <Button className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    View Compliance Tools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* API Reference */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">API Reference</h3>
            <p className="text-gray-300 mb-6">
              Complete API documentation for integrating LabGuard Pro with your existing systems.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ REST API</li>
              <li>✓ Webhooks</li>
              <li>✓ SDK Libraries</li>
              <li>✓ Code Examples</li>
            </ul>
            <button className="enhanced-button-primary w-full">View API</button>
          </div>

          {/* Support Center */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">Support Center</h3>
            <p className="text-gray-300 mb-6">
              Get help when you need it with our comprehensive support resources and team.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Knowledge Base</li>
              <li>✓ Video Tutorials</li>
              <li>✓ Live Chat</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="enhanced-button-primary w-full">Get Support</button>
          </div>
        </div>
      </div>
    </div>
  )
} 