'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  Settings,
  Users,
  Activity,
  ExternalLink,
  Brain,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Compliance system components are now integrated directly in the dashboard

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIBanner, setShowAIBanner] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Compliance Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor and manage laboratory compliance across all operational areas
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/resources/documentation/compliance-tools">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </Link>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Configure Tools
            </Button>
          </div>
        </div>
      </div>

      {/* AI Integration Banner */}
      {showAIBanner && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4 mr-2" />
          <AlertDescription>
            <strong>AI-Powered Compliance Monitoring!</strong> Our AI system can automatically detect compliance issues, suggest corrective actions, and generate audit reports. 
            <Button variant="outline" size="sm" className="ml-2" onClick={() => setShowAIBanner(false)}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-xs text-green-600">+2.1% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tools</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-blue-600">All systems operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-yellow-600">Requires attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Audit Readiness</p>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
                <p className="text-xs text-purple-600">Ready for inspection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="samples">Samples</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="audit">Audit Prep</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Temperature Calibration Completed</p>
                        <p className="text-xs text-gray-600">Incubator #3 - 2 hours ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Passed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm">pH Meter Calibration Due</p>
                        <p className="text-xs text-gray-600">pH Meter #2 - Due in 3 days</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Sample Collection Protocol Updated</p>
                        <p className="text-xs text-gray-600">Blood Collection - 1 day ago</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Compliance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Equipment Calibration</span>
                      <span className="text-sm text-gray-600">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sample Handling</span>
                      <span className="text-sm text-gray-600">92.3%</span>
                    </div>
                    <Progress value={92.3} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Result Validation</span>
                      <span className="text-sm text-gray-600">98.1%</span>
                    </div>
                    <Progress value={98.1} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Audit Preparation</span>
                      <span className="text-sm text-gray-600">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Access to Documentation
              </CardTitle>
              <CardDescription>
                Access comprehensive documentation for all compliance tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/resources/documentation/compliance-tools">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">All Tools</p>
                          <p className="text-xs text-gray-600">Complete documentation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/resources/documentation/compliance-tools?category=equipment-calibration">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Settings className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Equipment</p>
                          <p className="text-xs text-gray-600">Calibration tools</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/resources/documentation/compliance-tools?category=sample-handling">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Samples</p>
                          <p className="text-xs text-gray-600">Handling protocols</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/resources/documentation/compliance-tools?category=audit-preparation">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Audit Prep</p>
                          <p className="text-xs text-gray-600">Preparation tools</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Temperature Calibration', status: 'active', progress: 100 },
              { name: 'pH Meter Calibration', status: 'active', progress: 95 },
              { name: 'Balance Calibration', status: 'active', progress: 88 },
              { name: 'Pipette Calibration', status: 'active', progress: 92 },
              { name: 'Microscope Calibration', status: 'active', progress: 100 },
              { name: 'Centrifuge Calibration', status: 'active', progress: 85 }
            ].map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>
                    Equipment calibration validation tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance</span>
                      <Badge className={tool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {tool.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Progress value={tool.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Samples Tab */}
        <TabsContent value="samples" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Sample Collection', status: 'active', progress: 94 },
              { name: 'Sample Storage', status: 'active', progress: 98 },
              { name: 'Sample Transport', status: 'active', progress: 91 },
              { name: 'Sample Preparation', status: 'active', progress: 96 },
              { name: 'Sample Disposal', status: 'active', progress: 89 },
              { name: 'Chain of Custody', status: 'active', progress: 100 }
            ].map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>
                    Sample handling validation tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance</span>
                      <Badge className={tool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {tool.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Progress value={tool.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Result Accuracy', status: 'active', progress: 98 },
              { name: 'Quality Control', status: 'active', progress: 97 },
              { name: 'Method Validation', status: 'active', progress: 95 },
              { name: 'Data Integrity', status: 'active', progress: 100 },
              { name: 'Report Generation', status: 'active', progress: 93 },
              { name: 'Result Interpretation', status: 'active', progress: 96 }
            ].map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>
                    Result validation tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance</span>
                      <Badge className={tool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {tool.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Progress value={tool.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Documentation Compliance', status: 'active', progress: 96 },
              { name: 'Personnel Qualification', status: 'active', progress: 94 },
              { name: 'Facility Compliance', status: 'active', progress: 98 },
              { name: 'Equipment Inventory', status: 'active', progress: 92 },
              { name: 'Quality Management', status: 'active', progress: 95 },
              { name: 'Audit Trail', status: 'active', progress: 100 }
            ].map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>
                    Audit preparation tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance</span>
                      <Badge className={tool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {tool.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Progress value={tool.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 