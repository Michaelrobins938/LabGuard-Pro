'use client';

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  ArrowLeft,
  Database
} from 'lucide-react';

interface QuickScanResult {
  poolId: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export default function QuickScanPage() {
  const [scanResults, setScanResults] = useState<QuickScanResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const handleScan = useCallback(async (data: string, scanType: 'QR_CODE' | 'BARCODE') => {
    setIsProcessing(true);
    
    try {
      // Validate QR code data
      const response = await fetch('/api/qr-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData: data }),
      });

      const result = await response.json();
      
      if (result.success && result.data.valid) {
        const sampleData = result.data.data;
        
        // Quick registration - just mark as received
        const quickResult: QuickScanResult = {
          poolId: sampleData.poolId,
          timestamp: new Date(),
          success: true
        };
        
        setScanResults(prev => [quickResult, ...prev.slice(0, 9)]); // Keep last 10
        setScanCount(prev => prev + 1);
        
        toast.success(`Sample ${sampleData.poolId} scanned`, {
          description: `Trap: ${sampleData.trapId} | Species: ${sampleData.species || 'Unknown'}`,
          duration: 2000
        });
        
      } else {
        // Invalid QR code or not a sample QR
        const errorResult: QuickScanResult = {
          poolId: data.substring(0, 20) + '...', // Truncate for display
          timestamp: new Date(),
          success: false,
          error: 'Invalid sample QR code'
        };
        
        setScanResults(prev => [errorResult, ...prev.slice(0, 9)]);
        
        toast.error('Invalid QR code', {
          description: 'This QR code is not a valid sample identifier',
          duration: 3000
        });
      }
      
    } catch (error) {
      console.error('Quick scan error:', error);
      
      const errorResult: QuickScanResult = {
        poolId: data.substring(0, 20) + '...',
        timestamp: new Date(),
        success: false,
        error: 'Processing error'
      };
      
      setScanResults(prev => [errorResult, ...prev.slice(0, 9)]);
      
      toast.error('Scan processing failed', {
        description: 'Please try again or check your connection',
        duration: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleClearResults = () => {
    setScanResults([]);
    setScanCount(0);
    toast.info('Scan history cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Quick Scan</h1>
            </div>
            <p className="text-sm text-gray-600">
              Rapid sample verification and logging
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-700">{scanCount}</div>
              <div className="text-xs text-purple-600">Total Scans</div>
            </div>
          </Card>
          
          <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <div className="text-lg font-bold text-green-700">
                {scanResults.filter(r => r.success).length}
              </div>
              <div className="text-xs text-green-600">Valid</div>
            </div>
          </Card>
          
          <Card className="p-3 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="text-center">
              <div className="text-lg font-bold text-red-700">
                {scanResults.filter(r => !r.success).length}
              </div>
              <div className="text-xs text-red-600">Errors</div>
            </div>
          </Card>
        </div>

        {/* Scanner */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Scan Sample QR Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarcodeScanner
              onScan={handleScan}
              scannerType="QR_CODE"
              continuous={true}
              className="border-0 shadow-none"
            />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scan Results */}
        {scanResults.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Scans
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearResults}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {scanResults.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.poolId}
                    </div>
                    <div className={`text-xs ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.success 
                        ? result.timestamp.toLocaleTimeString()
                        : result.error || 'Failed'
                      }
                    </div>
                  </div>
                  
                  <Badge 
                    variant={result.success ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {result.success ? 'Valid' : 'Error'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => window.location.href = '/mobile/sample-intake'}
          >
            Full Sample Entry
          </Button>
          
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => window.location.href = '/mobile/pcr-status'}
          >
            PCR Status
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Scan Tips</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Hold QR code steady in the scanner frame</li>
              <li>• Ensure good lighting for best results</li>
              <li>• Use the flashlight button in dark conditions</li>
              <li>• Scanner works continuously - no need to tap</li>
              <li>• Invalid codes will show error messages</li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Quick Scan Mode • LabGuard-Pro Mobile</p>
        </div>
      </div>
    </div>
  );
}