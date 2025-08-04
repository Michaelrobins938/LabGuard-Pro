import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs/promises';

export interface SampleQRData {
  poolId: string;
  trapId: string;
  collectionDate: string;
  latitude?: number;
  longitude?: number;
  species?: string;
  laboratoryId: string;
  collectedBy?: string;
  metadata?: Record<string, any>;
}

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  format?: 'PNG' | 'SVG' | 'PDF';
  includeText?: boolean;
  logoPath?: string;
}

export interface QRCodeResult {
  id: string;
  qrCode: string; // Base64 encoded image or SVG string
  format: string;
  size: number;
  data: SampleQRData;
  generatedAt: Date;
  url?: string; // For stored files
}

export interface QRCodeBatch {
  batchId: string;
  qrCodes: QRCodeResult[];
  totalCount: number;
  generatedAt: Date;
  pdfUrl?: string; // For batch PDF generation
}

export interface PrintJob {
  id: string;
  qrCodes: QRCodeResult[];
  status: 'PENDING' | 'PRINTING' | 'COMPLETED' | 'FAILED';
  printerConfig: PrinterConfig;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export interface PrinterConfig {
  type: 'ZEBRA' | 'BRADY' | 'BROTHER' | 'DYMO' | 'GENERIC';
  model: string;
  connection: 'USB' | 'ETHERNET' | 'BLUETOOTH' | 'WIFI';
  labelSize: {
    width: number; // mm
    height: number; // mm
  };
  dpi: number;
  darkness?: number; // 0-30 for Zebra
  speed?: number; // 1-14 for Zebra
}

class QRCodeService {
  private readonly defaultOptions: Required<QRCodeOptions> = {
    size: 200,
    margin: 4,
    errorCorrectionLevel: 'H',
    format: 'PNG',
    includeText: true,
    logoPath: ''
  };

