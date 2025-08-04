import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export interface MobilePrinterConfig {
  type: 'OFFICE_PRINTER' | 'MOBILE_BROWSER' | 'EMAIL_TO_PRINT' | 'CLOUD_PRINT';
  name: string;
  brand?: 'HP' | 'CANON' | 'BROTHER' | 'EPSON' | 'GENERIC';
  connection: 'WIFI' | 'USB' | 'ETHERNET' | 'MOBILE_APP' | 'EMAIL';
  emailAddress?: string;
  ipAddress?: string;
  mobileApp?: string;
  capabilities: {
    labelSupport: boolean;
    maxResolution: number;
    colorSupport: boolean;
    mobilePrintSupport: boolean;
  };
}

export interface PrinterStatus {
  id: string;
  name: string;
  type: 'OFFICE_PRINTER' | 'MOBILE_BROWSER' | 'EMAIL_TO_PRINT' | 'CLOUD_PRINT';
  connection: string;
  isOnline: boolean;
  hasError: boolean;
  errorMessage?: string;
  paperLevel?: number;
  lastPrintJob?: Date;
  totalJobs?: number;
  mobileCompatible: boolean;
  emailAddress?: string;
}

export interface MobilePrintJobRequest {
  qrCodes: any[];
  printFormat: 'INDIVIDUAL_LABELS' | 'SHEET_LAYOUT' | 'ADHESIVE_LABELS';
  labelSize: 'SMALL_20MM' | 'MEDIUM_25MM' | 'LARGE_30MM';
  copies?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  options?: {
    includeBorder?: boolean;
    includeText?: boolean;
    includeLogo?: boolean;
    paperType?: 'STANDARD' | 'AVERY_5160' | 'AVERY_5161';
  };
  printMethod: 'MOBILE_BROWSER' | 'PDF_DOWNLOAD' | 'EMAIL_TO_PRINTER' | 'NATIVE_SHARE';
}

export interface MobilePrintJob {
  id: string;
  qrCodes: any[];
  format: string;
  status: 'PENDING' | 'GENERATING' | 'READY' | 'COMPLETED' | 'FAILED';
  printMethod: string;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  emailSent?: boolean;
  errorMessage?: string;
}

