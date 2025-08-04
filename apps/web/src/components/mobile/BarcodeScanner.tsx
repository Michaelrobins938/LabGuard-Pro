'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  CameraOff, 
  Flashlight, 
  FlashlightOff, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Vibrate
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BarcodeScannerProps {
  onScan: (data: string, scanType: 'QR_CODE' | 'BARCODE') => void;
  onError?: (error: string) => void;
  scannerType?: 'QR_CODE' | 'BARCODE' | 'BOTH';
  continuous?: boolean;
  className?: string;
  autoStart?: boolean;
}

interface ScanResult {
  data: string;
  timestamp: Date;
  scanType: 'QR_CODE' | 'BARCODE';
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  scannerType = 'BOTH',
  continuous = false,
  className,
  autoStart = true
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [scanCount, setScanCount] = useState(0);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementRef = useRef<HTMLDivElement>(null);
  const lastScanTimeRef = useRef<number>(0);

  // Vibration feedback
  const vibrate = useCallback((pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Audio feedback
  const playBeep = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio feedback not available:', error);
    }
  }, []);

  // Initialize scanner
  const initializeScanner = useCallback(async () => {
    if (!scannerElementRef.current || isInitialized) return;

    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        supportedScanTypes: scannerType === 'BOTH' 
          ? [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
          : scannerType === 'QR_CODE' 
            ? [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
            : [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      };

      const scanner = new Html5QrcodeScanner(
        'barcode-scanner-container',
        config,
        false
      );

      const onScanSuccess = (decodedText: string, decodedResult: any) => {
        const now = Date.now();
        
        // Prevent duplicate scans within 2 seconds
        if (now - lastScanTimeRef.current < 2000 && lastScan?.data === decodedText) {
          return;
        }
        
        lastScanTimeRef.current = now;
        
        const scanResult: ScanResult = {
          data: decodedText,
          timestamp: new Date(),
          scanType: decodedResult.result.format?.formatName?.includes('QR') ? 'QR_CODE' : 'BARCODE'
        };
        
        setLastScan(scanResult);
        setScanCount(prev => prev + 1);
        
        // Feedback
        vibrate([50, 50, 50]);
        playBeep();
        
        onScan(decodedText, scanResult.scanType);
        
        if (!continuous) {
          stopScanning();
        }
      };

      const onScanFailure = (error: string) => {
        // Ignore frequent scan failures to reduce noise
        if (!error.includes('NotFoundException')) {
          console.warn('Scan error:', error);
        }
      };

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
      setIsInitialized(true);
      setIsScanning(true);
      setError(null);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize scanner';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [facingMode, torchEnabled, scannerType, onScan, onError, continuous, vibrate, playBeep, isInitialized, lastScan]);

  // Start scanning
  const startScanning = useCallback(async () => {
    if (isScanning) return;
    
    try {
      // Request camera permissions
      await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      await initializeScanner();
    } catch (err) {
      const errorMsg = 'Camera permission denied or not available';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [isScanning, facingMode, initializeScanner, onError]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
    setIsInitialized(false);
  }, []);

  // Toggle camera (front/back)
  const toggleCamera = useCallback(() => {
    stopScanning();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => {
      if (isScanning) {
        startScanning();
      }
    }, 100);
  }, [stopScanning, isScanning, startScanning]);

  // Toggle torch/flashlight
  const toggleTorch = useCallback(async () => {
    try {
      if ('mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            advanced: [{ torch: !torchEnabled }] as any
          } 
        });
        setTorchEnabled(!torchEnabled);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.warn('Torch not supported:', err);
    }
  }, [torchEnabled]);

  // Auto-start on mount
  useEffect(() => {
    if (autoStart) {
      startScanning();
    }
    
    return () => {
      stopScanning();
    };
  }, [autoStart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Barcode Scanner
        </CardTitle>
        {scanCount > 0 && (
          <Badge variant="secondary" className="mx-auto">
            {scanCount} scan{scanCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Scanner Container */}
        <div className="relative">
          <div 
            ref={scannerElementRef}
            id="barcode-scanner-container"
            className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
          >
            {!isScanning && !error && (
              <div className="text-center text-gray-500 p-4">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Tap "Start Scanning" to begin</p>
              </div>
            )}
          </div>
          
          {/* Overlay controls */}
          {isScanning && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={toggleTorch}
                className="p-2 h-8 w-8"
              >
                {torchEnabled ? (
                  <FlashlightOff className="h-4 w-4" />
                ) : (
                  <Flashlight className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={toggleCamera}
                className="p-2 h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <Button 
              onClick={startScanning} 
              className="flex-1"
              size="lg"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button 
              onClick={stopScanning} 
              variant="destructive" 
              className="flex-1"
              size="lg"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Status Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {lastScan && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="h-4 w-4" />
            <div className="flex-1 text-sm">
              <div className="font-medium">Scan successful!</div>
              <div className="text-xs opacity-75 font-mono break-all">
                {lastScan.data}
              </div>
              <div className="text-xs opacity-60">
                {lastScan.scanType} • {lastScan.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Scanner Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Scanner Type:</span>
            <span className="font-medium">{scannerType}</span>
          </div>
          <div className="flex justify-between">
            <span>Camera:</span>
            <span className="font-medium capitalize">{facingMode}</span>
          </div>
          <div className="flex justify-between">
            <span>Continuous:</span>
            <span className="font-medium">{continuous ? 'Yes' : 'No'}</span>
          </div>
          {isScanning && (
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;