'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  MapPin
} from 'lucide-react';
import { NEDSSAutomationData } from '@/types/surveillance';

export default function NEDSSAutomation() {
  const [automationData, setAutomationData] = useState<NEDSSAutomationData>({
    countyCode: '',
    startDate: new Date(),
    endDate: new Date(),
    caseData: []
  });

  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [newCase, setNewCase] = useState({
    patientId: '',
    sampleId: '',
    testType: '',
    result: '',
    collectionDate: '',
    location: ''
  });

  const addCase = () => {
    if (newCase.patientId && newCase.sampleId) {
      setAutomationData({
        ...automationData,
        caseData: [...automationData.caseData, { ...newCase }]
      });
      setNewCase({
        patientId: '',
        sampleId: '',
        testType: '',
        result: '',
        collectionDate: '',
        location: ''
      });
    }
  };

  const removeCase = (index: number) => {
    setAutomationData({
      ...automationData,
      caseData: automationData.caseData.filter((_, i) => i !== index)
    });
  };

  const submitToNEDSS = async () => {
    setLoading(true);
    setSubmissionStatus('submitting');

    try {
      const response = await fetch('/api/surveillance/nedss/automate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(automationData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('NEDSS submission failed:', error);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'submitting':
        return <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'submitting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NEDSS Automation</h1>
          <p className="text-gray-600 mt-1">Automate Texas NEDSS data entry and submissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(submissionStatus)}>
            {getStatusIcon(submissionStatus)}
            <span className="ml-1 capitalize">{submissionStatus}</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="cases">Case Data</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NEDSS Configuration</CardTitle>
              <CardDescription>
                Configure parameters for Texas NEDSS automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countyCode">County Code</Label>
                  <Input
                    id="countyCode"
                    value={automationData.countyCode}
                    onChange={(e) => setAutomationData({ ...automationData, countyCode: e.target.value })}
                    placeholder="e.g., 439 (Tarrant County)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={automationData.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setAutomationData({ ...automationData, startDate: new Date(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={automationData.endDate.toISOString().split('T')[0]}
                    onChange={(e) => setAutomationData({ ...automationData, endDate: new Date(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>County Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>County Name</Label>
                    <Input placeholder="Tarrant County" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Health Department</Label>
                    <Input placeholder="Tarrant County Public Health" disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Data Management</CardTitle>
              <CardDescription>
                Add and manage case data for NEDSS submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Case Form */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Add New Case</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={newCase.patientId}
                      onChange={(e) => setNewCase({ ...newCase, patientId: e.target.value })}
                      placeholder="Patient identifier"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sampleId">Sample ID</Label>
                    <Input
                      id="sampleId"
                      value={newCase.sampleId}
                      onChange={(e) => setNewCase({ ...newCase, sampleId: e.target.value })}
                      placeholder="Sample identifier"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Input
                      id="testType"
                      value={newCase.testType}
                      onChange={(e) => setNewCase({ ...newCase, testType: e.target.value })}
                      placeholder="e.g., WNV PCR"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="result">Result</Label>
                    <select
                      id="result"
                      value={newCase.result}
                      onChange={(e) => setNewCase({ ...newCase, result: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select result</option>
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                      <option value="Indeterminate">Indeterminate</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collectionDate">Collection Date</Label>
                    <Input
                      id="collectionDate"
                      type="date"
                      value={newCase.collectionDate}
                      onChange={(e) => setNewCase({ ...newCase, collectionDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newCase.location}
                      onChange={(e) => setNewCase({ ...newCase, location: e.target.value })}
                      placeholder="Collection location"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button onClick={addCase} disabled={!newCase.patientId || !newCase.sampleId}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Case
                  </Button>
                </div>
              </div>

              {/* Case Data Table */}
              {automationData.caseData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Case Data ({automationData.caseData.length} cases)</h3>
                    <Button variant="outline" size="sm" onClick={() => setAutomationData({ ...automationData, caseData: [] })}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Patient ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sample ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Result</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Collection Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {automationData.caseData.map((caseItem, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm">{caseItem.patientId}</td>
                              <td className="px-4 py-2 text-sm">{caseItem.sampleId}</td>
                              <td className="px-4 py-2 text-sm">{caseItem.testType}</td>
                              <td className="px-4 py-2 text-sm">
                                <Badge variant={caseItem.result === 'Positive' ? 'destructive' : 'secondary'}>
                                  {caseItem.result}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 text-sm">{caseItem.collectionDate}</td>
                              <td className="px-4 py-2 text-sm">{caseItem.location}</td>
                              <td className="px-4 py-2 text-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCase(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NEDSS Submission</CardTitle>
              <CardDescription>
                Submit case data to Texas NEDSS system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>County Code</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {automationData.countyCode || 'Not specified'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {automationData.startDate.toLocaleDateString()} - {automationData.endDate.toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cases to Submit</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {automationData.caseData.length} cases
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Submission Summary</Label>
                  <div className="p-4 bg-blue-50 rounded border">
                    <ul className="space-y-1 text-sm">
                      <li>• County: {automationData.countyCode}</li>
                      <li>• Date Range: {automationData.startDate.toLocaleDateString()} - {automationData.endDate.toLocaleDateString()}</li>
                      <li>• Total Cases: {automationData.caseData.length}</li>
                      <li>• Positive Cases: {automationData.caseData.filter(c => c.result === 'Positive').length}</li>
                      <li>• Negative Cases: {automationData.caseData.filter(c => c.result === 'Negative').length}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={submitToNEDSS} 
                    disabled={loading || automationData.caseData.length === 0 || !automationData.countyCode}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit to NEDSS
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Preview Submission
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
              <CardDescription>
                View previous NEDSS submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No submission history available</p>
                <p className="text-sm text-gray-400">Submission history will appear here after successful submissions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 