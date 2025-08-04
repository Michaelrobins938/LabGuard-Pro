'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText, 
  Settings, 
  Eye, 
  Download, 
  Upload, 
  Calendar,
  Users,
  Database,
  Zap,
  Target,
  Globe,
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
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'CAP' | 'CLIA' | 'EPA' | 'TCEQ' | 'FDA' | 'ISO' | 'State';
  status: 'compliant' | 'non-compliant' | 'pending' | 'warning';
  priority: 'high' | 'medium' | 'low';
  lastChecked: Date;
  nextDue: Date;
  requirements: string[];
  evidence: ComplianceEvidence[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceEvidence {
  id: string;
  type: 'document' | 'test' | 'audit' | 'training' | 'certification';
  name: string;
  description: string;
  uploadDate: Date;
  expiryDate?: Date;
  status: 'valid' | 'expired' | 'pending' | 'invalid';
  fileUrl?: string;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'incident';
  status: 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected';
  generatedDate: Date;
  dueDate: Date;
  agency: string;
  complianceRate: number;
  issues: number;
  recommendations: string[];
}

interface AuditLog {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
  module: string;
  relatedRule?: string;
}

export default function ComplianceCenter() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'reports' | 'audit'>('overview');
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([
    {
      id: 'cap-001',
      name: 'CAP Accreditation Requirements',
      description: 'College of American Pathologists accreditation standards',
      ruleType: 'CAP',
      status: 'compliant',
      priority: 'high',
      lastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      requirements: [
        'Quality Management System',
        'Documented Procedures',
        'Personnel Qualifications',
        'Equipment Calibration',
        'Proficiency Testing'
      ],
      evidence: [
        {
          id: 'ev1',
          type: 'certification',
          name: 'CAP Accreditation Certificate',
          description: 'Current CAP accreditation certificate',
          uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'valid'
        }
      ],
      riskLevel: 'low'
    },
    {
      id: 'clia-001',
      name: 'CLIA Certification Standards',
      description: 'Clinical Laboratory Improvement Amendments requirements',
      ruleType: 'CLIA',
      status: 'compliant',
      priority: 'high',
      lastChecked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      nextDue: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      requirements: [
        'Laboratory Director Qualifications',
        'Quality Control Procedures',
        'Proficiency Testing',
        'Patient Test Management',
        'Quality Assessment'
      ],
      evidence: [
        {
          id: 'ev2',
          type: 'certification',
          name: 'CLIA Certificate',
          description: 'Current CLIA certificate of compliance',
          uploadDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          status: 'valid'
        }
      ],
      riskLevel: 'low'
    },
    {
      id: 'epa-001',
      name: 'EPA Water Testing Standards',
      description: 'Environmental Protection Agency water quality testing requirements',
      ruleType: 'EPA',
      status: 'warning',
      priority: 'medium',
      lastChecked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      requirements: [
        'Method Validation',
        'Quality Control',
        'Data Reporting',
        'Equipment Calibration',
        'Sample Handling'
      ],
      evidence: [
        {
          id: 'ev3',
          type: 'test',
          name: 'Method Validation Report',
          description: 'EPA method validation documentation',
          uploadDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          status: 'expired'
        }
      ],
      riskLevel: 'medium'
    },
    {
      id: 'tceq-001',
      name: 'TCEQ Environmental Standards',
      description: 'Texas Commission on Environmental Quality requirements',
      ruleType: 'TCEQ',
      status: 'non-compliant',
      priority: 'high',
      lastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      nextDue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      requirements: [
        'Environmental Monitoring',
        'Waste Management',
        'Air Quality Standards',
        'Water Discharge Limits',
        'Reporting Requirements'
      ],
      evidence: [],
      riskLevel: 'high'
    },
    {
      id: 'fda-001',
      name: 'FDA Food Safety Standards',
      description: 'Food and Drug Administration food safety testing requirements',
      ruleType: 'FDA',
      status: 'compliant',
      priority: 'medium',
      lastChecked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      nextDue: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      requirements: [
        'Food Safety Testing',
        'HACCP Implementation',
        'Microbiological Testing',
        'Chemical Analysis',
        'Documentation'
      ],
      evidence: [
        {
          id: 'ev4',
          type: 'document',
          name: 'HACCP Plan',
          description: 'Hazard Analysis and Critical Control Points plan',
          uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: 'valid'
        }
      ],
      riskLevel: 'low'
    }
  ]);

  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([
    {
      id: 'rep1',
      name: 'Monthly CAP Compliance Report',
      type: 'monthly',
      status: 'submitted',
      generatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      agency: 'CAP',
      complianceRate: 98.5,
      issues: 2,
      recommendations: [
        'Update equipment calibration schedule',
        'Review personnel training records'
      ]
    },
    {
      id: 'rep2',
      name: 'Quarterly EPA Water Testing Report',
      type: 'quarterly',
      status: 'pending',
      generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      agency: 'EPA',
      complianceRate: 92.0,
      issues: 5,
      recommendations: [
        'Address method validation gaps',
        'Update quality control procedures'
      ]
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'audit1',
      action: 'Compliance Check',
      description: 'Automated compliance check completed for CAP standards',
      user: 'System',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: 'info',
      module: 'CAP',
      relatedRule: 'cap-001'
    },
    {
      id: 'audit2',
      action: 'Evidence Upload',
      description: 'New compliance evidence uploaded for EPA standards',
      user: 'Dr. Sarah Johnson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: 'info',
      module: 'EPA',
      relatedRule: 'epa-001'
    },
    {
      id: 'audit3',
      action: 'Compliance Violation',
      description: 'TCEQ compliance violation detected - immediate action required',
      user: 'System',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      severity: 'critical',
      module: 'TCEQ',
      relatedRule: 'tceq-001'
    }
  ]);

  const filteredRules = complianceRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || rule.ruleType === filterType;
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const overallCompliance = complianceRules.length > 0 
    ? (complianceRules.filter(r => r.status === 'compliant').length / complianceRules.length) * 100
    : 0;

  const criticalIssues = complianceRules.filter(r => r.riskLevel === 'critical' || r.status === 'non-compliant').length;
  const warnings = complianceRules.filter(r => r.status === 'warning').length;
  const upcomingDue = complianceRules.filter(r => {
    const daysUntilDue = Math.ceil((r.nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 30 && daysUntilDue > 0;
  }).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'non-compliant': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'pending': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Center</h1>
          <p className="text-gray-600">Monitor and manage regulatory compliance across all laboratory operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'rules', label: 'Compliance Rules', icon: Shield },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'audit', label: 'Audit Trail', icon: Database }
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
          {/* Compliance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                    <p className="text-2xl font-bold text-gray-900">{overallCompliance.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <Progress value={overallCompliance} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{criticalIssues}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Requires immediate attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Warnings</p>
                    <p className="text-2xl font-bold text-gray-900">{warnings}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Due within 30 days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Due</p>
                    <p className="text-2xl font-bold text-gray-900">{upcomingDue}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Next 30 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Rules Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance Rules Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceRules.slice(0, 6).map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                      <Badge className={getStatusColor(rule.status)}>
                        {rule.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Risk Level:</span>
                        <Badge className={getRiskColor(rule.riskLevel)}>
                          {rule.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next Due:</span>
                        <span className="font-medium">
                          {Math.ceil((rule.nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Evidence:</span>
                        <span className="font-medium">{rule.evidence.length} items</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Audit Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Recent Audit Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSeverityColor(log.severity)}`}>
                      {log.severity === 'critical' && <AlertTriangle className="w-4 h-4" />}
                      {log.severity === 'error' && <AlertCircle className="w-4 h-4" />}
                      {log.severity === 'warning' && <Clock className="w-4 h-4" />}
                      {log.severity === 'info' && <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{log.action}</h4>
                        <Badge variant="outline" className="text-xs">
                          {log.module}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{log.user}</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search compliance rules..."
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
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="CAP">CAP</option>
                      <option value="CLIA">CLIA</option>
                      <option value="EPA">EPA</option>
                      <option value="TCEQ">TCEQ</option>
                      <option value="FDA">FDA</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="compliant">Compliant</option>
                      <option value="non-compliant">Non-Compliant</option>
                      <option value="warning">Warning</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules List */}
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status}
                          </Badge>
                          <Badge className={getRiskColor(rule.riskLevel)}>
                            {rule.riskLevel} risk
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{rule.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                            <ul className="space-y-1">
                              {rule.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {req}
                                </li>
                              ))}
                              {rule.requirements.length > 3 && (
                                <li className="text-sm text-gray-500">
                                  +{rule.requirements.length - 3} more requirements
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Last Checked:</span>
                                <span>{rule.lastChecked.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Next Due:</span>
                                <span className="font-medium">
                                  {Math.ceil((rule.nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence</h4>
                            <div className="space-y-1">
                              {rule.evidence.slice(0, 2).map((evidence) => (
                                <div key={evidence.id} className="flex items-center gap-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${
                                    evidence.status === 'valid' ? 'bg-green-500' : 
                                    evidence.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'
                                  }`} />
                                  <span className="text-gray-600">{evidence.name}</span>
                                </div>
                              ))}
                              {rule.evidence.length > 2 && (
                                <div className="text-sm text-gray-500">
                                  +{rule.evidence.length - 2} more items
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
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Compliance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Agency:</span>
                          <span className="ml-2 font-medium">{report.agency}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Compliance:</span>
                          <span className="ml-2 font-medium">{report.complianceRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Issues:</span>
                          <span className="ml-2 font-medium">{report.issues}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Due:</span>
                          <span className="ml-2 font-medium">{report.dueDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityColor(log.severity)}`}>
                      {log.severity === 'critical' && <AlertTriangle className="w-5 h-5" />}
                      {log.severity === 'error' && <AlertCircle className="w-5 h-5" />}
                      {log.severity === 'warning' && <Clock className="w-5 h-5" />}
                      {log.severity === 'info' && <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{log.action}</h4>
                        <Badge variant="outline" className="text-xs">
                          {log.module}
                        </Badge>
                        {log.relatedRule && (
                          <Badge variant="outline" className="text-xs">
                            Rule: {log.relatedRule}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>User: {log.user}</span>
                        <span>Time: {log.timestamp.toLocaleString()}</span>
                        <span>Severity: {log.severity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 