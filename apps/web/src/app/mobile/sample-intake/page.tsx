'use client';

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import MobileSampleIntake from '@/components/mobile/MobileSampleIntake';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  WifiOff, 
  Database,
  QrCode,
  MapPin,
  Bug
} from 'lucide-react';

interface SampleData {
  poolId: string;
  trapId: string;
  collectionDate: string;
  collectionTime: string;
  collectedBy: string;
  mosquitoSpecies: string;
  poolSize: number;
  poolCondition: string;
  latitude?: number;
  longitude?: number;
  temperature?: number;
  humidity?: number;
  weatherConditions?: string;
  notes?: string;
  photos?: string[];
}

export default function MobileSampleIntakePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSamples, setSubmittedSamples] = useState<number>(0);
  const [offlineQueue, setOfflineQueue] = useState<SampleData[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle sample submission
  const handleSampleSubmit = useCallback(async (sampleData: SampleData) => {
    setIsSubmitting(true);

    try {
      if (!isOnline) {
        // Add to offline queue
        setOfflineQueue(prev => [...prev, sampleData]);
        toast.success('Sample saved offline - will sync when connection is restored');
        setSubmittedSamples(prev => prev + 1);
        return;
      }

      // Submit to API
      const response = await fetch('/api/wnv-samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Sample submitted successfully!', {
          description: `Pool ID: ${sampleData.poolId}`,
          action: {
            label: 'View QR Code',
            onClick: () => {
              if (result.data.qrCode) {
                // Display QR code in modal or new window
                const qrWindow = window.open('', '_blank', 'width=400,height=400');
                if (qrWindow) {
                  qrWindow.document.write(`
                    <html>
                      <head><title>Sample QR Code</title></head>
                      <body style="text-align: center; padding: 20px;">
                        <h3>Sample ${sampleData.poolId}</h3>
                        <img src="${result.data.qrCode.qrCode}" alt="QR Code" style="max-width: 300px;">
                        <br><br>
                        <button onclick="window.print()">Print</button>
                      </body>
                    </html>
                  `);
                }
              }
            }
          }
        });
        setSubmittedSamples(prev => prev + 1);
      } else {
        throw new Error(result.message || 'Failed to submit sample');
      }

    } catch (error) {
      console.error('Sample submission error:', error);
      
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        // Network error - add to offline queue
        setOfflineQueue(prev => [...prev, sampleData]);
        toast.warning('Network error - sample saved offline');
        setSubmittedSamples(prev => prev + 1);
      } else {
        toast.error('Failed to submit sample', {
          description: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isOnline]);

  // Sync offline samples when connection is restored
  React.useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      const syncOfflineData = async () => {
        console.log(`Syncing ${offlineQueue.length} offline samples...`);
        
        for (const sample of offlineQueue) {
          try {
            const response = await fetch('/api/wnv-samples', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(sample),
            });

            if (response.ok) {
              setOfflineQueue(prev => prev.filter(s => s.poolId !== sample.poolId));
              console.log(`Synced sample ${sample.poolId}`);
            }
          } catch (error) {
            console.error(`Failed to sync sample ${sample.poolId}:`, error);
          }
        }

        if (offlineQueue.length === 0) {
          toast.success('All offline samples synced successfully!');
        }
      };

      syncOfflineData();
    }
  }, [isOnline, offlineQueue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">LabGuard-Pro</h1>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            West Nile Virus Sample Intake
          </h2>
          <p className="text-sm text-gray-600">
            Mobile mosquito pool collection and registration
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <div>
                <div className="text-xs font-medium">Connection</div>
                <div className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs font-medium">Samples</div>
                <div className="text-sm text-blue-600">
                  {submittedSamples} submitted
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Offline Queue Status */}
        {offlineQueue.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-orange-800">
                    {offlineQueue.length} samples in offline queue
                  </div>
                  <div className="text-xs text-orange-600">
                    Will sync when connection is restored
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <QrCode className="h-6 w-6 mx-auto text-blue-600 mb-1" />
              <div className="text-xs font-medium text-blue-800">QR Scanning</div>
              <div className="text-xs text-blue-600">Fast sample ID entry</div>
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <MapPin className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <div className="text-xs font-medium text-green-800">GPS Location</div>
              <div className="text-xs text-green-600">Auto-capture coordinates</div>
            </div>
          </Card>
        </div>

        {/* Main Sample Intake Form */}
        <MobileSampleIntake
          onSubmit={handleSampleSubmit}
          className="shadow-lg"
        />

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                // Navigate to PCR status
                window.location.href = '/mobile/pcr-status';
              }}
            >
              Check PCR Status
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                // Navigate to surveillance map
                window.location.href = '/surveillance/map';
              }}
            >
              View Surveillance Map
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                // Navigate to dashboard
                window.location.href = '/dashboard';
              }}
            >
              Laboratory Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>LabGuard-Pro Mobile v1.0.0</p>
          <p>Tarrant County Public Health Laboratory</p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-xs">
              PWA Ready
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Offline Capable
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}