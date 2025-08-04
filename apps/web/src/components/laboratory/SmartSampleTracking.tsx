'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  QrCode,
  Barcode,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Edit,
  Save,
  X,
  Download,
  Upload,
  Eye,
  Settings,
  Users,
  FileText,
  Database,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Globe,
  BarChart3,
  Calendar,
  Timer,
  ArrowRight,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Sample {
  id: string;
  qrCode: string;
  barcode: string;
  sampleType: string;
  priority: 'STAT' | 'routine' | 'bioterrorism' | 'research';
  status: 'collected' | 'in_transit' | 'received' | 'processing' | 'completed' | 'error';
  location: string;
  collectedBy: string;
  collectedDate: string;
  receivedDate?: string;
  completedDate?: string;
  chainOfCustody: CustodyEvent[];
  county: string;
  patientId?: string;
  testType: string;
  notes?: string;
  temperature?: number;
  humidity?: number;
  lastUpdated: string;
}

interface CustodyEvent {
  id: string;
  timestamp: string;
  action: 'collected' | 'transferred' | 'received' | 'processed' | 'completed';
  person: string;
  location: string;
  notes?: string;
  signature?: string;
}

interface Location {
  id: string;
  name: string;
  type: 'collection' | 'transit' | 'laboratory' | 'storage';
  county: string;
  temperature?: number;
  humidity?: number;
  capacity: number;
  currentCount: number;
  status: 'active' | 'inactive' | 'maintenance';
}

