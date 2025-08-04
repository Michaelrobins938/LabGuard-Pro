import { Router } from 'express';
import { Request, Response } from 'express';
import MobilePrintService, { MobilePrintJobRequest } from '../services/MobilePrintService';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';

const router = Router();
const mobilePrintService = new MobilePrintService();

// Validation schemas
const createMobilePrintJobSchema = z.object({
  qrCodes: z.array(z.object({
    poolId: z.string(),
    trapId: z.string(),
    collectionDate: z.string(),
    species: z.string().optional(),
    collectedBy: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    laboratoryId: z.string()
  })).min(1).max(100),
  printFormat: z.enum(['INDIVIDUAL_LABELS', 'SHEET_LAYOUT', 'ADHESIVE_LABELS']),
  labelSize: z.enum(['SMALL_20MM', 'MEDIUM_25MM', 'LARGE_30MM']),
  copies: z.number().min(1).max(10).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  options: z.object({
    includeBorder: z.boolean().optional(),
    includeText: z.boolean().optional(),
    includeLogo: z.boolean().optional(),
    paperType: z.enum(['STANDARD', 'AVERY_5160', 'AVERY_5161']).optional()
  }).optional(),
  printMethod: z.enum(['MOBILE_BROWSER', 'PDF_DOWNLOAD', 'EMAIL_TO_PRINTER', 'NATIVE_SHARE'])
});

const emailToPrinterSchema = z.object({
  jobId: z.string(),
  email: z.string().email(),
  subject: z.string().optional()
});

/**
 * Create a mobile print job
 * POST /api/mobile-print/create-job
 */
