'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Upload, 
  Calendar,
  Users,
  Activity,
  Target,
  BarChart3,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Barcode,
  Hash,
  CalendarDays,
  Timer,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Wifi,
  WifiOff,
  Server,
  Code,
  Key,
  Link,
  Unlink,
  TestTube,
  FlaskConical,
  Beaker,
  Microscope,
  Brain,
  Send,
  CheckSquare,
  Square,
  Eye,
  Settings,
  Database,
  Globe,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Report {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'incident' | 'surveillance' | 'compliance';
  agency: 'CDC' | 'EPA' | 'TCEQ' | 'FDA' | 'State Health' | 'CAP' | 'CLIA';
  status: 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  submittedDate?: Date;
  approvedDate?: Date;
  generatedDate: Date;
  template: string;
  dataPeriod: {
    start: Date;
    end: Date;
  };
  complianceRate: number;
  issues: number;
  recommendations: string[];
  attachments: Attachment[];
  auditTrail: AuditEvent[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'chart' | 'certification';
  size: number; // bytes
  uploadDate: Date;
  url: string;
}

interface AuditEvent {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  agency: string;
  type: string;
  version: string;
  lastUpdated: Date;
  fields: TemplateField[];
  validationRules: ValidationRule[];
  status: 'active' | 'draft' | 'deprecated';
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  validation?: string;
  options?: string[];
}

interface ValidationRule {
  id: string;
  name: string;
  condition: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface SubmissionQueue {
  id: string;
  reportId: string;
  reportName: string;
  agency: string;
  priority: 'high' | 'medium' | 'low';
  status: 'queued' | 'processing' | 'submitted' | 'failed';
  scheduledTime: Date;
  attempts: number;
  lastAttempt?: Date;
  errorMessage?: string;
}

export default function RegulatoryReporting() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'templates' | 'queue'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgency, setFilterAgency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'rep1',
      name: 'Monthly Water Quality Report',
      type: 'monthly',
      agency: 'EPA',
      status: 'submitted',
      priority: 'medium',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      generatedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      template: 'EPA-Water-Quality-v2.1',
      dataPeriod: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now())
      },
      complianceRate: 98.5,
      issues: 2,
      recommendations: [
        'Update sampling frequency for high-risk locations',
        'Implement additional quality control measures'
      ],
      attachments: [
        {
          id: 'att1',
          name: 'Water Quality Data.xlsx',
          type: 'spreadsheet',
          size: 2048576,
          uploadDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          url: '/reports/attachments/water-quality-data.xlsx'
        },
        {
          id: 'att2',
          name: 'Quality Control Summary.pdf',
          type: 'document',
          size: 512000,
          uploadDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          url: '/reports/attachments/qc-summary.pdf'
        }
      ],
      auditTrail: [
        {
          id: 'audit1',
          action: 'Report Generated',
          user: 'System',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          details: 'Automated report generation completed'
        },
        {
          id: 'audit2',
          action: 'Report Submitted',
          user: 'Dr. Sarah Johnson',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          details: 'Report submitted to EPA via electronic portal'
        }
      ]
    },
    {
      id: 'rep2',
      name: 'Quarterly Clinical Laboratory Report',
      type: 'quarterly',
      agency: 'CLIA',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      template: 'CLIA-Quarterly-v1.5',
      dataPeriod: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now())
      },
      complianceRate: 99.2,
      issues: 1,
      recommendations: [
        'Review proficiency testing procedures',
        'Update personnel training records'
      ],
      attachments: [
        {
          id: 'att3',
          name: 'CLIA Quarterly Data.xlsx',
          type: 'spreadsheet',
          size: 1536000,
          uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          url: '/reports/attachments/clia-quarterly.xlsx'
        }
      ],
      auditTrail: [
        {
          id: 'audit3',
          action: 'Report Generated',
          user: 'System',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          details: 'Automated report generation completed'
        },
        {
          id: 'audit4',
          action: 'Review Required',
          user: 'Dr. Michael Brown',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          details: 'Report requires final review before submission'
        }
      ]
    },
    {
      id: 'rep3',
      name: 'Annual CAP Accreditation Report',
      type: 'annual',
      agency: 'CAP',
      status: 'approved',
      priority: 'medium',
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      submittedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      approvedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      generatedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      template: 'CAP-Annual-v3.0',
      dataPeriod: {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now())
      },
      complianceRate: 100,
      issues: 0,
      recommendations: [
        'Maintain current quality standards',
        'Continue excellent performance'
      ],
      attachments: [
        {
          id: 'att4',
          name: 'CAP Annual Report.pdf',
          type: 'document',
          size: 3072000,
          uploadDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          url: '/reports/attachments/cap-annual.pdf'
        }
      ],
      auditTrail: [
        {
          id: 'audit5',
          action: 'Report Generated',
          user: 'System',
          timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          details: 'Automated report generation completed'
        },
        {
          id: 'audit6',
          action: 'Report Submitted',
          user: 'Dr. Emily Davis',
          timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          details: 'Report submitted to CAP'
        },
        {
          id: 'audit7',
          action: 'Report Approved',
          user: 'CAP Review Board',
          timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          details: 'Report approved with no findings'
        }
      ]
    },
    {
      id: 'rep4',
      name: 'Surveillance Outbreak Report',
      type: 'incident',
      agency: 'CDC',
      status: 'overdue',
      priority: 'high',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      generatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      template: 'CDC-Incident-v1.2',
      dataPeriod: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now())
      },
      complianceRate: 85.0,
      issues: 5,
      recommendations: [
        'Immediate action required for outbreak response',
        'Coordinate with public health officials',
        'Implement enhanced surveillance measures'
      ],
      attachments: [
        {
          id: 'att5',
          name: 'Outbreak Investigation.pdf',
          type: 'document',
          size: 1024000,
          uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          url: '/reports/attachments/outbreak-investigation.pdf'
        }
      ],
      auditTrail: [
        {
          id: 'audit8',
          action: 'Report Generated',
          user: 'System',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          details: 'Automated report generation completed'
        },
        {
          id: 'audit9',
          action: 'Review Required',
          user: 'Dr. Sarah Johnson',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          details: 'Report requires urgent review and submission'
        }
      ]
    }
  ]);

  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: 'temp1',
      name: 'EPA Water Quality Monthly Report',
      description: 'Monthly water quality testing report for EPA compliance',
      agency: 'EPA',
      type: 'monthly',
      version: '2.1',
      lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      fields: [
        { id: 'f1', name: 'Laboratory ID', type: 'text', required: true },
        { id: 'f2', name: 'Reporting Period', type: 'date', required: true },
        { id: 'f3', name: 'Total Samples', type: 'number', required: true },
        { id: 'f4', name: 'Compliance Rate', type: 'number', required: true }
      ],
      validationRules: [
        {
          id: 'v1',
          name: 'Compliance Rate Check',
          condition: 'compliance_rate >= 95',
          message: 'Compliance rate must be at least 95%',
          severity: 'error'
        }
      ],
      status: 'active'
    },
    {
      id: 'temp2',
      name: 'CLIA Quarterly Report',
      description: 'Quarterly clinical laboratory report for CLIA compliance',
      agency: 'CLIA',
      type: 'quarterly',
      version: '1.5',
      lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      fields: [
        { id: 'f5', name: 'Laboratory Director', type: 'text', required: true },
        { id: 'f6', name: 'Test Volume', type: 'number', required: true },
        { id: 'f7', name: 'Quality Control Results', type: 'text', required: true }
      ],
      validationRules: [
        {
          id: 'v2',
          name: 'Test Volume Validation',
          condition: 'test_volume > 0',
          message: 'Test volume must be greater than 0',
          severity: 'error'
        }
      ],
      status: 'active'
    }
  ]);

  const [submissionQueue, setSubmissionQueue] = useState<SubmissionQueue[]>([
    {
      id: 'queue1',
      reportId: 'rep2',
      reportName: 'Quarterly Clinical Laboratory Report',
      agency: 'CLIA',
      priority: 'high',
      status: 'queued',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      attempts: 0
    },
    {
      id: 'queue2',
      reportId: 'rep4',
      reportName: 'Surveillance Outbreak Report',
      agency: 'CDC',
      priority: 'high',
      status: 'processing',
      scheduledTime: new Date(Date.now() - 30 * 60 * 1000),
      attempts: 1,
      lastAttempt: new Date(Date.now() - 15 * 60 * 1000),
      errorMessage: 'Connection timeout - retrying...'
    }
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.agency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgency = filterAgency === 'all' || report.agency === filterAgency;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesAgency && matchesStatus;
  });

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const overdueReports = reports.filter(r => r.status === 'overdue').length;
  const approvedReports = reports.filter(r => r.status === 'approved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'submitted': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'approved': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getAgencyIcon = (agency: string) => {
    switch (agency) {
      case 'CDC': return Shield;
      case 'EPA': return Globe;
      case 'TCEQ': return MapPin;
      case 'FDA': return CheckSquare;
      case 'CAP': return FileText;
      case 'CLIA': return Database;
      default: return FileText;
    }
  };

  const selectedReportData = selectedReport 
    ? reports.find(r => r.id === selectedReport) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Regulatory Reporting Center</h1>
          <p className="text-gray-600">Manage automated regulatory reports and compliance submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'templates', label: 'Templates', icon: Database },
          { id: 'queue', label: 'Submission Queue', icon: Activity }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+3 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Requires attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{overdueReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Immediate action required</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{approvedReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Excellent compliance</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => {
                  const AgencyIcon = getAgencyIcon(report.agency);
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <AgencyIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{report.name}</h4>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{report.agency} • {report.type}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Due: {report.dueDate.toLocaleDateString()}</span>
                            <span>Compliance: {report.complianceRate}%</span>
                            <span>Issues: {report.issues}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">{report.template}</div>
                          <div className="text-xs text-gray-500">
                            {report.generatedDate.toLocaleDateString()}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filterAgency}
                      onChange={(e) => setFilterAgency(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Agencies</option>
                      <option value="CDC">CDC</option>
                      <option value="EPA">EPA</option>
                      <option value="TCEQ">TCEQ</option>
                      <option value="FDA">FDA</option>
                      <option value="CAP">CAP</option>
                      <option value="CLIA">CLIA</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const AgencyIcon = getAgencyIcon(report.agency);
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <AgencyIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                              <p className="text-sm text-gray-600">{report.agency} • {report.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                              <Badge className={getPriorityColor(report.priority)}>
                                {report.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Due:</span>
                                  <span className="font-medium">{report.dueDate.toLocaleDateString()}</span>
                                </div>
                                {report.submittedDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Submitted:</span>
                                    <span>{report.submittedDate.toLocaleDateString()}</span>
                                  </div>
                                )}
                                {report.approvedDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Approved:</span>
                                    <span>{report.approvedDate.toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Compliance</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Rate:</span>
                                  <span className="font-medium">{report.complianceRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Issues:</span>
                                  <span className="font-medium">{report.issues}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Template:</span>
                                  <span className="font-medium">{report.template}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                              <div className="space-y-1">
                                {report.attachments.slice(0, 2).map((attachment) => (
                                  <div key={attachment.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{attachment.name}</span>
                                    <span className="text-gray-500">
                                      {(attachment.size / 1024 / 1024).toFixed(1)}MB
                                    </span>
                                  </div>
                                ))}
                                {report.attachments.length > 2 && (
                                  <div className="text-sm text-gray-500">
                                    +{report.attachments.length - 2} more files
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Report Details */}
      {selectedReportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedReportData.name} - Report Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Report Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agency:</span>
                      <span className="font-medium">{selectedReportData.agency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedReportData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedReportData.status)}>
                        {selectedReportData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge className={getPriorityColor(selectedReportData.priority)}>
                        {selectedReportData.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compliance Rate:</span>
                      <span className="font-medium">{selectedReportData.complianceRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium">{selectedReportData.template}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
} 