'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  MapPin,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArboNETSpecies {
  species: string;
  count: number;
  location: string;
  latitude?: number;
  longitude?: number;
  trapType: string;
  collectionDate: string;
}

interface ArboNETUpload {
  countyCode: string;
  weekEnding: string;
  speciesData: ArboNETSpecies[];
}

export default function ArboNETUpload() {
  const { toast } = useToast();
  const [upload, setUpload] = useState<ArboNETUpload>({
    countyCode: '',
    weekEnding: '',
    speciesData: []
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
  const [results, setResults] = useState<{
    uploaded: number;
    errors: string[];
    success: boolean;
  } | null>(null);

  const [speciesDataInput, setSpeciesDataInput] = useState('');

  const uploadToArboNET = async () => {
    setIsUploading(true);
    setUploadStatus('uploading');

    try {
      const response = await fetch('/api/surveillance/arboret/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upload)
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('completed');
        setResults(result.data);
        toast({
          title: 'Upload Completed',
          description: `Successfully uploaded ${result.data.uploaded} records to ArboNET.`,
        });
      } else {
        setUploadStatus('error');
        toast({
          title: 'Upload Failed',
          description: result.error || 'Failed to upload to ArboNET.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: 'Upload Error',
        description: 'An error occurred while uploading to ArboNET.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const parseSpeciesData = () => {
    try {
      const lines = speciesDataInput.trim().split('\n');
      const species: ArboNETSpecies[] = [];

      for (const line of lines) {
        if (line.trim()) {
          const [speciesName, count, location, latitude, longitude, trapType, collectionDate] = line.split(',').map(s => s.trim());
          species.push({
            species: speciesName,
            count: parseInt(count) || 0,
            location,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            trapType,
            collectionDate
          });
        }
      }

      setUpload(prev => ({ ...prev, speciesData: species }));
      toast({
        title: 'Data Parsed',
        description: `Successfully parsed ${species.length} species records.`,
      });
    } catch (error) {
      toast({
        title: 'Parse Error',
        description: 'Failed to parse species data. Please check the format.',
        variant: 'destructive',
      });
    }
  };

  const generateCSV = () => {
    if (upload.speciesData.length === 0) {
      toast({
        title: 'No Data',
        description: 'Please parse species data first.',
        variant: 'destructive',
      });
      return;
    }

    // Generate ArboNET CSV format
    const csvHeader = 'COUNTY,WEEK_ENDING,SPECIES,COUNT,LOCATION,LATITUDE,LONGITUDE,TRAP_TYPE,COLLECTION_DATE';
    const csvRows = upload.speciesData.map(species => 
      `${upload.countyCode},${upload.weekEnding},${species.species},${species.count},${species.location},${species.latitude || ''},${species.longitude || ''},${species.trapType},${species.collectionDate}`
    );
    
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arboret_${upload.countyCode}_${upload.weekEnding}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'CSV Generated',
      description: 'ArboNET CSV file downloaded successfully.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'uploading':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'uploading':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ArboNET Upload</h1>
          <p className="text-muted-foreground">
            Upload vector surveillance data to CDC ArboNET
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={uploadStatus === 'completed' ? 'default' : 'secondary'}>
            <span className={`mr-1 ${getStatusColor(uploadStatus)}`}>
              {getStatusIcon(uploadStatus)}
            </span>
            {uploadStatus}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="data">Data Entry</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Settings
                </CardTitle>
                <CardDescription>
                  Configure ArboNET upload parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="countyCode">County Code</Label>
                  <Input
                    id="countyCode"
                    value={upload.countyCode}
                    onChange={(e) => setUpload({ ...upload, countyCode: e.target.value })}
                    placeholder="e.g., TARRANT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={upload.weekEnding}
                    onChange={(e) => setUpload({ ...upload, weekEnding: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Actions
                </CardTitle>
                <CardDescription>
                  Generate CSV and upload to ArboNET
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Data Summary</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>County: {upload.countyCode || 'Not set'}</div>
                    <div>Week Ending: {upload.weekEnding || 'Not set'}</div>
                    <div>Species Records: {upload.speciesData.length}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateCSV} 
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={upload.speciesData.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Generate CSV
                  </Button>
                  <Button 
                    onClick={uploadToArboNET} 
                    disabled={isUploading || upload.speciesData.length === 0}
                    className="flex items-center gap-2"
                  >
                    {isUploading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Upload to ArboNET'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Species Data Entry
              </CardTitle>
              <CardDescription>
                Enter vector surveillance species data for ArboNET upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="speciesData">Species Data (CSV format)</Label>
                <Textarea
                  id="speciesData"
                  value={speciesDataInput}
                  onChange={(e) => setSpeciesDataInput(e.target.value)}
                  placeholder="species,count,location,latitude,longitude,trapType,collectionDate"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Format: species,count,location,latitude,longitude,trapType,collectionDate
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={parseSpeciesData} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Parse Data
                </Button>
                <Button 
                  onClick={() => setSpeciesDataInput('')} 
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
              {upload.speciesData.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {upload.speciesData.length} species records loaded
                </div>
              )}
            </CardContent>
          </Card>

          {upload.speciesData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Species Data Preview
                </CardTitle>
                <CardDescription>
                  Preview of parsed species data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-2 text-left">Species</th>
                          <th className="p-2 text-left">Count</th>
                          <th className="p-2 text-left">Location</th>
                          <th className="p-2 text-left">Coordinates</th>
                          <th className="p-2 text-left">Trap Type</th>
                          <th className="p-2 text-left">Collection Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upload.speciesData.slice(0, 10).map((species, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2 font-medium">{species.species}</td>
                            <td className="p-2">{species.count}</td>
                            <td className="p-2">{species.location}</td>
                            <td className="p-2 text-xs">
                              {species.latitude && species.longitude 
                                ? `${species.latitude}, ${species.longitude}`
                                : 'Not set'
                              }
                            </td>
                            <td className="p-2">{species.trapType}</td>
                            <td className="p-2 text-xs">
                              {new Date(species.collectionDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {upload.speciesData.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Showing first 10 records of {upload.speciesData.length} total
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Upload Results
              </CardTitle>
              <CardDescription>
                View results from ArboNET uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.uploaded}
                      </div>
                      <div className="text-sm text-muted-foreground">Records Uploaded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {results.errors.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.success ? 'Success' : 'Failed'}
                      </div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Errors:</h4>
                      <div className="space-y-1">
                        {results.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No upload results yet. Upload data to ArboNET to see results here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 