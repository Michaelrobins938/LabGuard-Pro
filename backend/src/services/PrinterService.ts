import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

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

export interface PrintJob {
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

export interface PrintJobRequest {
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

export interface ZebraPrintCommand {
  command: string;
  parameters: Record<string, any>;
}

class PrinterService {
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
   * Generate Zebra ZPL commands for label printing
   */
  private async generateZebraCommands(printJob: PrintJob, request: PrintJobRequest): Promise<void> {
    const commands: ZebraPrintCommand[] = [];
    const config = request.printerConfig;
    
    // Calculate label dimensions in dots (203 or 300 DPI)
    const dpi = config.dpi || 203;
    const labelWidthDots = Math.round((config.labelSize.width / 25.4) * dpi);
    const labelHeightDots = Math.round((config.labelSize.height / 25.4) * dpi);

    for (let i = 0; i < request.qrCodes.length; i++) {
      const qrCode = request.qrCodes[i];
      const copies = request.copies || 1;

      for (let copy = 0; copy < copies; copy++) {
        const zplCommands = [
          '^XA', // Start format
          
          // Set label dimensions
          `^LL${labelHeightDots}`, // Label length
          `^PW${labelWidthDots}`, // Print width
          
          // Set print parameters
          `^MD${config.darkness || 15}`, // Media darkness (0-30)
          `^PR${config.speed || 4}`, // Print rate (1-14)
          
          // QR Code field
          '^FO50,50', // Field origin (50 dots from left, 50 from top)
          '^BQN,2,6', // QR code, normal orientation, model 2, magnification 6
          `^FDQA,${qrCode.data.poolId}^FS`, // QR data
          
          // Pool ID text
          '^FO200,50', // Text position
          '^A0N,30,30', // Font size
          `^FD${qrCode.data.poolId}^FS`, // Pool ID
          
          // Trap ID text
          '^FO200,90',
          '^A0N,20,20',
          `^FDTrap: ${qrCode.data.trapId}^FS`,
          
          // Collection date
          '^FO200,120',
          '^A0N,20,20',
          `^FD${new Date(qrCode.data.collectionDate).toLocaleDateString()}^FS`,
          
          // Species (if available)
          ...(qrCode.data.species ? [
            '^FO200,150',
            '^A0N,18,18',
            `^FD${qrCode.data.species.replace(/_/g, ' ')}^FS`
          ] : []),
          
          // Border (if requested)
          ...(request.options?.includeBorder ? [
            '^FO10,10',
            `^GB${labelWidthDots - 20},${labelHeightDots - 20},2^FS`
          ] : []),
          
          // Copy number (if multiple copies)
          ...(copies > 1 ? [
            '^FO10,10',
            '^A0N,15,15',
            `^FDCopy ${copy + 1}/${copies}^FS`
          ] : []),
          
          '^XZ' // End format
        ];

        commands.push({
          command: zplCommands.join('\n'),
          description: `Label ${i + 1}/${request.qrCodes.length}, Copy ${copy + 1}/${copies}: ${qrCode.data.poolId}`
        });
      }
    }

    // Save ZPL commands to file
    const zplFile = path.join(this.printJobsDir, `${printJob.id}.zpl`);
    const allCommands = commands.map(c => c.command).join('\n\n');
    await fs.writeFile(zplFile, allCommands);

    console.log(`Generated ${commands.length} ZPL commands for Zebra printer`);
  }

