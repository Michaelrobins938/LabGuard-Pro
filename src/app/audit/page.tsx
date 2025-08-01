'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircle, XCircle, Copy, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AuditResult {
  device: string;
  status: 'PASS' | 'FAIL';
  days_overdue: number;
  recommendation: string;
  tolerance: number;
  timestamp: string;
  message: string;
}

export default function AuditPage() {
  const [formData, setFormData] = useState({
    device: '',
    last_calibrated: '',
    tolerance: '30'
  });
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.device.trim()) {
      setError('Device name is required');
      return false;
    }
    if (!formData.last_calibrated) {
      setError('Last calibration date is required');
      return false;
    }
    if (!formData.tolerance || parseInt(formData.tolerance) <= 0) {
      setError('Tolerance must be a positive number');
      return false;
    }
    setError('');
    return true;
  };

  const runAudit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/audit/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device: formData.device.trim(),
          last_calibrated: formData.last_calibrated,
          tolerance: parseInt(formData.tolerance)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Audit Complete",
        description: data.message,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to run audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    
    const textToCopy = `
LabGuard-Pro Audit Result
Device: ${result.device}
Status: ${result.status}
Days since calibration: ${result.days_overdue}
Tolerance: ${result.tolerance} days
Recommendation: ${result.recommendation}
Timestamp: ${result.timestamp}
Message: ${result.message}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Audit result copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      device: '',
      last_calibrated: '',
      tolerance: '30'
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Equipment Calibration Audit
        </h1>
        <p className="text-gray-600">
          Validate equipment calibration status and compliance requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Audit Parameters
            </CardTitle>
            <CardDescription>
              Enter equipment details to check calibration status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="device">Equipment Device</Label>
              <Input
                id="device"
                name="device"
                type="text"
                placeholder="e.g., Microscope, Incubator, Centrifuge"
                value={formData.device}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_calibrated">Last Calibration Date</Label>
              <Input
                id="last_calibrated"
                name="last_calibrated"
                type="date"
                value={formData.last_calibrated}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tolerance">Tolerance Period (days)</Label>
              <Input
                id="tolerance"
                name="tolerance"
                type="number"
                min="1"
                placeholder="30"
                value={formData.tolerance}
                onChange={handleInputChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Maximum days allowed between calibrations
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={runAudit} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Audit...
                  </>
                ) : (
                  'Run Audit'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Results</CardTitle>
            <CardDescription>
              Calibration status and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.status === 'PASS' ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <h3 className="text-lg font-semibold">{result.device}</h3>
                  </div>
                  <Badge 
                    variant={result.status === 'PASS' ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {result.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Days since calibration:</span>
                      <p className="text-lg font-semibold">{result.days_overdue}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Tolerance:</span>
                      <p className="text-lg font-semibold">{result.tolerance} days</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-600">Recommendation:</span>
                    <p className="text-lg font-semibold text-blue-600">
                      {result.recommendation}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{result.message}</p>
                  </div>

                  <div className="text-xs text-gray-500">
                    Timestamp: {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>

                <Button 
                  onClick={copyResult}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Run an audit to see results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>
            Try these common equipment scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { device: 'Microscope', last: '2025-01-15', tolerance: '30' },
              { device: 'Incubator', last: '2024-11-01', tolerance: '30' },
              { device: 'PCR Machine', last: '2024-10-01', tolerance: '7' }
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => {
                  setFormData({
                    device: example.device,
                    last_calibrated: example.last,
                    tolerance: example.tolerance
                  });
                }}
                className="justify-start text-left h-auto p-3"
              >
                <div>
                  <div className="font-medium">{example.device}</div>
                  <div className="text-xs text-gray-500">
                    Last: {example.last} | Tolerance: {example.tolerance} days
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 