  private readonly outputDir = path.join(process.cwd(), 'storage', 'qr-codes');
  private readonly tempDir = path.join(process.cwd(), 'storage', 'temp');

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create QR code directories:', error);
    }
  }

  /**
   * Generate a single QR code for a sample
   */
  async generateSampleQR(
    sampleData: SampleQRData,
    options: Partial<QRCodeOptions> = {}
  ): Promise<QRCodeResult> {
    const opts = { ...this.defaultOptions, ...options };
    const qrId = this.generateQRId(sampleData);

    try {
      // Create QR data payload
      const qrPayload = this.createQRPayload(sampleData);

      let qrCode: string;
      let url: string | undefined;

      switch (opts.format) {
        case 'SVG':
          qrCode = await this.generateSVGQR(qrPayload, opts);
          break;
        case 'PDF':
          const pdfResult = await this.generatePDFQR(sampleData, qrPayload, opts);
          qrCode = pdfResult.base64;
          url = pdfResult.filePath;
          break;
        default: // PNG
          const pngResult = await this.generatePNGQR(sampleData, qrPayload, opts);
          qrCode = pngResult.base64;
          url = pngResult.filePath;
      }

      const result: QRCodeResult = {
        id: qrId,
        qrCode,
        format: opts.format,
        size: opts.size,
        data: sampleData,
        generatedAt: new Date(),
        url
      };

      // Log QR code generation for audit trail
      console.log(`QR code generated for sample ${sampleData.poolId}:`, {
        id: qrId,
        format: opts.format,
        size: opts.size,
        timestamp: result.generatedAt
      });

      return result;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw new Error(`QR code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multiple QR codes in a batch
   */
  async generateBatchQRs(
    samples: SampleQRData[],
    options: Partial<QRCodeOptions> = {}
  ): Promise<QRCodeBatch> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCodes: QRCodeResult[] = [];

    try {
      // Generate individual QR codes
      for (const sample of samples) {
        const qrResult = await this.generateSampleQR(sample, options);
        qrCodes.push(qrResult);
      }

      // Generate batch PDF if requested
      let pdfUrl: string | undefined;
      if (options.format === 'PDF' || samples.length > 1) {
        pdfUrl = await this.generateBatchPDF(qrCodes, batchId);
      }

      const batch: QRCodeBatch = {
        batchId,
        qrCodes,
        totalCount: qrCodes.length,
        generatedAt: new Date(),
        pdfUrl
      };

      console.log(`QR code batch generated:`, {
        batchId,
        count: batch.totalCount,
        hasPDF: !!pdfUrl
      });

      return batch;
    } catch (error) {
      console.error('Failed to generate QR code batch:', error);
      throw new Error(`Batch QR generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate PNG QR code with optional logo and text
   */
  private async generatePNGQR(
    sampleData: SampleQRData,
    qrPayload: string,
    options: Required<QRCodeOptions>
  ): Promise<{ base64: string; filePath: string }> {
    // Generate base QR code
    const qrCodeDataURL = await QRCode.toDataURL(qrPayload, {
      width: options.size,
      margin: options.margin,
      errorCorrectionLevel: options.errorCorrectionLevel,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Create canvas for customization
    const canvas = createCanvas(options.size + 100, options.size + (options.includeText ? 60 : 20));
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw QR code
    const qrImage = await loadImage(qrCodeDataURL);
    const qrX = (canvas.width - options.size) / 2;
    const qrY = 10;
    ctx.drawImage(qrImage, qrX, qrY, options.size, options.size);

    // Add logo if specified
    if (options.logoPath) {
      try {
        const logo = await loadImage(options.logoPath);
        const logoSize = options.size * 0.2; // 20% of QR code size
        const logoX = qrX + (options.size - logoSize) / 2;
        const logoY = qrY + (options.size - logoSize) / 2;
        
        // White background for logo
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
        
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      } catch (error) {
        console.warn('Failed to load logo:', error);
      }
    }

    // Add text labels if requested
    if (options.includeText) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      
      const textY = qrY + options.size + 25;
      ctx.fillText(`Pool ID: ${sampleData.poolId}`, canvas.width / 2, textY);
      
      ctx.font = '10px Arial';
      ctx.fillText(`Trap: ${sampleData.trapId}`, canvas.width / 2, textY + 15);
      ctx.fillText(new Date(sampleData.collectionDate).toLocaleDateString(), canvas.width / 2, textY + 30);
    }

    // Convert to base64
    const base64 = canvas.toDataURL('image/png').split(',')[1];

    // Save to file
    const fileName = `${sampleData.poolId}_${Date.now()}.png`;
    const filePath = path.join(this.outputDir, fileName);
    await fs.writeFile(filePath, base64, 'base64');

    return {
      base64: `data:image/png;base64,${base64}`,
      filePath: `/qr-codes/${fileName}`
    };
  }

  /**
   * Generate SVG QR code
   */
  private async generateSVGQR(
    qrPayload: string,
    options: Required<QRCodeOptions>
  ): Promise<string> {
    const svgString = await QRCode.toString(qrPayload, {
      type: 'svg',
      width: options.size,
      margin: options.margin,
      errorCorrectionLevel: options.errorCorrectionLevel,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return svgString;
  }

  /**
   * Generate PDF QR code with label formatting
   */
  private async generatePDFQR(
    sampleData: SampleQRData,
    qrPayload: string,
    options: Required<QRCodeOptions>
  ): Promise<{ base64: string; filePath: string }> {
    // Generate QR code as PNG first
    const qrCodeBuffer = await QRCode.toBuffer(qrPayload, {
      width: options.size,
      margin: options.margin,
      errorCorrectionLevel: options.errorCorrectionLevel
    });

    // Create PDF document with label dimensions
    const doc = new PDFDocument({
      size: [283.5, 141.7], // 100mm x 50mm at 72 DPI
      margins: { top: 10, bottom: 10, left: 10, right: 10 }
    });

    const chunks: Buffer[] = [];
    doc.on('data', chunks.push.bind(chunks));

    // Add QR code
    doc.image(qrCodeBuffer, 10, 10, { width: 100, height: 100 });

    // Add text information
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Pool ID: ${sampleData.poolId}`, 120, 20);
    
    doc.fontSize(10).font('Helvetica');
    doc.text(`Trap: ${sampleData.trapId}`, 120, 40);
    doc.text(`Date: ${new Date(sampleData.collectionDate).toLocaleDateString()}`, 120, 55);
    
    if (sampleData.species) {
      doc.text(`Species: ${sampleData.species.replace(/_/g, ' ')}`, 120, 70);
    }
    
    if (sampleData.collectedBy) {
      doc.text(`Collector: ${sampleData.collectedBy}`, 120, 85);
    }

    // Add barcode-style bottom border
    doc.rect(10, 120, 260, 2).fill('#000000');

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const base64 = pdfBuffer.toString('base64');
          
          // Save to file
          const fileName = `${sampleData.poolId}_${Date.now()}.pdf`;
          const filePath = path.join(this.outputDir, fileName);
          await fs.writeFile(filePath, pdfBuffer);

          resolve({
            base64: `data:application/pdf;base64,${base64}`,
            filePath: `/qr-codes/${fileName}`
          });
        } catch (error) {
          reject(error);
        }
      });

      doc.on('error', reject);
    });
  }

  /**
   * Generate batch PDF with multiple QR codes
   */
  private async generateBatchPDF(qrCodes: QRCodeResult[], batchId: string): Promise<string> {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 20, bottom: 20, left: 20, right: 20 } });
    const chunks: Buffer[] = [];
    doc.on('data', chunks.push.bind(chunks));

    // Calculate layout - 2 columns, 4 rows per page
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const labelWidth = (pageWidth - 60) / 2; // 2 columns with margins
    const labelHeight = (pageHeight - 80) / 4; // 4 rows with margins
    
    let currentX = 20;
    let currentY = 20;
    let labelsOnPage = 0;

    for (const qrResult of qrCodes) {
      // Start new page if needed
      if (labelsOnPage >= 8) {
        doc.addPage();
        currentX = 20;
        currentY = 20;
        labelsOnPage = 0;
      }

      // Draw QR code (regenerate as PNG for PDF)
      const qrBuffer = await QRCode.toBuffer(this.createQRPayload(qrResult.data), {
        width: 150,
        margin: 2,
        errorCorrectionLevel: 'H'
      });

      doc.image(qrBuffer, currentX + 10, currentY + 10, { width: 80, height: 80 });

      // Add text
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(`${qrResult.data.poolId}`, currentX + 100, currentY + 20, { width: labelWidth - 100 });
      
      doc.fontSize(8).font('Helvetica');
      doc.text(`Trap: ${qrResult.data.trapId}`, currentX + 100, currentY + 35);
      doc.text(`Date: ${new Date(qrResult.data.collectionDate).toLocaleDateString()}`, currentX + 100, currentY + 50);
      
      if (qrResult.data.species) {
        doc.text(`Species: ${qrResult.data.species.replace(/_/g, ' ')}`, currentX + 100, currentY + 65);
      }

      // Draw border
      doc.rect(currentX, currentY, labelWidth, labelHeight).stroke();

      // Move to next position
      labelsOnPage++;
      if (labelsOnPage % 2 === 0) {
        // Move to next row
        currentX = 20;
        currentY += labelHeight + 10;
      } else {
        // Move to next column
        currentX += labelWidth + 20;
      }
    }

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const fileName = `batch_${batchId}.pdf`;
          const filePath = path.join(this.outputDir, fileName);
          await fs.writeFile(filePath, pdfBuffer);
          resolve(`/qr-codes/${fileName}`);
        } catch (error) {
          reject(error);
        }
      });

      doc.on('error', reject);
    });
  }

  /**
   * Create QR code payload from sample data
   */
  private createQRPayload(sampleData: SampleQRData): string {
    // Create structured JSON payload
    const payload = {
      v: '1.0', // Version
      t: 'WNV_SAMPLE', // Type
      p: sampleData.poolId,
      tr: sampleData.trapId,
      cd: sampleData.collectionDate,
      lab: sampleData.laboratoryId,
      ...(sampleData.latitude && { lat: sampleData.latitude }),
      ...(sampleData.longitude && { lng: sampleData.longitude }),
      ...(sampleData.species && { sp: sampleData.species }),
      ...(sampleData.collectedBy && { cb: sampleData.collectedBy }),
      ts: Date.now() // Timestamp
    };

    return JSON.stringify(payload);
  }

  /**
   * Generate unique QR ID
   */
  private generateQRId(sampleData: SampleQRData): string {
    const timestamp = Date.now();
    const hash = Buffer.from(`${sampleData.poolId}_${sampleData.trapId}_${timestamp}`)
      .toString('base64')
      .replace(/[+/=]/g, '')
      .substring(0, 8);
    return `QR_${hash}_${timestamp}`;
  }

  /**
   * Validate QR code data
   */
  async validateQRData(qrString: string): Promise<{ valid: boolean; data?: SampleQRData; error?: string }> {
    try {
      const payload = JSON.parse(qrString);
      
      if (!payload.v || !payload.t || payload.t !== 'WNV_SAMPLE') {
        return { valid: false, error: 'Invalid QR code format' };
      }

      if (!payload.p || !payload.tr || !payload.cd || !payload.lab) {
        return { valid: false, error: 'Missing required sample data' };
      }

      const data: SampleQRData = {
        poolId: payload.p,
        trapId: payload.tr,
        collectionDate: payload.cd,
        laboratoryId: payload.lab,
        ...(payload.lat && { latitude: payload.lat }),
        ...(payload.lng && { longitude: payload.lng }),
        ...(payload.sp && { species: payload.sp }),
        ...(payload.cb && { collectedBy: payload.cb })
      };

      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  }

  /**
   * Get QR code statistics
   */
  async getQRCodeStats(): Promise<{
    totalGenerated: number;
    generatedToday: number;
    averageSize: number;
    formatDistribution: Record<string, number>;
  }> {
    try {
      const files = await fs.readdir(this.outputDir);
      const today = new Date().toDateString();
      
      let totalGenerated = 0;
      let generatedToday = 0;
      let totalSize = 0;
      const formatDistribution: Record<string, number> = {};

      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = await fs.stat(filePath);
        
        totalGenerated++;
        totalSize += stats.size;
        
        if (stats.birthtime.toDateString() === today) {
          generatedToday++;
        }

        const ext = path.extname(file).toLowerCase();
        formatDistribution[ext] = (formatDistribution[ext] || 0) + 1;
      }

      return {
        totalGenerated,
        generatedToday,
        averageSize: totalGenerated > 0 ? Math.round(totalSize / totalGenerated) : 0,
        formatDistribution
      };
    } catch (error) {
      console.error('Failed to get QR code stats:', error);
      return {
        totalGenerated: 0,
        generatedToday: 0,
        averageSize: 0,
        formatDistribution: {}
      };
    }
  }

  /**
   * Clean up old QR code files
   */
  async cleanupOldFiles(olderThanDays: number = 30): Promise<number> {
    try {
      const files = await fs.readdir(this.outputDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.birthtime < cutoffDate) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      console.log(`Cleaned up ${deletedCount} old QR code files`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to cleanup old QR code files:', error);
      return 0;
    }
  }
}

export default QRCodeService;