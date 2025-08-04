'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode';
import { 
  Download, 
  Printer, 
  Mail, 
  Share2, 
  Smartphone, 
  FileText,
  Settings,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SampleData {
  poolId: string;
  trapId: string;
  collectionDate: string;
  latitude?: number;
  longitude?: number;
  species?: string;
  collectedBy?: string;
  laboratoryId: string;
}

interface MobileQRGeneratorProps {
  samples: SampleData[];
  onPrintComplete?: (jobId: string) => void;
  className?: string;
}

interface PrintFormat {
  id: string;
  name: string;
  description: string;
  qrCodesPerPage: number;
  paperType: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

interface PrintMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export default function MobileQRGenerator({ 
  samples, 
  onPrintComplete,
  className = '' 
}: MobileQRGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('SHEET_LAYOUT');
  const [selectedMethod, setSelectedMethod] = useState<string>('MOBILE_BROWSER');
  const [printSettings, setPrintSettings] = useState({
    labelSize: 'MEDIUM_25MM',
    includeText: true,
    includeBorder: false,
    includeLogo: false,
    copies: 1
  });
  const [qrPreview, setQrPreview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJobId, setGeneratedJobId] = useState<string | null>(null);

  const printFormats: PrintFormat[] = [
    {
      id: 'INDIVIDUAL_LABELS',
      name: 'Individual Labels',
      description: 'One large QR code per page - best for immediate use',
      qrCodesPerPage: 1,
      paperType: 'Standard A4',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'SHEET_LAYOUT',
      name: 'Sheet Layout',
      description: '12 QR codes per page - efficient batch printing',
      qrCodesPerPage: 12,
      paperType: 'Standard A4',
      icon: <Printer className="w-5 h-5" />,
      recommended: true
    },
    {
      id: 'ADHESIVE_LABELS',
      name: 'Adhesive Labels',
      description: '24 labels per page - Avery 5160 compatible',
      qrCodesPerPage: 24,
      paperType: 'Avery 5160 Labels',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const printMethods: PrintMethod[] = [
    {
      id: 'MOBILE_BROWSER',
      name: 'Mobile Browser Print',
      description: 'Print directly from your mobile browser',
      icon: <Smartphone className="w-5 h-5" />,
      available: true
    },
    {
      id: 'PDF_DOWNLOAD',
      name: 'Download PDF',
      description: 'Download PDF to print later or share',
      icon: <Download className="w-5 h-5" />,
      available: true
    },
    {
      id: 'EMAIL_TO_PRINTER',
      name: 'Email to Printer',
      description: 'Send to printer email address',
      icon: <Mail className="w-5 h-5" />,
      available: navigator.onLine
    },
    {
      id: 'NATIVE_SHARE',
      name: 'Share/AirDrop',
      description: 'Use device sharing options',
      icon: <Share2 className="w-5 h-5" />,
      available: 'share' in navigator
    }
  ];

  useEffect(() => {
    // Generate preview QR code for first sample
    if (samples.length > 0) {
      generatePreviewQR();
    }
  }, [samples, printSettings]);

  const generatePreviewQR = async () => {
    if (samples.length === 0) return;

    try {
      const sampleData = {
        v: '1.0',
        t: 'WNV_SAMPLE',
        p: samples[0].poolId,
        tr: samples[0].trapId,
        cd: samples[0].collectionDate,
        lab: samples[0].laboratoryId
      };

      const qrDataURL = await QRCode.toDataURL(JSON.stringify(sampleData), {
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 200
      });

      setQrPreview(qrDataURL);
    } catch (error) {
      // Failed to generate preview QR
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);

    try {
      const printRequest = {
        qrCodes: samples.map(sample => ({
          poolId: sample.poolId,
          trapId: sample.trapId,
          collectionDate: sample.collectionDate,
          species: sample.species,
          collectedBy: sample.collectedBy,
          latitude: sample.latitude,
          longitude: sample.longitude,
          laboratoryId: sample.laboratoryId
        })),
        printFormat: selectedFormat,
        labelSize: printSettings.labelSize,
        copies: printSettings.copies,
        options: {
          includeBorder: printSettings.includeBorder,
          includeText: printSettings.includeText,
          includeLogo: printSettings.includeLogo
        },
        printMethod: selectedMethod
      };

      const response = await fetch('/api/mobile-print/create-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(printRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setGeneratedJobId(result.data.printJob.id);
        
        // Handle different print methods
        switch (selectedMethod) {
          case 'MOBILE_BROWSER':
            await handleMobileBrowserPrint(result.data.printJob.downloadUrl);
            break;
          case 'PDF_DOWNLOAD':
            await handlePDFDownload(result.data.printJob.downloadUrl);
            break;
          case 'EMAIL_TO_PRINTER':
            await handleEmailToPrinter(result.data.printJob.id);
            break;
          case 'NATIVE_SHARE':
            await handleNativeShare(result.data.printJob.downloadUrl);
            break;
        }

        if (onPrintComplete) {
          onPrintComplete(result.data.printJob.id);
        }
      } else {
        throw new Error(result.message || 'Failed to create print job');
      }

    } catch (error) {
      // Print job failed
      alert(`Print failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMobileBrowserPrint = async (downloadUrl: string) => {
    // Open print-optimized page in new window
    const printWindow = window.open(downloadUrl, '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    } else {
      alert('Please allow popups to use mobile browser printing');
    }
  };

  const handlePDFDownload = async (downloadUrl: string) => {
    // Trigger PDF download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `qr-labels-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleEmailToPrinter = async (jobId: string) => {
    const email = prompt('Enter printer email address:');
    if (email) {
      try {
        const response = await fetch('/api/mobile-print/email-to-printer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, email })
        });

        if (response.ok) {
          alert('Email sent to printer successfully!');
        } else {
          throw new Error('Failed to send email');
        }
      } catch (error) {
        alert('Failed to send email to printer');
      }
    }
  };

  const handleNativeShare = async (downloadUrl: string) => {
    if ('share' in navigator) {
      try {
        // First convert the HTML to PDF or get the PDF blob
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        
        const file = new File([blob], 'qr-labels.pdf', { type: 'application/pdf' });
        
        await navigator.share({
          title: 'QR Code Labels',
          text: 'Mosquito pool QR code labels',
          files: [file]
        });
      } catch (error) {
        // Sharing failed, fallback to download
        await handlePDFDownload(downloadUrl);
      }
    }
  };

  const getFormatDescription = (format: PrintFormat) => {
    const pagesNeeded = Math.ceil(samples.length / format.qrCodesPerPage);
    return `${pagesNeeded} page${pagesNeeded !== 1 ? 's' : ''} needed for ${samples.length} samples`;
  };

  return (
    <div className={`mobile-qr-generator space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Printer className="w-5 h-5 mr-2" />
            Mobile QR Code Generator
          </CardTitle>
          <p className="text-gray-600">
            Generate and print {samples.length} QR code labels using your mobile device
          </p>
        </CardHeader>
      </Card>

      {/* QR Code Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {qrPreview ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={qrPreview} 
                  alt="QR Code Preview" 
                  className="w-32 h-32 border border-gray-300 rounded"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Sample:</strong> {samples[0]?.poolId}</p>
                <p><strong>Trap:</strong> {samples[0]?.trapId}</p>
                <p><strong>Date:</strong> {samples[0]?.collectionDate}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              <Printer className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No samples to preview</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Print Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {printFormats.map((format) => (
            <div
              key={format.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="printFormat"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={() => setSelectedFormat(format.id)}
                  className="mt-1"
                />
                <div className="flex items-center space-x-2">
                  {format.icon}
                  {format.recommended && (
                    <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{format.name}</h4>
                  <p className="text-sm text-gray-600">{format.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{getFormatDescription(format)}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Print Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Print Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {printMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                !method.available
                  ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  : selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => method.available && setSelectedMethod(method.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="printMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  disabled={!method.available}
                  onChange={() => setSelectedMethod(method.id)}
                />
                <div className="flex items-center space-x-2">
                  {method.icon}
                  {method.available ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {!method.available && (
                    <p className="text-xs text-red-500">Not available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Print Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label Size
              </label>
              <select
                value={printSettings.labelSize}
                onChange={(e) => setPrintSettings(prev => ({ ...prev, labelSize: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="SMALL_20MM">Small (20mm)</option>
                <option value="MEDIUM_25MM">Medium (25mm)</option>
                <option value="LARGE_30MM">Large (30mm)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Copies
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={printSettings.copies}
                onChange={(e) => setPrintSettings(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={printSettings.includeText}
                onChange={(e) => setPrintSettings(prev => ({ ...prev, includeText: e.target.checked }))}
              />
              <span className="text-sm">Include text labels</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={printSettings.includeBorder}
                onChange={(e) => setPrintSettings(prev => ({ ...prev, includeBorder: e.target.checked }))}
              />
              <span className="text-sm">Include borders</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={printSettings.includeLogo}
                onChange={(e) => setPrintSettings(prev => ({ ...prev, includeLogo: e.target.checked }))}
              />
              <span className="text-sm">Include laboratory logo</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Print Button */}
      <div className="sticky bottom-0 bg-white p-4 border-t">
        <Button
          onClick={handlePrint}
          disabled={isGenerating || samples.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Labels...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Printer className="w-5 h-5" />
              <span>
                {selectedMethod === 'MOBILE_BROWSER' ? 'Print Now' :
                 selectedMethod === 'PDF_DOWNLOAD' ? 'Download PDF' :
                 selectedMethod === 'EMAIL_TO_PRINTER' ? 'Email to Printer' :
                 'Share Labels'}
              </span>
            </div>
          )}
        </Button>

        {generatedJobId && (
          <p className="text-center text-sm text-green-600 mt-2">
            Print job created successfully! ID: {generatedJobId}
          </p>
        )}
      </div>
    </div>
  );
}