class MobilePrintService {
  private readonly printJobsDir = path.join(process.cwd(), 'storage', 'mobile-print-jobs');
  private readonly templatesDir = path.join(process.cwd(), 'storage', 'mobile-templates');

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure mobile print directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.printJobsDir, { recursive: true });
      await fs.mkdir(this.templatesDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create mobile print directories:', error);
    }
  }

  /**
   * Create a mobile print job for QR code labels
   */
  async createMobilePrintJob(request: MobilePrintJobRequest, laboratoryId: string): Promise<MobilePrintJob> {
    const jobId = this.generatePrintJobId();
    
    try {
      const printJob: MobilePrintJob = {
        id: jobId,
        qrCodes: request.qrCodes,
        format: request.printFormat,
        status: 'PENDING',
        printMethod: request.printMethod,
        createdAt: new Date()
      };

      // Generate mobile-optimized print content based on format
      switch (request.printFormat) {
        case 'INDIVIDUAL_LABELS':
          await this.generateIndividualLabelsHTML(printJob, request);
          break;
        case 'SHEET_LAYOUT':
          await this.generateSheetLayoutHTML(printJob, request);
          break;
        case 'ADHESIVE_LABELS':
          await this.generateAdhesiveLabelsHTML(printJob, request);
          break;
        default:
          throw new Error(`Unsupported format: ${request.printFormat}`);
      }

      // Store mobile print job
      const printJobFile = path.join(this.printJobsDir, `${jobId}.json`);
      await fs.writeFile(printJobFile, JSON.stringify(printJob, null, 2));

      console.log(`Mobile print job ${jobId} created for ${request.qrCodes.length} labels`);
      return printJob;

    } catch (error) {
      console.error('Failed to create mobile print job:', error);
      throw new Error(`Mobile print job creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate individual labels HTML (one QR code per page)
   */
  private async generateIndividualLabelsHTML(printJob: MobilePrintJob, request: MobilePrintJobRequest): Promise<void> {
    const qrCodes = await Promise.all(
      request.qrCodes.map(async (qrData) => {
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          width: 200
        });
        return { qrCodeDataURL, data: qrData };
      })
    );

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Individual QR Labels - ${printJob.id}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .label-page {
            width: 210mm;
            height: 297mm;
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: always;
        }
        .label-page:last-child {
            page-break-after: avoid;
        }
        .qr-label {
            border: ${request.options?.includeBorder ? '2px solid #000' : 'none'};
            padding: 10mm;
            text-align: center;
            background: white;
        }
        .qr-code {
            width: 40mm;
            height: 40mm;
            margin: 0 auto 5mm auto;
        }
        .label-text {
            font-size: 12pt;
            font-weight: bold;
            margin: 3mm 0;
        }
        .label-details {
            font-size: 10pt;
            color: #333;
            line-height: 1.3;
        }
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    ${qrCodes.map(({ qrCodeDataURL, data }) => `
        <div class="label-page">
            <div class="qr-label">
                <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">
                ${request.options?.includeText ? `
                    <div class="label-text">${data.poolId}</div>
                    <div class="label-details">
                        Trap: ${data.trapId}<br>
                        Date: ${new Date(data.collectionDate).toLocaleDateString()}<br>
                        ${data.species ? `Species: ${data.species.replace(/_/g, ' ')}<br>` : ''}
                        ${data.collectedBy ? `Collected by: ${data.collectedBy}` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('')}
</body>
</html>`;

    const htmlFile = path.join(this.printJobsDir, `${printJob.id}.html`);
    await fs.writeFile(htmlFile, htmlContent);
    printJob.downloadUrl = `/api/mobile-print/download/${printJob.id}.html`;
  }

  /**
   * Generate sheet layout HTML (12 QR codes per page)
   */
  private async generateSheetLayoutHTML(printJob: MobilePrintJob, request: MobilePrintJobRequest): Promise<void> {
    const qrCodes = await Promise.all(
      request.qrCodes.map(async (qrData) => {
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          margin: 1,
          width: 150
        });
        return { qrCodeDataURL, data: qrData };
      })
    );

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Sheet Layout QR Labels - ${printJob.id}</title>
    <style>
        @page {
            size: A4;
            margin: 10mm;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .sheet-page {
            width: 190mm;
            height: 277mm;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 5mm;
            page-break-after: always;
        }
        .sheet-page:last-child {
            page-break-after: avoid;
        }
        .qr-label {
            border: 1px dashed #666;
            padding: 3mm;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .qr-code {
            width: 25mm;
            height: 25mm;
            margin-bottom: 2mm;
        }
        .label-text {
            font-size: 8pt;
            font-weight: bold;
            margin: 1mm 0;
        }
        .label-details {
            font-size: 6pt;
            color: #333;
            line-height: 1.2;
        }
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    ${this.chunkArray(qrCodes, 12).map(chunk => `
        <div class="sheet-page">
            ${chunk.map(({ qrCodeDataURL, data }) => `
                <div class="qr-label">
                    <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">
                    ${request.options?.includeText ? `
                        <div class="label-text">${data.poolId}</div>
                        <div class="label-details">
                            ${data.trapId}<br>
                            ${new Date(data.collectionDate).toLocaleDateString()}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>`;

    const htmlFile = path.join(this.printJobsDir, `${printJob.id}.html`);
    await fs.writeFile(htmlFile, htmlContent);
    printJob.downloadUrl = `/api/mobile-print/download/${printJob.id}.html`;
  }

  /**
   * Generate Avery-style adhesive labels HTML (24 labels per page)
   */
  private async generateAdhesiveLabelsHTML(printJob: MobilePrintJob, request: MobilePrintJobRequest): Promise<void> {
    const qrCodes = await Promise.all(
      request.qrCodes.map(async (qrData) => {
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          margin: 1,
          width: 120
        });
        return { qrCodeDataURL, data: qrData };
      })
    );

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Adhesive Labels - ${printJob.id}</title>
    <style>
        @page {
            size: A4;
            margin: 15.5mm 0 0 5mm;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .avery-page {
            width: 210mm;
            height: 297mm;
            display: grid;
            grid-template-columns: repeat(3, 66.7mm);
            grid-template-rows: repeat(8, 33.9mm);
            gap: 0;
            page-break-after: always;
        }
        .avery-page:last-child {
            page-break-after: avoid;
        }
        .qr-label {
            width: 66.7mm;
            height: 33.9mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: none;
        }
        .qr-code {
            width: 18mm;
            height: 18mm;
            margin-bottom: 1mm;
        }
        .label-text {
            font-size: 6pt;
            font-weight: bold;
            text-align: center;
            line-height: 1.0;
        }
        .label-details {
            font-size: 5pt;
            color: #333;
            text-align: center;
            line-height: 1.0;
        }
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    ${this.chunkArray(qrCodes, 24).map(chunk => `
        <div class="avery-page">
            ${chunk.map(({ qrCodeDataURL, data }) => `
                <div class="qr-label">
                    <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">
                    ${request.options?.includeText ? `
                        <div class="label-text">${data.poolId}</div>
                        <div class="label-details">${data.trapId}</div>
                    ` : ''}
                </div>
            `).join('')}
            ${Array(24 - chunk.length).fill(0).map(() => '<div class="qr-label"></div>').join('')}
        </div>
    `).join('')}
</body>
</html>`;

    const htmlFile = path.join(this.printJobsDir, `${printJob.id}.html`);
    await fs.writeFile(htmlFile, htmlContent);
    printJob.downloadUrl = `/api/mobile-print/download/${printJob.id}.html`;
  }

  /**
   * Get available mobile-compatible printers (simulated)
   */
  async getAvailablePrinters(): Promise<PrinterStatus[]> {
    // Simulate common office printers that support mobile printing
    return [
      {
        id: 'mobile-browser',
        name: 'Mobile Browser Print',
        type: 'MOBILE_BROWSER',
        connection: 'BROWSER',
        isOnline: true,
        hasError: false,
        mobileCompatible: true,
        totalJobs: 0
      },
      {
        id: 'office-hp-001',
        name: 'HP LaserJet Pro 400 - Office',
        type: 'OFFICE_PRINTER',
        connection: 'WIFI',
        isOnline: true,
        hasError: false,
        paperLevel: 75,
        mobileCompatible: true,
        totalJobs: 142
      },
      {
        id: 'office-canon-001',
        name: 'Canon PIXMA - Lab Station',
        type: 'OFFICE_PRINTER',
        connection: 'WIFI',
        isOnline: true,
        hasError: false,
        paperLevel: 60,
        mobileCompatible: true,
        totalJobs: 89
      },
      {
        id: 'email-print-001',
        name: 'Email to Printer Service',
        type: 'EMAIL_TO_PRINT',
        connection: 'EMAIL',
        isOnline: true,
        hasError: false,
        mobileCompatible: true,
        emailAddress: 'printer@lab.example.com',
        totalJobs: 34
      }
    ];
  }

  /**
   * Get print job status
   */
  async getPrintJobStatus(jobId: string): Promise<MobilePrintJob | null> {
    try {
      const jobFile = path.join(this.printJobsDir, `${jobId}.json`);
      const jobData = await fs.readFile(jobFile, 'utf-8');
      return JSON.parse(jobData);
    } catch (error) {
      console.error('Failed to get mobile print job status:', error);
      return null;
    }
  }

  /**
   * Get recent print jobs
   */
  async getRecentPrintJobs(limit: number = 10): Promise<MobilePrintJob[]> {
    try {
      const files = await fs.readdir(this.printJobsDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const jobs: MobilePrintJob[] = [];
      for (const file of jsonFiles.slice(-limit)) {
        try {
          const jobData = await fs.readFile(path.join(this.printJobsDir, file), 'utf-8');
          jobs.push(JSON.parse(jobData));
        } catch (error) {
          console.warn(`Failed to read mobile print job ${file}:`, error);
        }
      }

      return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Failed to get recent mobile print jobs:', error);
      return [];
    }
  }

  /**
   * Generate unique print job ID
   */
  private generatePrintJobId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `MPJ_${timestamp}_${random}`;
  }

  /**
   * Utility function to chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get printer statistics (simulated for mobile/office printers)
   */
  async getPrinterStatistics(printerId: string, days: number = 30): Promise<{
    totalJobs: number;
    successRate: number;
    averageJobTime: number;
    labelsPerDay: number;
    paperUsage: number;
  }> {
    // Simulate statistics for mobile/office printing
    const baseJobs = Math.floor(Math.random() * 50) + 20;
    const successRate = 0.90 + Math.random() * 0.09; // 90-99%
    
    return {
      totalJobs: baseJobs,
      successRate: parseFloat(successRate.toFixed(3)),
      averageJobTime: 30 + Math.random() * 60, // 30-90 seconds
      labelsPerDay: Math.floor(baseJobs / days),
      paperUsage: Math.floor(baseJobs * 1.8) // Assume ~1.8 labels per job on average
    };
  }

  /**
   * Test printer connection (simplified for mobile/office printers)
   */
  async testPrinter(printerId: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      // Simulate printer test for different types
      if (printerId === 'mobile-browser') {
        return {
          success: true,
          message: 'Mobile browser printing is available',
          latency: Date.now() - startTime
        };
      }

      if (printerId.startsWith('office-')) {
        // Simulate office printer test
        const isOnline = Math.random() > 0.1; // 90% success rate
        return {
          success: isOnline,
          message: isOnline ? 'Office printer is online and ready' : 'Office printer is offline',
          latency: Date.now() - startTime
        };
      }

      if (printerId.startsWith('email-')) {
        return {
          success: true,
          message: 'Email-to-print service is available',
          latency: Date.now() - startTime
        };
      }

      return {
        success: false,
        message: 'Unknown printer type',
        latency: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        message: `Printer test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        latency: Date.now() - startTime
      };
    }
  }
}

export default MobilePrintService;