  /**
   * Generate Brady printer commands
   */
  private async generateBradyCommands(printJob: PrintJob, request: PrintJobRequest): Promise<void> {
    // Brady printers typically use proprietary software
    // Generate CSV file for Brady Workstation import
    const csvData = request.qrCodes.map(qr => [
      qr.data.poolId,
      qr.data.trapId,
      qr.data.collectionDate,
      qr.data.species || '',
      qr.data.collectedBy || ''
    ]);

    const csvContent = [
      'Pool ID,Trap ID,Collection Date,Species,Collected By',
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const csvFile = path.join(this.printJobsDir, `${printJob.id}.csv`);
    await fs.writeFile(csvFile, csvContent);

    console.log(`Generated Brady CSV file for ${request.qrCodes.length} labels`);
  }

  /**
   * Generate Brother P-touch commands
   */
  private async generateBrotherCommands(printJob: PrintJob, request: PrintJobRequest): Promise<void> {
    // Brother P-touch uses P-touch Template format
    const templates = request.qrCodes.map((qr, index) => ({
      template: 'QR_LABEL_TEMPLATE',
      data: {
        POOL_ID: qr.data.poolId,
        TRAP_ID: qr.data.trapId,
        DATE: new Date(qr.data.collectionDate).toLocaleDateString(),
        SPECIES: qr.data.species?.replace(/_/g, ' ') || '',
        QR_DATA: JSON.stringify(qr.data)
      }
    }));

    const templateFile = path.join(this.printJobsDir, `${printJob.id}.json`);
    await fs.writeFile(templateFile, JSON.stringify(templates, null, 2));

    console.log(`Generated Brother P-touch template for ${request.qrCodes.length} labels`);
  }

  /**
   * Generate DYMO LabelWriter commands
   */
  private async generateDymoCommands(printJob: PrintJob, request: PrintJobRequest): Promise<void> {
    // DYMO uses XML label format
    const xmlLabels = request.qrCodes.map(qr => `
      <Label>
        <QRCode>
          <Data>${JSON.stringify(qr.data)}</Data>
          <Size>Medium</Size>
        </QRCode>
        <Text>
          <Value>${qr.data.poolId}</Value>
          <Font>Arial</Font>
          <Size>12</Size>
        </Text>
        <Text>
          <Value>Trap: ${qr.data.trapId}</Value>
          <Font>Arial</Font>
          <Size>10</Size>
        </Text>
        <Text>
          <Value>${new Date(qr.data.collectionDate).toLocaleDateString()}</Value>
          <Font>Arial</Font>
          <Size>10</Size>
        </Text>
      </Label>
    `).join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <Labels>
      ${xmlLabels}
    </Labels>`;

    const xmlFile = path.join(this.printJobsDir, `${printJob.id}.xml`);
    await fs.writeFile(xmlFile, xmlContent);

    console.log(`Generated DYMO XML file for ${request.qrCodes.length} labels`);
  }

  /**
   * Generate generic print commands (PDF/browser printing)
   */
  private async generateGenericCommands(printJob: PrintJob, request: PrintJobRequest): Promise<void> {
    // Generate HTML template for browser printing
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sample Labels - Print Job ${printJob.id}</title>
      <style>
        @page {
          size: ${request.printerConfig.labelSize.width}mm ${request.printerConfig.labelSize.height}mm;
          margin: 0;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .label {
          width: ${request.printerConfig.labelSize.width}mm;
          height: ${request.printerConfig.labelSize.height}mm;
          padding: 2mm;
          box-sizing: border-box;
          page-break-after: always;
          display: flex;
          align-items: center;
          border: ${request.options?.includeBorder ? '1px solid black' : 'none'};
        }
        .qr-code {
          width: 15mm;
          height: 15mm;
          margin-right: 2mm;
        }
        .label-text {
          flex: 1;
        }
        .pool-id {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 1mm;
        }
        .details {
          font-size: 8px;
          line-height: 1.2;
        }
      </style>
    </head>
    <body>
      ${request.qrCodes.map(qr => `
        <div class="label">
          <img src="${qr.qrCode}" alt="QR Code" class="qr-code">
          <div class="label-text">
            <div class="pool-id">${qr.data.poolId}</div>
            <div class="details">
              Trap: ${qr.data.trapId}<br>
              ${new Date(qr.data.collectionDate).toLocaleDateString()}<br>
              ${qr.data.species ? qr.data.species.replace(/_/g, ' ') : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </body>
    </html>`;

    const htmlFile = path.join(this.printJobsDir, `${printJob.id}.html`);
    await fs.writeFile(htmlFile, htmlContent);

    console.log(`Generated HTML template for ${request.qrCodes.length} labels`);
  }

  /**
   * Get printer status (simulate for demo)
   */
  async getPrinterStatus(printerId: string): Promise<PrinterStatus> {
    // In a real implementation, this would query actual printer status
    // For demo purposes, we'll simulate various printer states
    
    const printers: Record<string, PrinterStatus> = {
      'zebra-001': {
        id: 'zebra-001',
        name: 'Zebra ZD620 - Lab Station 1',
        type: 'ZEBRA',
        connection: 'USB',
        isOnline: true,
        hasError: false,
        paperLevel: 85,
        lastPrintJob: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        totalJobs: 247
      },
      'dymo-002': {
        id: 'dymo-002',
        name: 'DYMO LabelWriter 4XL - Sample Prep',
        type: 'DYMO',
        connection: 'USB',
        isOnline: true,
        hasError: false,
        paperLevel: 45,
        lastPrintJob: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        totalJobs: 89
      },
      'brother-003': {
        id: 'brother-003',
        name: 'Brother PT-P750W - Mobile Station',
        type: 'BROTHER',
        connection: 'WIFI',
        isOnline: false,
        hasError: true,
        errorMessage: 'Paper jam detected',
        paperLevel: 20,
        lastPrintJob: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        totalJobs: 156
      }
    };

    return printers[printerId] || {
      id: printerId,
      name: 'Unknown Printer',
      type: 'GENERIC',
      connection: 'UNKNOWN',
      isOnline: false,
      hasError: true,
      errorMessage: 'Printer not found'
    };
  }

  /**
   * Get all available printers
   */
  async getAvailablePrinters(): Promise<PrinterStatus[]> {
    const printerIds = ['zebra-001', 'dymo-002', 'brother-003'];
    const printers = await Promise.all(
      printerIds.map(id => this.getPrinterStatus(id))
    );
    return printers;
  }

  /**
   * Execute print job (simulate for demo)
   */
  async executePrintJob(jobId: string): Promise<{ success: boolean; message: string }> {
    try {
      const jobFile = path.join(this.printJobsDir, `${jobId}.json`);
      const jobData = await fs.readFile(jobFile, 'utf-8');
      const printJob: PrintJob = JSON.parse(jobData);

      // Simulate print execution
      printJob.status = 'PRINTING';
      await fs.writeFile(jobFile, JSON.stringify(printJob, null, 2));

      // Simulate print time (1-3 seconds per label)
      const printTime = printJob.qrCodes.length * (1000 + Math.random() * 2000);
      
      await new Promise(resolve => setTimeout(resolve, Math.min(printTime, 5000))); // Max 5 seconds for demo

      // Random success/failure for realistic simulation
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        printJob.status = 'COMPLETED';
        printJob.completedAt = new Date();
        await fs.writeFile(jobFile, JSON.stringify(printJob, null, 2));

        return {
          success: true,
          message: `Successfully printed ${printJob.qrCodes.length} labels`
        };
      } else {
        printJob.status = 'FAILED';
        printJob.errorMessage = 'Printer communication error';
        await fs.writeFile(jobFile, JSON.stringify(printJob, null, 2));

        return {
          success: false,
          message: 'Print job failed - please check printer connection'
        };
      }

    } catch (error) {
      console.error('Print job execution error:', error);
      return {
        success: false,
        message: `Print job failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get print job status
   */
  async getPrintJobStatus(jobId: string): Promise<PrintJob | null> {
    try {
      const jobFile = path.join(this.printJobsDir, `${jobId}.json`);
      const jobData = await fs.readFile(jobFile, 'utf-8');
      return JSON.parse(jobData);
    } catch (error) {
      console.error('Failed to get print job status:', error);
      return null;
    }
  }

  /**
   * Get recent print jobs
   */
  async getRecentPrintJobs(limit: number = 10): Promise<PrintJob[]> {
    try {
      const files = await fs.readdir(this.printJobsDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const jobs: PrintJob[] = [];
      for (const file of jsonFiles.slice(-limit)) {
        try {
          const jobData = await fs.readFile(path.join(this.printJobsDir, file), 'utf-8');
          jobs.push(JSON.parse(jobData));
        } catch (error) {
          console.warn(`Failed to read print job ${file}:`, error);
        }
      }

      return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Failed to get recent print jobs:', error);
      return [];
    }
  }

  /**
   * Generate unique print job ID
   */
  private generatePrintJobId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `PJ_${timestamp}_${random}`;
  }

  /**
   * Test printer connection
   */
  async testPrinter(printerId: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      const printer = await this.getPrinterStatus(printerId);
      const latency = Date.now() - startTime;

      if (printer.isOnline && !printer.hasError) {
        return {
          success: true,
          message: `Printer ${printer.name} is online and ready`,
          latency
        };
      } else {
        return {
          success: false,
          message: printer.errorMessage || 'Printer is offline or has errors',
          latency
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Printer test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        latency: Date.now() - startTime
      };
    }
  }

  /**
   * Get printer usage statistics
   */
  async getPrinterStatistics(printerId: string, days: number = 30): Promise<{
    totalJobs: number;
    successRate: number;
    averageJobTime: number;
    labelsPerDay: number;
    paperUsage: number;
  }> {
    // Simulate statistics for demo
    const baseJobs = Math.floor(Math.random() * 100) + 50;
    const successRate = 0.85 + Math.random() * 0.14; // 85-99%
    
    return {
      totalJobs: baseJobs,
      successRate: parseFloat(successRate.toFixed(3)),
      averageJobTime: 15 + Math.random() * 30, // 15-45 seconds
      labelsPerDay: Math.floor(baseJobs / days),
      paperUsage: Math.floor(baseJobs * 2.3) // Assume ~2.3 labels per job on average
    };
  }
}

export default PrinterService;