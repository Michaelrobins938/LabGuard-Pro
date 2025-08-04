'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MobileQRGenerator from '@/components/mobile/MobileQRGenerator';
import { 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  Search, 
  Filter,
  Smartphone,
  Printer,
  Download,
  Users,
  Calendar,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface SampleData {
  id: string;
  poolId: string;
  trapId: string;
  collectionDate: string;
  latitude?: number;
  longitude?: number;
  species?: string;
  collectedBy?: string;
  laboratoryId: string;
  status?: string;
  location?: string;
}

export default function MobilePrintLabelsPage() {
  const [currentStep, setCurrentStep] = useState<'selection' | 'print'>('selection');
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    try {
      setLoading(true);
      
      // Try to load from API
      const response = await fetch('/api/wnv-samples?limit=50');
      if (response.ok) {
        const data = await response.json();
        setSamples(data.data || []);
      } else {
        // Fallback to demo data
        const demoSamples: SampleData[] = Array.from({ length: 25 }, (_, i) => ({
          id: `sample-${i + 1}`,
          poolId: `POOL-${String(i + 1).padStart(3, '0')}`,
          trapId: `FTW-${String(Math.floor(i / 5) + 1).padStart(3, '0')}`,
          collectionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          species: ['CULEX_QUINQUEFASCIATUS', 'CULEX_PIPIENS', 'CULEX_RESTUANS'][Math.floor(Math.random() * 3)],
          collectedBy: 'Field Tech',
          laboratoryId: 'demo-lab',
          status: Math.random() > 0.7 ? 'completed' : 'pending',
          location: ['Fort Worth', 'Arlington', 'Grand Prairie', 'Irving'][Math.floor(Math.random() * 4)],
          latitude: 32.7555 + (Math.random() - 0.5) * 0.1,
          longitude: -97.3308 + (Math.random() - 0.5) * 0.1
        }));
        setSamples(demoSamples);
      }
    } catch (error) {
      console.error('Failed to load samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = !searchQuery || 
      sample.poolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.trapId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || sample.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSampleToggle = (sampleId: string) => {
    setSelectedSamples(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sampleId)) {
        newSet.delete(sampleId);
      } else {
        newSet.add(sampleId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedSamples.size === filteredSamples.length) {
      setSelectedSamples(new Set());
    } else {
      setSelectedSamples(new Set(filteredSamples.map(s => s.id)));
    }
  };

  const handleProceedToPrint = () => {
    if (selectedSamples.size > 0) {
      setCurrentStep('print');
    }
  };

  const handlePrintComplete = (jobId: string) => {
    console.log('Print job completed:', jobId);
    // Could navigate back or show success message
    alert(`Print job ${jobId} completed successfully!`);
  };

  const getSelectedSamplesData = (): SampleData[] => {
    return samples.filter(sample => selectedSamples.has(sample.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading samples...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => currentStep === 'print' ? setCurrentStep('selection') : window.history.back()}
            className="text-white hover:bg-blue-500 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <Printer className="w-6 h-6 mr-2" />
              {currentStep === 'selection' ? 'Select Samples' : 'Print QR Labels'}
            </h1>
            <p className="text-blue-100 text-sm">
              {currentStep === 'selection' 
                ? 'Choose samples for QR code label printing'
                : `Printing ${selectedSamples.size} QR code labels`
              }
            </p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex mt-4 space-x-1">
          <div className={`flex-1 h-1 rounded ${currentStep === 'selection' ? 'bg-white' : 'bg-blue-400'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'print' ? 'bg-white' : 'bg-blue-400'}`} />
        </div>
      </div>

      <div className="container mx-auto p-4">
        {currentStep === 'selection' ? (
          /* Sample Selection Step */
          <div className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search samples..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant={filterStatus === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('all')}
                    >
                      All ({samples.length})
                    </Button>
                    <Button
                      variant={filterStatus === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('pending')}
                    >
                      Pending ({samples.filter(s => s.status === 'pending').length})
                    </Button>
                    <Button
                      variant={filterStatus === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('completed')}
                    >
                      Completed ({samples.filter(s => s.status === 'completed').length})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selection Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      {selectedSamples.size === filteredSamples.length && filteredSamples.length > 0 ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        {selectedSamples.size === filteredSamples.length && filteredSamples.length > 0 
                          ? 'Deselect All' 
                          : 'Select All'
                        }
                      </span>
                    </button>
                  </div>
                  
                  <Badge variant="secondary">
                    {selectedSamples.size} of {filteredSamples.length} selected
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Sample List */}
            <div className="space-y-2">
              {filteredSamples.length > 0 ? (
                filteredSamples.map((sample) => (
                  <Card 
                    key={sample.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSamples.has(sample.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSampleToggle(sample.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {selectedSamples.has(sample.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{sample.poolId}</h4>
                            <Badge 
                              className={
                                sample.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {sample.status || 'pending'}
                            </Badge>
                          </div>
                          
                          <div className="mt-1 grid grid-cols-1 gap-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{sample.trapId} • {sample.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(sample.collectionDate).toLocaleDateString()}</span>
                            </div>
                            {sample.species && (
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                <span>{sample.species.replace(/_/g, ' ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No samples found</h3>
                    <p className="text-gray-600">
                      {searchQuery 
                        ? `No samples match "${searchQuery}"`
                        : 'No samples available for printing'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Continue Button */}
            <div className="sticky bottom-0 bg-white p-4 border-t">
              <Button
                onClick={handleProceedToPrint}
                disabled={selectedSamples.size === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print {selectedSamples.size} QR Labels
              </Button>
            </div>
          </div>
        ) : (
          /* Print Step */
          <MobileQRGenerator
            samples={getSelectedSamplesData()}
            onPrintComplete={handlePrintComplete}
            className="pb-6"
          />
        )}
      </div>
    </div>
  );
}