router.post('/create-job', async (req: Request, res: Response) => {
  try {
    const validation = createMobilePrintJobSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid print job data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId || 'demo-lab';
    const printRequest: MobilePrintJobRequest = {
      ...validation.data,
      copies: validation.data.copies || 1,
      priority: validation.data.priority || 'NORMAL'
    };

    const printJob = await mobilePrintService.createMobilePrintJob(printRequest, laboratoryId);

    res.status(201).json({
      success: true,
      data: {
        printJob,
        message: `Mobile print job created for ${printRequest.qrCodes.length} labels`
      }
    });

  } catch (error) {
    console.error('Mobile print job creation error:', error);
    res.status(500).json({
      error: 'Failed to create mobile print job',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get mobile print job status
 * GET /api/mobile-print/job/:id
 */
router.get('/job/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const printJob = await mobilePrintService.getPrintJobStatus(id);

    if (!printJob) {
      return res.status(404).json({ error: 'Mobile print job not found' });
    }

    res.json({
      success: true,
      data: printJob
    });

  } catch (error) {
    console.error('Get mobile print job status error:', error);
    res.status(500).json({
      error: 'Failed to get mobile print job status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get recent mobile print jobs
 * GET /api/mobile-print/jobs
 */
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const printJobs = await mobilePrintService.getRecentPrintJobs(Number(limit));

    res.json({
      success: true,
      data: printJobs
    });

  } catch (error) {
    console.error('Get mobile print jobs error:', error);
    res.status(500).json({
      error: 'Failed to get mobile print jobs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Download print job file
 * GET /api/mobile-print/download/:filename
 */
router.get('/download/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Security: Only allow certain file extensions and validate filename
    if (!filename.match(/^[a-zA-Z0-9_-]+\.(html|pdf)$/)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(process.cwd(), 'storage', 'mobile-print-jobs', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers
    if (filename.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    } else if (filename.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }

    // Send file
    res.sendFile(filePath);

  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      error: 'Failed to download file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Email print job to printer
 * POST /api/mobile-print/email-to-printer
 */
router.post('/email-to-printer', async (req: Request, res: Response) => {
  try {
    const validation = emailToPrinterSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid email data',
        details: validation.error.errors
      });
    }

    const { jobId, email, subject } = validation.data;

    // Get the print job
    const printJob = await mobilePrintService.getPrintJobStatus(jobId);
    if (!printJob) {
      return res.status(404).json({ error: 'Print job not found' });
    }

    // TODO: Implement actual email sending
    // For now, simulate email sending
    console.log(`Simulating email to ${email} for job ${jobId}`);
    
    // In a real implementation, you would:
    // 1. Get the HTML file or generate PDF
    // 2. Use an email service (SendGrid, AWS SES, etc.)
    // 3. Send the email with the attachment

    res.json({
      success: true,
      message: `Print job emailed to ${email}`,
      data: {
        jobId,
        email,
        subject: subject || 'QR Code Labels for Printing'
      }
    });

  } catch (error) {
    console.error('Email to printer error:', error);
    res.status(500).json({
      error: 'Failed to email print job',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get available mobile printers
 * GET /api/mobile-print/printers
 */
router.get('/printers', async (req: Request, res: Response) => {
  try {
    const printers = await mobilePrintService.getAvailablePrinters();

    res.json({
      success: true,
      data: printers
    });

  } catch (error) {
    console.error('Get mobile printers error:', error);
    res.status(500).json({
      error: 'Failed to get mobile printers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test mobile printer
 * POST /api/mobile-print/test-printer/:id
 */
router.post('/test-printer/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testResult = await mobilePrintService.testPrinter(id);

    res.json({
      success: true,
      data: testResult
    });

  } catch (error) {
    console.error('Test mobile printer error:', error);
    res.status(500).json({
      error: 'Failed to test mobile printer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get mobile printer statistics
 * GET /api/mobile-print/printer/:id/stats
 */
router.get('/printer/:id/stats', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    const stats = await mobilePrintService.getPrinterStatistics(id, Number(days));

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get mobile printer stats error:', error);
    res.status(500).json({
      error: 'Failed to get mobile printer statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get print formats and capabilities
 * GET /api/mobile-print/formats
 */
router.get('/formats', async (req: Request, res: Response) => {
  try {
    const formats = [
      {
        id: 'INDIVIDUAL_LABELS',
        name: 'Individual Labels',
        description: 'One large QR code per page - best for immediate use',
        qrCodesPerPage: 1,
        paperType: 'Standard A4',
        dimensions: { width: '210mm', height: '297mm' },
        recommended: false
      },
      {
        id: 'SHEET_LAYOUT',
        name: 'Sheet Layout',
        description: '12 QR codes per page - efficient batch printing',
        qrCodesPerPage: 12,
        paperType: 'Standard A4',
        dimensions: { width: '210mm', height: '297mm' },
        recommended: true
      },
      {
        id: 'ADHESIVE_LABELS',
        name: 'Adhesive Labels',
        description: '24 labels per page - Avery 5160 compatible',
        qrCodesPerPage: 24,
        paperType: 'Avery 5160 Labels',
        dimensions: { width: '66.7mm', height: '25.4mm' },
        recommended: false
      }
    ];

    const methods = [
      {
        id: 'MOBILE_BROWSER',
        name: 'Mobile Browser Print',
        description: 'Print directly from your mobile browser',
        requirements: ['Modern web browser', 'Printer connected to device'],
        platforms: ['iOS Safari', 'Android Chrome', 'Desktop browsers']
      },
      {
        id: 'PDF_DOWNLOAD',
        name: 'Download PDF',
        description: 'Download PDF to print later or share',
        requirements: ['PDF viewer app'],
        platforms: ['All devices']
      },
      {
        id: 'EMAIL_TO_PRINTER',
        name: 'Email to Printer',
        description: 'Send to printer email address',
        requirements: ['Email-enabled printer', 'Internet connection'],
        platforms: ['HP Smart', 'Canon PRINT', 'Epson Connect', 'Brother Mobile Connect']
      },
      {
        id: 'NATIVE_SHARE',
        name: 'Share/AirDrop',
        description: 'Use device sharing options',
        requirements: ['Native sharing support'],
        platforms: ['iOS (AirDrop)', 'Android (Share)', 'Windows (Share)']
      }
    ];

    res.json({
      success: true,
      data: {
        formats,
        methods,
        supportedLabelSizes: [
          { id: 'SMALL_20MM', name: 'Small (20mm)', description: 'Compact labels for small containers' },
          { id: 'MEDIUM_25MM', name: 'Medium (25mm)', description: 'Standard laboratory labels' },
          { id: 'LARGE_30MM', name: 'Large (30mm)', description: 'Large labels for easy scanning' }
        ]
      }
    });

  } catch (error) {
    console.error('Get print formats error:', error);
    res.status(500).json({
      error: 'Failed to get print formats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;