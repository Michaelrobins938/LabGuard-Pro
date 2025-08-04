'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Users,
  Globe,
  BarChart3,
  Settings,
  Eye,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Send,
  Save,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SurveillanceData {
  county: string;
  dateRange: string;
  westNileCases: number;
  westNileDeaths: number;
  positiveSamples: number;
  totalSamples: number;
  mosquitoPools: number;
  positivePools: number;
  humanCases: number;
  equineCases: number;
  deadBirds: number;
  positiveBirds: number;
  lastUpdated: string;
  status: 'pending' | 'generated' | 'sent' | 'error';
}

interface ReportTemplate {
  id: string;
  name: string;
  county: string;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  lastGenerated: string;
  status: 'active' | 'inactive';
}

interface LIMSIntegration {
  system: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataTypes: string[];
}

const SurveillanceReportGenerator = () => {
  const [surveillanceData, setSurveillanceData] = useState<SurveillanceData[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [limsIntegrations, setLimsIntegrations] = useState<LIMSIntegration[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<string>('');

  // Mock data for demonstration
  useEffect(() => {
    setSurveillanceData([
      {
        county: 'Tarrant',
        dateRange: '2024-01-01 to 2024-01-07',
        westNileCases: 12,
        westNileDeaths: 2,
        positiveSamples: 45,
        totalSamples: 234,
        mosquitoPools: 156,
        positivePools: 23,
        humanCases: 8,
        equineCases: 3,
        deadBirds: 67,
        positiveBirds: 12,
        lastUpdated: '2024-01-07 14:30',
        status: 'pending'
      },
      {
        county: 'Dallas',
        dateRange: '2024-01-01 to 2024-01-07',
        westNileCases: 8,
        westNileDeaths: 1,
        positiveSamples: 32,
        totalSamples: 189,
        mosquitoPools: 134,
        positivePools: 18,
        humanCases: 5,
        equineCases: 2,
        deadBirds: 45,
        positiveBirds: 8,
        lastUpdated: '2024-01-07 14:30',
        status: 'generated'
      }
    ]);

    setReportTemplates([
      {
        id: 'tarrant-weekly',
        name: 'Tarrant County Weekly Surveillance Report',
        county: 'Tarrant',
        format: 'pdf',
        recipients: ['county.health@tarrantcounty.com', 'state.epi@dshs.texas.gov'],
        lastGenerated: '2024-01-05 16:00',
        status: 'active'
      },
      {
        id: 'dallas-weekly',
        name: 'Dallas County Weekly Surveillance Report',
        county: 'Dallas',
        format: 'excel',
        recipients: ['dallas.health@dallascounty.org', 'state.epi@dshs.texas.gov'],
        lastGenerated: '2024-01-05 16:00',
        status: 'active'
      },
      {
        id: 'texas-nedss',
        name: 'Texas NEDSS Submission',
        county: 'All',
        format: 'csv',
        recipients: ['nedss.submission@dshs.texas.gov'],
        lastGenerated: '2024-01-05 16:00',
        status: 'active'
      },
      {
        id: 'cdc-arbonet',
        name: 'CDC ArboNET Report',
        county: 'All',
        format: 'csv',
        recipients: ['arbonet@cdc.gov'],
        lastGenerated: '2024-01-05 16:00',
        status: 'active'
      }
    ]);

    setLimsIntegrations([
      {
        system: 'LIMS Database',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        dataTypes: ['samples', 'results', 'patients', 'locations']
      },
      {
        system: 'Texas NEDSS',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        dataTypes: ['case_reports', 'surveillance_data']
      },
      {
        system: 'CDC ArboNET',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        dataTypes: ['vector_data', 'human_cases', 'animal_cases']
      }
    ]);
  }, []);

  const generateReport = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation process
    const steps = [
      'Pulling data from LIMS...',
      'Aggregating surveillance data...',
      'Formatting report template...',
      'Generating PDF/Excel...',
      'Sending to recipients...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    setIsGenerating(false);
    setLastGeneration(new Date().toISOString());
    
    // Update template last generated time
    setReportTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplate 
          ? { ...template, lastGenerated: new Date().toISOString() }
          : template
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveillance Report Generator</h1>
          <p className="text-gray-600 mt-2">
            Automated generation and distribution of public health surveillance reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Database className="w-4 h-4" />
            <span>LIMS Connected</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>Multi-County</span>
          </Badge>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>System Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {limsIntegrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{integration.system}</h4>
                  <p className="text-sm text-gray-500">Last sync: {integration.lastSync}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Report Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-500">
                    County: {template.county} • Format: {template.format.toUpperCase()} • 
                    Recipients: {template.recipients.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last generated: {template.lastGenerated}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => setSelectedTemplate(template.id)}
                    variant={selectedTemplate === template.id ? 'default' : 'outline'}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5" />
            <span>Generate Report</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedTemplate && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  Selected: {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  This will generate and automatically send the report to all configured recipients.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Generating report...</span>
                  <span className="text-sm text-gray-500">{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <Button
                onClick={generateReport}
                disabled={!selectedTemplate || isGenerating}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Generate Report</span>
              </Button>
              
              {lastGeneration && (
                <div className="text-sm text-gray-500">
                  Last generated: {new Date(lastGeneration).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surveillance Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Surveillance Data Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surveillanceData.map((data, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{data.county} County</h4>
                  <Badge variant="outline">{data.status}</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>West Nile Cases:</span>
                    <span className="font-medium">{data.westNileCases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positive Samples:</span>
                    <span className="font-medium">{data.positiveSamples}/{data.totalSamples}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mosquito Pools:</span>
                    <span className="font-medium">{data.positivePools}/{data.mosquitoPools}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Human Cases:</span>
                    <span className="font-medium">{data.humanCases}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Last updated: {data.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Download className="w-5 h-5" />
              <span className="text-xs">Export Data</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Mail className="w-5 h-5" />
              <span className="text-xs">Send Manual</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule Reports</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Eye className="w-5 h-5" />
              <span className="text-xs">View History</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveillanceReportGenerator; 