const SmartSampleTracking = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedSample, setSelectedSample] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCounty, setFilterCounty] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    setSamples([
      {
        id: 'SAMPLE-001',
        qrCode: 'QR-SAMPLE-001-2024',
        barcode: 'BC-SAMPLE-001-2024',
        sampleType: 'Blood',
        priority: 'STAT',
        status: 'processing',
        location: 'PCR Lab - Station 3',
        collectedBy: 'Dr. Sarah Johnson',
        collectedDate: '2024-01-07 08:30',
        receivedDate: '2024-01-07 09:15',
        county: 'Tarrant',
        patientId: 'P-12345',
        testType: 'West Nile PCR',
        temperature: 4.2,
        humidity: 45,
        lastUpdated: '2024-01-07 14:30',
        chainOfCustody: [
          {
            id: 'custody-001',
            timestamp: '2024-01-07 08:30',
            action: 'collected',
            person: 'Dr. Sarah Johnson',
            location: 'Tarrant County Hospital',
            notes: 'STAT sample - suspected West Nile case'
          },
          {
            id: 'custody-002',
            timestamp: '2024-01-07 09:15',
            action: 'received',
            person: 'Lab Tech Mike Chen',
            location: 'Public Health Lab',
            notes: 'Sample received and logged into LIMS'
          },
          {
            id: 'custody-003',
            timestamp: '2024-01-07 10:00',
            action: 'processed',
            person: 'Lab Tech Mike Chen',
            location: 'PCR Lab - Station 3',
            notes: 'Sample prepared for PCR analysis'
          }
        ]
      },
      {
        id: 'SAMPLE-002',
        qrCode: 'QR-SAMPLE-002-2024',
        barcode: 'BC-SAMPLE-002-2024',
        sampleType: 'Mosquito Pool',
        priority: 'routine',
        status: 'received',
        location: 'Vector Lab - Freezer A',
        collectedBy: 'Field Tech Lisa Rodriguez',
        collectedDate: '2024-01-07 07:00',
        receivedDate: '2024-01-07 11:30',
        county: 'Dallas',
        testType: 'Mosquito Surveillance',
        temperature: -80.0,
        humidity: 30,
        lastUpdated: '2024-01-07 11:30',
        chainOfCustody: [
          {
            id: 'custody-004',
            timestamp: '2024-01-07 07:00',
            action: 'collected',
            person: 'Field Tech Lisa Rodriguez',
            location: 'Dallas County Park',
            notes: 'Mosquito pool collection - trap #DAL-2024-001'
          },
          {
            id: 'custody-005',
            timestamp: '2024-01-07 11:30',
            action: 'received',
            person: 'Lab Tech Amanda Wilson',
            location: 'Vector Lab',
            notes: 'Mosquito pool received and stored at -80°C'
          }
        ]
      },
      {
        id: 'SAMPLE-003',
        qrCode: 'QR-SAMPLE-003-2024',
        barcode: 'BC-SAMPLE-003-2024',
        sampleType: 'Serum',
        priority: 'bioterrorism',
        status: 'collected',
        location: 'Emergency Response Lab',
        collectedBy: 'Dr. Robert Kim',
        collectedDate: '2024-01-07 13:45',
        county: 'Tarrant',
        patientId: 'P-67890',
        testType: 'Anthrax Screening',
        lastUpdated: '2024-01-07 13:45',
        chainOfCustody: [
          {
            id: 'custody-006',
            timestamp: '2024-01-07 13:45',
            action: 'collected',
            person: 'Dr. Robert Kim',
            location: 'Emergency Department',
            notes: 'Bioterrorism screening - suspected exposure'
          }
        ]
      }
    ]);

    setLocations([
      {
        id: 'loc-001',
        name: 'PCR Lab - Station 3',
        type: 'laboratory',
        county: 'Tarrant',
        temperature: 22.0,
        humidity: 45,
        capacity: 50,
        currentCount: 12,
        status: 'active'
      },
      {
        id: 'loc-002',
        name: 'Vector Lab - Freezer A',
        type: 'storage',
        county: 'Dallas',
        temperature: -80.0,
        humidity: 30,
        capacity: 200,
        currentCount: 45,
        status: 'active'
      },
      {
        id: 'loc-003',
        name: 'Emergency Response Lab',
        type: 'laboratory',
        county: 'Tarrant',
        temperature: 20.0,
        humidity: 40,
        capacity: 20,
        currentCount: 3,
        status: 'active'
      }
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT': return 'bg-red-500';
      case 'bioterrorism': return 'bg-orange-500';
      case 'routine': return 'bg-blue-500';
      case 'research': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'received': return 'bg-yellow-500';
      case 'in_transit': return 'bg-orange-500';
      case 'collected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Play className="w-4 h-4" />;
      case 'received': return <Clock className="w-4 h-4" />;
      case 'in_transit': return <ArrowRight className="w-4 h-4" />;
      case 'collected': return <Plus className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.collectedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || sample.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || sample.status === filterStatus;
    const matchesCounty = filterCounty === 'all' || sample.county === filterCounty;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesCounty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Sample Tracking</h1>
          <p className="text-gray-600 mt-2">
            End-to-end sample tracking with QR codes, chain of custody, and real-time monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <QrCode className="w-4 h-4" />
            <span>QR Enabled</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Chain of Custody</span>
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Sample ID, Patient ID, or Collector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="STAT">STAT</option>
                <option value="routine">Routine</option>
                <option value="bioterrorism">Bioterrorism</option>
                <option value="research">Research</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="collected">Collected</option>
                <option value="in_transit">In Transit</option>
                <option value="received">Received</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">County</label>
              <select
                value={filterCounty}
                onChange={(e) => setFilterCounty(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">All Counties</option>
                <option value="Tarrant">Tarrant</option>
                <option value="Dallas">Dallas</option>
                <option value="Collin">Collin</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Sample Tracking ({filteredSamples.length} samples)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSamples.map((sample) => (
              <div key={sample.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-1">
                        <QrCode className="w-6 h-6 text-gray-600" />
                      </div>
                      <p className="text-xs font-medium">{sample.qrCode}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">{sample.id}</h4>
                      <p className="text-sm text-gray-500">
                        {sample.sampleType} • {sample.testType} • {sample.county} County
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(sample.priority)} text-white`}>
                      {sample.priority}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(sample.status)}`} />
                      <span className="capitalize">{sample.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">{sample.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Collected By</p>
                    <p className="text-sm font-medium">{sample.collectedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium">{sample.lastUpdated}</p>
                  </div>
                </div>

                {sample.temperature && (
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">Temperature:</span>
                      <span className="font-medium">{sample.temperature}°C</span>
                    </div>
                    {sample.humidity && (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">Humidity:</span>
                        <span className="font-medium">{sample.humidity}%</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => setSelectedSample(sample.id)}
                    variant={selectedSample === sample.id ? 'default' : 'outline'}
                  >
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <QrCode className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Details */}
      {selectedSample && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Sample Details: {selectedSample}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const sample = samples.find(s => s.id === selectedSample);
              if (!sample) return null;

              return (
                <div className="space-y-6">
                  {/* Sample Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Sample Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Sample ID:</span>
                          <span className="font-medium">{sample.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">QR Code:</span>
                          <span className="font-medium">{sample.qrCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Barcode:</span>
                          <span className="font-medium">{sample.barcode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Sample Type:</span>
                          <span className="font-medium">{sample.sampleType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Test Type:</span>
                          <span className="font-medium">{sample.testType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Priority:</span>
                          <Badge className={`${getPriorityColor(sample.priority)} text-white`}>
                            {sample.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Location & Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Location:</span>
                          <span className="font-medium">{sample.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(sample.status)}`} />
                            <span className="capitalize">{sample.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">County:</span>
                          <span className="font-medium">{sample.county}</span>
                        </div>
                        {sample.patientId && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Patient ID:</span>
                            <span className="font-medium">{sample.patientId}</span>
                          </div>
                        )}
                        {sample.temperature && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Temperature:</span>
                            <span className="font-medium">{sample.temperature}°C</span>
                          </div>
                        )}
                        {sample.humidity && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Humidity:</span>
                            <span className="font-medium">{sample.humidity}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chain of Custody */}
                  <div>
                    <h4 className="font-medium mb-3">Chain of Custody</h4>
                    <div className="space-y-3">
                      {sample.chainOfCustody.map((event, index) => (
                        <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium capitalize">{event.action.replace('_', ' ')}</h5>
                              <span className="text-sm text-gray-500">{event.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600">{event.person}</p>
                            <p className="text-sm text-gray-600">{event.location}</p>
                            {event.notes && (
                              <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Sample
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Location Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{location.name}</h4>
                  <Badge variant={location.status === 'active' ? 'default' : 'secondary'}>
                    {location.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{location.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>County:</span>
                    <span>{location.county}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samples:</span>
                    <span>{location.currentCount}/{location.capacity}</span>
                  </div>
                  {location.temperature && (
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span>{location.temperature}°C</span>
                    </div>
                  )}
                  {location.humidity && (
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span>{location.humidity}%</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <Progress value={(location.currentCount / location.capacity) * 100} className="w-full" />
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
              <Plus className="w-5 h-5" />
              <span className="text-xs">Add Sample</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <QrCode className="w-5 h-5" />
              <span className="text-xs">Scan QR</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Download className="w-5 h-5" />
              <span className="text-xs">Export Data</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Configure</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSampleTracking; 