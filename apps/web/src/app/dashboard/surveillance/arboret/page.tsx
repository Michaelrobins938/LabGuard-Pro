'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  MapPin,
  Globe
} from 'lucide-react';
import { ArboNETUploadData, ArboNETSpeciesEntry } from '@/types/surveillance';

export default function ArboNETUpload() {
  const [uploadData, setUploadData] = useState<ArboNETUploadData>({
    countyCode: '',
    weekEnding: new Date(),
    speciesData: []
  });

  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [newSpecies, setNewSpecies] = useState<ArboNETSpeciesEntry>({
    species: '',
    count: 0,
    location: '',
    latitude: undefined,
    longitude: undefined,
    trapType: '',
    collectionDate: ''
  });

  const addSpecies = () => {
    if (newSpecies.species && newSpecies.count > 0) {
      setUploadData({
        ...uploadData,
        speciesData: [...uploadData.speciesData, { ...newSpecies }]
      });
      setNewSpecies({
        species: '',
        count: 0,
        location: '',
        latitude: undefined,
        longitude: undefined,
        trapType: '',
        collectionDate: ''
      });
    }
  };

  const removeSpecies = (index: number) => {
    setUploadData({
      ...uploadData,
      speciesData: uploadData.speciesData.filter((_, i) => i !== index)
    });
  };

  const uploadToArboNET = async () => {
    setLoading(true);
    setUploadStatus('uploading');

    try {
      const response = await fetch('/api/surveillance/arboret/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      });

      if (response.ok) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('ArboNET upload failed:', error);
      setUploadStatus('error');
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
      case 'uploading':
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
      case 'uploading':
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
          <h1 className="text-3xl font-bold">ArboNET Upload</h1>
          <p className="text-gray-600 mt-1">Upload vector surveillance data to CDC ArboNET</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(uploadStatus)}>
            {getStatusIcon(uploadStatus)}
            <span className="ml-1 capitalize">{uploadStatus}</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="species">Species Data</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ArboNET Configuration</CardTitle>
              <CardDescription>
                Configure parameters for CDC ArboNET data upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countyCode">County Code</Label>
                  <Input
                    id="countyCode"
                    value={uploadData.countyCode}
                    onChange={(e) => setUploadData({ ...uploadData, countyCode: e.target.value })}
                    placeholder="e.g., 439 (Tarrant County)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={uploadData.weekEnding.toISOString().split('T')[0]}
                    onChange={(e) => setUploadData({ ...uploadData, weekEnding: new Date(e.target.value) })}
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

        <TabsContent value="species" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Species Data Management</CardTitle>
              <CardDescription>
                Add and manage vector species data for ArboNET upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Species Form */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Add New Species Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="species">Species</Label>
                    <select
                      id="species"
                      value={newSpecies.species}
                      onChange={(e) => setNewSpecies({ ...newSpecies, species: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select species</option>
                      <option value="Culex quinquefasciatus">Culex quinquefasciatus</option>
                      <option value="Culex pipiens">Culex pipiens</option>
                      <option value="Aedes aegypti">Aedes aegypti</option>
                      <option value="Aedes albopictus">Aedes albopictus</option>
                      <option value="Anopheles quadrimaculatus">Anopheles quadrimaculatus</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="count">Count</Label>
                    <Input
                      id="count"
                      type="number"
                      value={newSpecies.count}
                      onChange={(e) => setNewSpecies({ ...newSpecies, count: parseInt(e.target.value) || 0 })}
                      placeholder="Number of specimens"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newSpecies.location}
                      onChange={(e) => setNewSpecies({ ...newSpecies, location: e.target.value })}
                      placeholder="Collection location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={newSpecies.latitude || ''}
                      onChange={(e) => setNewSpecies({ ...newSpecies, latitude: parseFloat(e.target.value) || undefined })}
                      placeholder="Decimal degrees"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={newSpecies.longitude || ''}
                      onChange={(e) => setNewSpecies({ ...newSpecies, longitude: parseFloat(e.target.value) || undefined })}
                      placeholder="Decimal degrees"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trapType">Trap Type</Label>
                    <select
                      id="trapType"
                      value={newSpecies.trapType}
                      onChange={(e) => setNewSpecies({ ...newSpecies, trapType: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select trap type</option>
                      <option value="CDC Light Trap">CDC Light Trap</option>
                      <option value="Gravid Trap">Gravid Trap</option>
                      <option value="BG-Sentinel">BG-Sentinel</option>
                      <option value="Ovitrap">Ovitrap</option>
                      <option value="Resting Trap">Resting Trap</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collectionDate">Collection Date</Label>
                    <Input
                      id="collectionDate"
                      type="date"
                      value={newSpecies.collectionDate}
                      onChange={(e) => setNewSpecies({ ...newSpecies, collectionDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button onClick={addSpecies} disabled={!newSpecies.species || newSpecies.count <= 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Species Data
                  </Button>
                </div>
              </div>

              {/* Species Data Table */}
              {uploadData.speciesData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Species Data ({uploadData.speciesData.length} entries)</h3>
                    <Button variant="outline" size="sm" onClick={() => setUploadData({ ...uploadData, speciesData: [] })}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Species</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Count</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Coordinates</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Trap Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Collection Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {uploadData.speciesData.map((species, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm font-medium">{species.species}</td>
                              <td className="px-4 py-2 text-sm">
                                <Badge variant="secondary">{species.count}</Badge>
                              </td>
                              <td className="px-4 py-2 text-sm">{species.location}</td>
                              <td className="px-4 py-2 text-sm">
                                {species.latitude && species.longitude 
                                  ? `${species.latitude.toFixed(4)}, ${species.longitude.toFixed(4)}`
                                  : 'Not specified'
                                }
                              </td>
                              <td className="px-4 py-2 text-sm">{species.trapType}</td>
                              <td className="px-4 py-2 text-sm">{species.collectionDate}</td>
                              <td className="px-4 py-2 text-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSpecies(index)}
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

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ArboNET Upload</CardTitle>
              <CardDescription>
                Upload vector surveillance data to CDC ArboNET system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>County Code</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {uploadData.countyCode || 'Not specified'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Week Ending</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {uploadData.weekEnding.toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Species Entries</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {uploadData.speciesData.length} entries
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Summary</Label>
                  <div className="p-4 bg-blue-50 rounded border">
                    <ul className="space-y-1 text-sm">
                      <li>• County: {uploadData.countyCode}</li>
                      <li>• Week Ending: {uploadData.weekEnding.toLocaleDateString()}</li>
                      <li>• Total Species Entries: {uploadData.speciesData.length}</li>
                      <li>• Total Specimens: {uploadData.speciesData.reduce((sum, s) => sum + s.count, 0)}</li>
                      <li>• Unique Species: {new Set(uploadData.speciesData.map(s => s.species)).size}</li>
                      <li>• Trap Types: {new Set(uploadData.speciesData.map(s => s.trapType)).size}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={uploadToArboNET} 
                    disabled={loading || uploadData.speciesData.length === 0 || !uploadData.countyCode}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to ArboNET
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Preview Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>
                View previous ArboNET uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upload history available</p>
                <p className="text-sm text-gray-400">Upload history will appear here after successful uploads</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 