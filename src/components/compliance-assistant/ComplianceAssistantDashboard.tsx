'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, FileText, Upload, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useComplianceAssistant } from '../hooks/useComplianceAssistant';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { DocumentUploader } from './DocumentUploader';
import { ViolationsTable } from './ViolationsTable';
import { RecommendationsPanel } from './RecommendationsPanel';
import { AuditChecklistViewer } from './AuditChecklistViewer';
import { ComplianceAnalytics } from './ComplianceAnalytics';
import { DailyLogManager } from './DailyLogManager';

interface ComplianceOverview {
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalViolations: number;
  resolvedViolations: number;
  pendingRecommendations: number;
  checklistProgress: number;
  lastAuditDate: string | null;
  nextAuditDue: string | null;
  trends: {
    scoreChange: number;
    violationTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    complianceRate: number;
  };
}

export const ComplianceAssistantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    documents,
    violations,
    recommendations,
    checklistItems,
    auditReports,
    uploadDocument,
    analyzeDocument,
    resolveViolation,
    generateAuditChecklist,
    generateAuditReport,
    isUploading,
    isAnalyzing
  } = useComplianceAssistant();

  // Real-time updates
  useRealTimeUpdates('compliance', {
    onDocumentUploaded: (data) => {
      toast.success(`${data.count} document(s) uploaded successfully`);
    },
    onAnalysisCompleted: (data) => {
      toast.success(`Analysis completed for ${data.fileName}`);
      if (data.violationsFound > 0) {
        toast.warning(`${data.violationsFound} violations found`, {
          action: {
            label: 'View Details',
            onClick: () => setActiveTab('violations')
          }
        });
      }
    },
    onViolationResolved: (data) => {
      toast.success(`Violation "${data.violationTitle}" resolved by ${data.resolvedBy}`);
    },
    onChecklistGenerated: (data) => {
      toast.success(`Audit checklist generated with ${data.itemCount} items`);
    }
  });

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/compliance-assistant/analytics/overview');
      if (!response.ok) throw new Error('Failed to load overview');
      
      const data = await response.json();
      setOverview(data.data);
    } catch (error) {
      console.error('Error loading compliance overview:', error);
      toast.error('Failed to load compliance overview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (files: File[]) => {
    try {
      await uploadDocument(files);
      toast.success(`${files.length} document(s) uploaded and analysis started`);
      loadOverview(); // Refresh overview
    } catch (error) {
      toast.error('Failed to upload documents');
    }
  };

  const handleViolationResolve = async (violationId: string, resolutionData: any) => {
    try {
      await resolveViolation(violationId, resolutionData);
      toast.success('Violation resolved successfully');
      loadOverview();
    } catch (error) {
      toast.error('Failed to resolve violation');
    }
  };

  const handleGenerateChecklist = async (auditType: string, focusAreas: string[]) => {
    try {
      await generateAuditChecklist(auditType, focusAreas);
      toast.success('Audit checklist generated successfully');
      setActiveTab('checklist');
    } catch (error) {
      toast.error('Failed to generate audit checklist');
    }
  };

  const handleGenerateReport = async (reportConfig: any) => {
    try {
      const report = await generateAuditReport(reportConfig);
      toast.success('Audit report generated successfully');
      
      // Offer to download the report
      toast.success('Report ready for download', {
        action: {
          label: 'Download',
          onClick: () => window.open(`/api/compliance-assistant/audit/reports/${report.reportId}/download`)
        }
      });
    } catch (error) {
      toast.error('Failed to generate audit report');
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(overview.overallScore)}`}>
                {overview.overallScore.toFixed(1)}%
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>
                  {overview.trends.scoreChange >= 0 ? '+' : ''}
                  {overview.trends.scoreChange.toFixed(1)}% from last period
                </span>
              </div>
              <Progress 
                value={overview.overallScore} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge className={getRiskBadgeColor(overview.riskLevel)}>
                {overview.riskLevel}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Based on {overview.totalViolations} total violations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Violations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.totalViolations - overview.resolvedViolations}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview.resolvedViolations} resolved of {overview.totalViolations} total
              </p>
              <Progress 
                value={(overview.resolvedViolations / overview.totalViolations) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.checklistProgress.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Next audit: {overview.nextAuditDue ? 
                  new Date(overview.nextAuditDue).toLocaleDateString() : 
                  'Not scheduled'
                }
              </p>
              <Progress 
                value={overview.checklistProgress} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="checklist">Audit Checklist</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceAnalytics />
            <DailyLogManager />
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents for Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUploader 
                  onUpload={handleDocumentUpload}
                  isUploading={isUploading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.slice(0, 10).map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          doc.analysisStatus === 'COMPLETED' ? 'default' :
                          doc.analysisStatus === 'PROCESSING' ? 'secondary' :
                          doc.analysisStatus === 'FAILED' ? 'destructive' : 'outline'
                        }>
                          {doc.analysisStatus}
                        </Badge>
                        {doc.analysisStatus === 'COMPLETED' && (
                          <Badge className={getRiskBadgeColor(doc.riskLevel || 'LOW')}>
                            {doc.violationsFound} violations
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => analyzeDocument(doc.id)}
                          disabled={doc.analysisStatus === 'PROCESSING' || isAnalyzing}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="violations">
          <ViolationsTable 
            violations={violations}
            onResolve={handleViolationResolve}
          />
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationsPanel 
            recommendations={recommendations}
          />
        </TabsContent>

        <TabsContent value="checklist">
          <AuditChecklistViewer 
            items={checklistItems}
            onGenerateChecklist={handleGenerateChecklist}
          />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Reports
                </CardTitle>
                <Button onClick={() => handleGenerateReport({
                  reportType: 'INTERNAL_AUDIT',
                  auditPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  auditPeriodEnd: new Date(),
                  includeRecommendations: true
                })}>
                  Generate New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.generatedAt).toLocaleDateString()} • 
                        Score: {report.overallScore.toFixed(1)}% • 
                        {report.totalViolations} violations
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        report.status === 'APPROVED' ? 'default' :
                        report.status === 'REVIEW' ? 'secondary' : 'outline'
                      }>
                        {report.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/api/compliance-assistant/audit/reports/${report.id}/download`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 