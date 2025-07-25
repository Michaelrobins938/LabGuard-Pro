'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Settings, 
  Code, 
  BookOpen,
  ExternalLink,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Import the compliance tools data
const complianceTools = [
  // Equipment Calibration System
  {
    id: 'temperature-calibration',
    name: 'Temperature Calibration Validator',
    category: 'Equipment Calibration',
    description: 'Validates temperature-sensitive equipment calibration against regulatory standards',
    technicalSpec: 'ISO 17025:2017 Section 6.4.1, ASTM E220-19',
    complianceCriteria: [
      'Accuracy: ±0.1°C from NIST-traceable reference',
      'Stability: Drift rate < 0.05°C/hour',
      'Uncertainty: Expanded uncertainty ≤ 0.2°C (k=2)',
      'Calibration Interval: Maximum 12 months or as per manufacturer specification'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4.1 (Equipment)',
      'ASTM E220-19 (Temperature Measurement)',
      'CLIA 42 CFR 493.1253 (Equipment Requirements)'
    ],
    implementationDetails: [
      'Reference Standard Validation: Cross-references against NIST SRM 1968',
      'Drift Analysis: Implements linear regression analysis for trend detection',
      'Uncertainty Calculation: Uses GUM methodology for uncertainty propagation',
      'Calibration Scheduling: Automated scheduling based on equipment type and usage'
    ],
    validationAlgorithm: `interface TemperatureValidation {
  referenceTemperature: number; // NIST-traceable reference
  measuredTemperature: number;  // Equipment reading
  tolerance: number;            // Acceptable deviation (±0.1°C)
  driftRate: number;           // Temperature drift per hour
  uncertainty: number;         // Expanded uncertainty (k=2)
}`,
    useCases: [
      'Thermometer calibration validation',
      'Incubator temperature monitoring',
      'Refrigerator temperature control',
      'Freezer temperature stability',
      'Water bath temperature accuracy',
      'Environmental chamber validation'
    ],
    benefits: [
      'Automated compliance checking against NIST standards',
      'Real-time drift detection and alerting',
      'Comprehensive uncertainty analysis',
      'Automated calibration scheduling',
      'Regulatory compliance reporting',
      'Integration with equipment monitoring systems'
    ],
    requirements: [
      'NIST-traceable reference thermometer',
      'Temperature measurement equipment',
      'Stable temperature environment',
      'Data logging capabilities',
      'Calibration interval tracking',
      'Documentation system access'
    ],
    status: 'active',
    version: '1.0.0',
    lastUpdated: '2025-01-15',
    nextReview: '2025-07-15'
  },
  // Add more tools here...
  {
    id: 'ph-calibration',
    name: 'pH Meter Calibration System',
    category: 'Equipment Calibration',
    description: 'Multi-point pH calibration system implementing NIST-traceable buffer solutions',
    technicalSpec: 'ISO 17025:2017, ASTM D1293-18',
    complianceCriteria: [
      'Slope: 95-105% of theoretical Nernst slope (59.16 mV/pH at 25°C)',
      'Offset: ±0.02 pH units from theoretical zero point',
      'Response Time: ≤ 30 seconds to 95% of final reading',
      'Reproducibility: Standard deviation ≤ 0.01 pH units'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4.1',
      'ASTM D1293-18 (pH Measurement)',
      'EPA Method 150.1 (pH Determination)'
    ],
    implementationDetails: [
      'Multi-point Calibration: Minimum 3-point calibration with temperature compensation',
      'Slope Calculation: Linear regression analysis of mV vs pH',
      'Electrode Performance: Continuous monitoring of electrode response characteristics',
      'Temperature Compensation: Automatic temperature correction using Arrhenius equation'
    ],
    validationAlgorithm: `interface pHValidation {
  bufferSolutions: BufferSolution[];
  slope: number;              // Electrode slope (95-105% ideal)
  offset: number;             // Zero point offset
  responseTime: number;       // Time to 95% of final reading
  reproducibility: number;    // Standard deviation of repeated measurements
}`,
    useCases: [
      'pH meter calibration validation',
      'Buffer solution verification',
      'Electrode performance monitoring',
      'Temperature compensation validation',
      'Multi-point calibration verification',
      'Electrode maintenance scheduling'
    ],
    benefits: [
      'Automated multi-point calibration validation',
      'Real-time electrode performance monitoring',
      'Temperature compensation algorithms',
      'Buffer solution verification',
      'Calibration certificate generation',
      'Maintenance scheduling automation'
    ],
    requirements: [
      'NIST-traceable buffer solutions (pH 4.01, 7.00, 10.01)',
      'pH meter with temperature compensation',
      'Calibrated temperature sensor',
      'Stable temperature environment',
      'Clean electrode maintenance',
      'Documentation system access'
    ],
    status: 'active',
    version: '1.0.0',
    lastUpdated: '2025-01-15',
    nextReview: '2025-07-15'
  }
];

export default function ToolDetailPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  
  const tool = complianceTools.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">The requested compliance tool could not be found.</p>
          <Link href="/resources/documentation/compliance-tools">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Beta</Badge>;
      case 'planned':
        return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/resources/documentation/compliance-tools">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              {getStatusBadge(tool.status)}
            </div>
            <p className="text-lg text-gray-600 mb-4">{tool.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Category: {tool.category}</span>
              <span>Version: {tool.version}</span>
              <span>Last Updated: {tool.lastUpdated}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button>
              <ExternalLink className="w-4 h-4 mr-2" />
              Access Tool
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Technical Specification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{tool.technicalSpec}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Validation Algorithm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{tool.validationAlgorithm}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Implementation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tool.implementationDetails.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Compliance Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tool.complianceCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Regulatory Standards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tool.regulatoryStandards.map((standard, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{standard}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Implementation Tab */}
        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>
                Step-by-step guide for implementing this compliance tool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Phase 1: Setup and Configuration</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Install and configure the compliance tool</li>
                    <li>Set up user permissions and access controls</li>
                    <li>Configure integration with existing laboratory systems</li>
                    <li>Establish baseline measurements and reference standards</li>
                  </ol>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Phase 2: Validation and Testing</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Perform initial validation runs with known standards</li>
                    <li>Verify compliance criteria and acceptance limits</li>
                    <li>Test integration with equipment and data systems</li>
                    <li>Validate reporting and documentation capabilities</li>
                  </ol>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Phase 3: Production Deployment</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Deploy to production environment</li>
                    <li>Train laboratory personnel on tool usage</li>
                    <li>Establish monitoring and alerting systems</li>
                    <li>Begin regular compliance monitoring and reporting</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Use Cases Tab */}
        <TabsContent value="use-cases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Common Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{useCase}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    User Manual
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Code className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuration Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Training Videos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Knowledge Base
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Support Portal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>Document Version: {tool.version}</p>
            <p>Last Updated: {tool.lastUpdated}</p>
            <p>Next Review: {tool.nextReview}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Report Issue
            </Button>
            <Button variant="outline" size="sm">
              Request Feature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 