"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download,
  MapPin,
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface MosquitoPool {
  id: string;
  poolId: string;
  collectionDate: string;
  county: string;
  species?: string;
  mosquitoCount?: number;
  latitude?: number;
  longitude?: number;
  trapId?: string;
  collectionMethod?: string;
  surveillanceTests: SurveillanceTest[];
  status: 'pending' | 'tested' | 'reported';
}

interface SurveillanceTest {
  id: string;
  testType: string;
  pcrResult?: string;
  ctValue?: number;
  interpretation?: string;
  confirmedBy?: string;
  reportedAt?: string;
}

interface NewSampleData {
  poolId: string;
  collectionDate: Date;
  county: string;
  species: string;
  mosquitoCount: number;
  latitude: number;
  longitude: number;
  trapId: string;
  collectionMethod: string;
}

export default function SurveillanceDataManagement() {
  const [samples, setSamples] = useState<MosquitoPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedSample, setSelectedSample] = useState<MosquitoPool | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newSampleData, setNewSampleData] = useState<Partial<NewSampleData>>({});

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await fetch('/api/public-health/samples');
      if (!response.ok) throw new Error('Failed to fetch samples');
      
      const data = await response.json();
      setSamples(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load surveillance data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      const matchesSearch = sample.poolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sample.county.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sample.status === statusFilter;
      const matchesCounty = countyFilter === 'all' || sample.county === countyFilter;
      
      const matchesDate = !dateFilter || 
        new Date(sample.collectionDate).toDateString() === dateFilter.toDateString();

      return matchesSearch && matchesStatus && matchesCounty && matchesDate;
    });
  }, [samples, searchTerm, statusFilter, countyFilter, dateFilter]);

  const addNewSample = async () => {
    try {
      const response = await fetch('/api/public-health/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSampleData)
      });

      if (!response.ok) throw new Error('Failed to add sample');

      const newSample = await response.json();
      setSamples([newSample.data, ...samples]);
      setShowAddDialog(false);
      setNewSampleData({});
      
      toast({
        title: "Sample Added",
        description: `Sample ${newSample.data.poolId} has been added successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new sample.",
        variant: "destructive"
      });
    }
  };

  const updateTestResult = async (sampleId: string, testData: Partial<SurveillanceTest>) => {
    try {
      const response = await fetch(`/api/public-health/samples/${sampleId}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (!response.ok) throw new Error('Failed to update test result');

      fetchSamples(); // Refresh data
      
      toast({
        title: "Test Result Updated",
        description: "Sample test result has been recorded."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update test result.",
        variant: "destructive"
      });
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch('/api/public-health/samples/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filters: { status: statusFilter, county: countyFilter },
          format: 'csv'
        })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surveillance_data_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      
      toast({
        title: "Export Complete",
        description: "Surveillance data has been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export surveillance data.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'outline',
      'tested': 'default',
      'reported': 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    
    const variants = {
      'positive': 'destructive',
      'negative': 'default',
      'indeterminate': 'secondary'
    } as const;
    
    return <Badge variant={variants[result as keyof typeof variants] || 'outline'}>{result}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading surveillance data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{samples.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {samples.filter(s => s.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Positive Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {samples.filter(s => 
                s.surveillanceTests.some(t => t.pcrResult === 'positive')
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {samples.filter(s => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(s.collectionDate) >= weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Surveillance Data Management</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={exportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sample
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Mosquito Pool Sample</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Pool ID</Label>
                      <Input
                        value={newSampleData.poolId || ''}
                        onChange={(e) => setNewSampleData({...newSampleData, poolId: e.target.value})}
                        placeholder="POOL_001"
                      />
                    </div>
                    
                    <div>
                      <Label>Collection Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newSampleData.collectionDate ? 
                              format(newSampleData.collectionDate, 'PPP') : 
                              'Select date'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newSampleData.collectionDate}
                            onSelect={(date) => setNewSampleData({...newSampleData, collectionDate: date})}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>County</Label>
                      <Select
                        value={newSampleData.county}
                        onValueChange={(value) => setNewSampleData({...newSampleData, county: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TARRANT">Tarrant</SelectItem>
                          <SelectItem value="DALLAS">Dallas</SelectItem>
                          <SelectItem value="DENTON">Denton</SelectItem>
                          <SelectItem value="COLLIN">Collin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Species</Label>
                      <Select
                        value={newSampleData.species}
                        onValueChange={(value) => setNewSampleData({...newSampleData, species: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Culex pipiens">Culex pipiens</SelectItem>
                          <SelectItem value="Culex quinquefasciatus">Culex quinquefasciatus</SelectItem>
                          <SelectItem value="Aedes aegypti">Aedes aegypti</SelectItem>
                          <SelectItem value="Aedes albopictus">Aedes albopictus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          type="number"
                          step="0.000001"
                          value={newSampleData.latitude || ''}
                          onChange={(e) => setNewSampleData({...newSampleData, latitude: parseFloat(e.target.value)})}
                          placeholder="32.7767"
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          type="number"
                          step="0.000001"
                          value={newSampleData.longitude || ''}
                          onChange={(e) => setNewSampleData({...newSampleData, longitude: parseFloat(e.target.value)})}
                          placeholder="-97.0927"
                        />
                      </div>
                    </div>

                    <Button onClick={addNewSample} className="w-full">
                      Add Sample
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by pool ID or county..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="tested">Tested</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countyFilter} onValueChange={setCountyFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                <SelectItem value="TARRANT">Tarrant</SelectItem>
                <SelectItem value="DALLAS">Dallas</SelectItem>
                <SelectItem value="DENTON">Denton</SelectItem>
                <SelectItem value="COLLIN">Collin</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP') : 'Filter by date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                />
              </PopoverContent>
            </Popover>

            {(statusFilter !== 'all' || countyFilter !== 'all' || dateFilter) && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setStatusFilter('all');
                  setCountyFilter('all');
                  setDateFilter(undefined);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool ID</TableHead>
                  <TableHead>Collection Date</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Test Result</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.poolId}</TableCell>
                    <TableCell>{format(new Date(sample.collectionDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{sample.county}</TableCell>
                    <TableCell>{sample.species || 'Unknown'}</TableCell>
                    <TableCell>{getStatusBadge(sample.status)}</TableCell>
                    <TableCell>
                      {sample.surveillanceTests.length > 0 
                        ? getResultBadge(sample.surveillanceTests[0].pcrResult)
                        : <Badge variant="outline">No Test</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {sample.latitude && sample.longitude ? (
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSample(sample);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSamples.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No surveillance data found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sample Details - {selectedSample?.poolId}</DialogTitle>
          </DialogHeader>
          {selectedSample && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Collection Date</Label>
                  <p className="text-sm">{format(new Date(selectedSample.collectionDate), 'PPP')}</p>
                </div>
                <div>
                  <Label>County</Label>
                  <p className="text-sm">{selectedSample.county}</p>
                </div>
                <div>
                  <Label>Species</Label>
                  <p className="text-sm">{selectedSample.species || 'Unknown'}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm">{getStatusBadge(selectedSample.status)}</p>
                </div>
              </div>

              {selectedSample.latitude && selectedSample.longitude && (
                <div>
                  <Label>Location</Label>
                  <p className="text-sm">
                    {selectedSample.latitude.toFixed(6)}, {selectedSample.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <div>
                <Label>Surveillance Tests</Label>
                {selectedSample.surveillanceTests.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {selectedSample.surveillanceTests.map((test) => (
                      <div key={test.id} className="p-3 border rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Test Type:</strong> {test.testType}
                          </div>
                          <div>
                            <strong>Result:</strong> {getResultBadge(test.pcrResult)}
                          </div>
                          {test.ctValue && (
                            <div>
                              <strong>CT Value:</strong> {test.ctValue}
                            </div>
                          )}
                          {test.interpretation && (
                            <div className="col-span-2">
                              <strong>Interpretation:</strong> {test.interpretation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No tests recorded</p>
                )}
              </div>

              {selectedSample.status === 'pending' && (
                <div className="border-t pt-4">
                  <Label>Add Test Result</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Select 
                      onValueChange={(value) => {
                        updateTestResult(selectedSample.id, {
                          testType: 'west_nile',
                          pcrResult: value
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                        <SelectItem value="indeterminate">Indeterminate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 