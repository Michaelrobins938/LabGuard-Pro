'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import BarcodeScanner from './BarcodeScanner';
import { 
  MapPin, 
  Camera, 
  Save, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Bug,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Wifi,
  WifiOff,
  Battery
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const sampleIntakeSchema = z.object({
  poolId: z.string().min(1, 'Pool ID is required'),
  trapId: z.string().min(1, 'Trap ID is required'),
  collectionDate: z.string().min(1, 'Collection date is required'),
  collectionTime: z.string().min(1, 'Collection time is required'),
  collectedBy: z.string().min(1, 'Collector name is required'),
  mosquitoSpecies: z.enum([
    'CULEX_QUINQUEFASCIATUS',
    'CULEX_PIPIENS', 
    'CULEX_RESTUANS',
    'CULEX_SALINARIUS',
    'CULEX_TARSALIS',
    'AEDES_ALBOPICTUS',
    'AEDES_AEGYPTI',
    'AEDES_VEXANS',
    'ANOPHELES_QUADRIMACULATUS',
    'OCHLEROTATUS_SOLLICITANS',
    'UNKNOWN',
    'MIXED'
  ]),
  poolSize: z.number().min(1, 'Pool size must be at least 1').max(100, 'Pool size cannot exceed 100'),
  poolCondition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DEGRADED']),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  weatherConditions: z.string().optional(),
  notes: z.string().optional(),
});

type SampleIntakeForm = z.infer<typeof sampleIntakeSchema>;

interface MobileSampleIntakeProps {
  onSubmit: (data: SampleIntakeForm & { photos?: string[] }) => Promise<void>;
  className?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface DeviceStatus {
  isOnline: boolean;
  batteryLevel?: number;
  gpsAvailable: boolean;
  cameraAvailable: boolean;
}

export const MobileSampleIntake: React.FC<MobileSampleIntakeProps> = ({
  onSubmit,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    isOnline: navigator.onLine,
    gpsAvailable: 'geolocation' in navigator,
    cameraAvailable: 'mediaDevices' in navigator
  });
  const [showScanner, setShowScanner] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm<SampleIntakeForm>({
    resolver: zodResolver(sampleIntakeSchema),
    defaultValues: {
      collectionDate: new Date().toISOString().split('T')[0],
      collectionTime: new Date().toTimeString().slice(0, 5),
    }
  });

  const watchedValues = watch();

  // Steps configuration
  const steps = [
    {
      title: 'Scan Sample',
      description: 'Scan QR code or enter sample information',
      icon: Camera,
      requiredFields: ['poolId', 'trapId']
    },
    {
      title: 'Collection Details',
      description: 'Enter collection date, time, and collector',
      icon: Save,
      requiredFields: ['collectionDate', 'collectionTime', 'collectedBy']
    },
    {
      title: 'Sample Details', 
      description: 'Mosquito species and pool characteristics',
      icon: Bug,
      requiredFields: ['mosquitoSpecies', 'poolSize', 'poolCondition']
    },
    {
      title: 'Location & Environment',
      description: 'GPS coordinates and environmental conditions',
      icon: MapPin,
      requiredFields: []
    }
  ];

  // Get current GPS location
  const getCurrentLocation = useCallback(() => {
    if (!deviceStatus.gpsAvailable) {
      setLocationError('GPS not available on this device');
      return;
    }

    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };
        
        setLocation(locationData);
        setValue('latitude', locationData.latitude);
        setValue('longitude', locationData.longitude);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }, [deviceStatus.gpsAvailable, setValue]);

  // Handle barcode scan
  const handleBarcodeScan = useCallback((data: string, scanType: 'QR_CODE' | 'BARCODE') => {
    try {
      // Try to parse QR code data (expected format: JSON with sample info)
      if (scanType === 'QR_CODE') {
        try {
          const qrData = JSON.parse(data);
          if (qrData.poolId) setValue('poolId', qrData.poolId);
          if (qrData.trapId) setValue('trapId', qrData.trapId);
          if (qrData.collectionDate) setValue('collectionDate', qrData.collectionDate);
          if (qrData.species) setValue('mosquitoSpecies', qrData.species);
        } catch {
          // If not JSON, treat as poolId
          setValue('poolId', data);
        }
      } else {
        // Barcode - treat as poolId
        setValue('poolId', data);
      }
      
      setShowScanner(false);
      
      // Auto-advance to next step if current step is complete
      const currentRequiredFields = steps[currentStep].requiredFields;
      const allFieldsFilled = currentRequiredFields.every(field => 
        watchedValues[field as keyof SampleIntakeForm]
      );
      
      if (allFieldsFilled && currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error processing scan:', error);
    }
  }, [setValue, currentStep, steps, watchedValues]);

  // Handle photo capture
  const handlePhotoCapture = useCallback(async () => {
    if (!deviceStatus.cameraAvailable) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element for capture
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setPhotos(prev => [...prev, photoData]);
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  }, [deviceStatus.cameraAvailable]);

  // Monitor device status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setDeviceStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    const updateBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setDeviceStatus(prev => ({ 
            ...prev, 
            batteryLevel: Math.round(battery.level * 100) 
          }));
        } catch (error) {
          console.warn('Battery API not available');
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateBatteryStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Auto-capture location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Form submission
  const onFormSubmit = async (data: SampleIntakeForm) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, photos });
      reset();
      setPhotos([]);
      setCurrentStep(0);
      setLocation(null);
    } catch (error) {
      console.error('Error submitting sample:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    const requiredFields = steps[currentStep].requiredFields;
    return requiredFields.every(field => 
      watchedValues[field as keyof SampleIntakeForm]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Scan Sample
        return (
          <div className="space-y-4">
            {showScanner ? (
              <BarcodeScanner
                onScan={handleBarcodeScan}
                scannerType="BOTH"
                continuous={false}
                className="mb-4"
              />
            ) : (
              <Button 
                onClick={() => setShowScanner(true)}
                className="w-full mb-4"
                size="lg"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan Sample QR Code
              </Button>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="poolId">Pool ID *</Label>
                <Input
                  id="poolId"
                  {...register('poolId')}
                  placeholder="Enter pool ID"
                  className={cn(errors.poolId && 'border-red-500')}
                />
                {errors.poolId && (
                  <p className="text-sm text-red-500 mt-1">{errors.poolId.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="trapId">Trap ID *</Label>
                <Input
                  id="trapId"
                  {...register('trapId')}
                  placeholder="Enter trap ID"
                  className={cn(errors.trapId && 'border-red-500')}
                />
                {errors.trapId && (
                  <p className="text-sm text-red-500 mt-1">{errors.trapId.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 1: // Collection Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collectionDate">Collection Date *</Label>
                <Input
                  id="collectionDate"
                  type="date"
                  {...register('collectionDate')}
                  className={cn(errors.collectionDate && 'border-red-500')}
                />
                {errors.collectionDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.collectionDate.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="collectionTime">Collection Time *</Label>
                <Input
                  id="collectionTime"
                  type="time"
                  {...register('collectionTime')}
                  className={cn(errors.collectionTime && 'border-red-500')}
                />
                {errors.collectionTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.collectionTime.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="collectedBy">Collected By *</Label>
              <Input
                id="collectedBy"
                {...register('collectedBy')}
                placeholder="Enter collector name"
                className={cn(errors.collectedBy && 'border-red-500')}
              />
              {errors.collectedBy && (
                <p className="text-sm text-red-500 mt-1">{errors.collectedBy.message}</p>
              )}
            </div>
          </div>
        );

      case 2: // Sample Details
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mosquitoSpecies">Mosquito Species *</Label>
              <Select 
                onValueChange={(value) => setValue('mosquitoSpecies', value as any)}
                value={watchedValues.mosquitoSpecies}
              >
                <SelectTrigger className={cn(errors.mosquitoSpecies && 'border-red-500')}>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CULEX_QUINQUEFASCIATUS">Culex quinquefasciatus</SelectItem>
                  <SelectItem value="CULEX_PIPIENS">Culex pipiens</SelectItem>
                  <SelectItem value="CULEX_RESTUANS">Culex restuans</SelectItem>
                  <SelectItem value="CULEX_SALINARIUS">Culex salinarius</SelectItem>
                  <SelectItem value="CULEX_TARSALIS">Culex tarsalis</SelectItem>
                  <SelectItem value="AEDES_ALBOPICTUS">Aedes albopictus</SelectItem>
                  <SelectItem value="AEDES_AEGYPTI">Aedes aegypti</SelectItem>
                  <SelectItem value="AEDES_VEXANS">Aedes vexans</SelectItem>
                  <SelectItem value="ANOPHELES_QUADRIMACULATUS">Anopheles quadrimaculatus</SelectItem>
                  <SelectItem value="OCHLEROTATUS_SOLLICITANS">Ochlerotatus sollicitans</SelectItem>
                  <SelectItem value="MIXED">Mixed species</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
              {errors.mosquitoSpecies && (
                <p className="text-sm text-red-500 mt-1">{errors.mosquitoSpecies.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poolSize">Pool Size *</Label>
                <Input
                  id="poolSize"
                  type="number"
                  min="1"
                  max="100"
                  {...register('poolSize', { valueAsNumber: true })}
                  placeholder="Number of mosquitoes"
                  className={cn(errors.poolSize && 'border-red-500')}
                />
                {errors.poolSize && (
                  <p className="text-sm text-red-500 mt-1">{errors.poolSize.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="poolCondition">Condition *</Label>
                <Select 
                  onValueChange={(value) => setValue('poolCondition', value as any)}
                  value={watchedValues.poolCondition}
                >
                  <SelectTrigger className={cn(errors.poolCondition && 'border-red-500')}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">Excellent</SelectItem>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="FAIR">Fair</SelectItem>
                    <SelectItem value="POOR">Poor</SelectItem>
                    <SelectItem value="DEGRADED">Degraded</SelectItem>
                  </SelectContent>
                </Select>
                {errors.poolCondition && (
                  <p className="text-sm text-red-500 mt-1">{errors.poolCondition.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Location & Environment
        return (
          <div className="space-y-4">
            {/* GPS Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>GPS Location</Label>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={!deviceStatus.gpsAvailable}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Location
                </Button>
              </div>
              
              {location && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Location captured</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    <div>Lat: {location.latitude.toFixed(6)}</div>
                    <div>Lng: {location.longitude.toFixed(6)}</div>
                    <div>Accuracy: ±{location.accuracy.toFixed(0)}m</div>
                  </div>
                </div>
              )}
              
              {locationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Location error</span>
                  </div>
                  <div className="text-sm text-red-600 mt-1">{locationError}</div>
                </div>
              )}
            </div>

            {/* Environmental Conditions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  placeholder="Temperature"
                />
              </div>
              
              <div>
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  min="0"
                  max="100"
                  {...register('humidity', { valueAsNumber: true })}
                  placeholder="Humidity"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="weatherConditions">Weather Conditions</Label>
              <Input
                id="weatherConditions"
                {...register('weatherConditions')}
                placeholder="Weather description"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            {/* Photo capture */}
            {deviceStatus.cameraAvailable && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Photos</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={handlePhotoCapture}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Sample photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Device Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg border-b text-xs">
        <div className="flex items-center gap-2">
          {deviceStatus.isOnline ? (
            <Wifi className="h-3 w-3 text-green-600" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-600" />
          )}
          <span className={deviceStatus.isOnline ? 'text-green-600' : 'text-red-600'}>
            {deviceStatus.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {deviceStatus.batteryLevel && (
            <>
              <Battery className="h-3 w-3" />
              <span>{deviceStatus.batteryLevel}%</span>
            </>
          )}
          <Smartphone className="h-3 w-3" />
        </div>
      </div>

      <Card className="rounded-t-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Sample Intake</span>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </CardTitle>
          
          {/* Progress indicator */}
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 flex-1 rounded',
                  index < currentStep 
                    ? 'bg-green-500' 
                    : index === currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                )}
              />
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {renderStep()}
            
            {/* Navigation */}
            <div className="flex gap-2 pt-4">
              {currentStep > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={!isCurrentStepComplete()}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={!isValid || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Sample'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSampleIntake;