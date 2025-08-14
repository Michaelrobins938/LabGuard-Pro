import { Router } from 'express';
import { Request, Response } from 'express';
import PrinterService, { PrintJobRequest } from '../services/PrinterService';
import QRCodeService from '../services/QRCodeService';
import { z } from 'zod';

const router = Router();
const printerService = new PrinterService();
const qrCodeService = new QRCodeService();

// Validation schemas
const createPrintJobSchema = z.object({
  sampleIds: z.array(z.string()).min(1).max(100),
  printerId: z.string().min(1),
  copies: z.number().min(1).max(10).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  options: z.object({
    includeBorder: z.boolean().optional(),
    includeText: z.boolean().optional(),
    labelSize: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional()
  }).optional()
});

const printerConfigSchema = z.object({
  type: z.enum(['ZEBRA', 'BRADY', 'BROTHER', 'DYMO', 'GENERIC']),
  model: z.string(),
  connection: z.enum(['USB', 'ETHERNET', 'BLUETOOTH', 'WIFI']),
  labelSize: z.object({
    width: z.number().min(10).max(100),
    height: z.number().min(10).max(100)
  }),
  dpi: z.number().min(150).max(600),
  darkness: z.number().min(0).max(30).optional(),
  speed: z.number().min(1).max(14).optional()
});

/**
 * Get all available printers
 * GET /api/printers
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const printers = await printerService.getAvailablePrinters();

    res.json({
      success: true,
      data: printers
    });

  } catch (error) {
    console.error('Get printers error:', error);
    res.status(500).json({
      error: 'Failed to get printers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific printer status
 * GET /api/printers/:id/status
 */
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const status = await printerService.getPrinterStatus(id);

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Get printer status error:', error);
    res.status(500).json({
      error: 'Failed to get printer status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test printer connection
 * POST /api/printers/:id/test
 */
router.post('/:id/test', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testResult = await printerService.testPrinter(id);

    res.json({
      success: true,
      data: testResult
    });

  } catch (error) {
    console.error('Printer test error:', error);
    res.status(500).json({
      error: 'Failed to test printer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get printer statistics
 * GET /api/printers/:id/stats
 */
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    const stats = await printerService.getPrinterStatistics(id, Number(days));

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get printer stats error:', error);
    res.status(500).json({
      error: 'Failed to get printer statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create print job for sample labels
 * POST /api/printers/print-job
 */
router.post('/print-job', async (req: Request, res: Response) => {
  try {
    const validation = createPrintJobSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid print job data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const { sampleIds, printerId, copies = 1, priority = 'NORMAL', options = {} } = validation.data;

    // Get printer configuration
    const printerStatus = await printerService.getPrinterStatus(printerId);
    if (!printerStatus.isOnline || printerStatus.hasError) {
      return res.status(400).json({
        error: 'Printer not available',
        message: printerStatus.errorMessage || 'Printer is offline'
      });
    }

    // Default printer configuration based on printer type
    const printerConfig = {
      type: printerStatus.type as any,
      model: printerStatus.name,
      connection: printerStatus.connection as any,
      labelSize: { width: 25, height: 15 }, // Standard lab label size
      dpi: 203
    };

    // Get sample data for QR generation
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const samples = await prisma.mosquitoPool.findMany({
      where: {
        id: { in: sampleIds },
        laboratoryId
      },
      include: {
        trapLocation: true
      }
    });

    if (samples.length !== sampleIds.length) {
      return res.status(400).json({
        error: 'Some samples not found',
        message: `Found ${samples.length} of ${sampleIds.length} requested samples`
      });
    }

    // Generate QR codes for samples
    const qrCodes = await Promise.all(
      samples.map(async (sample) => {
        const sampleData = {
          poolId: sample.poolId,
          trapId: sample.trapLocation.trapId,
          collectionDate: sample.collectionDate.toISOString().split('T')[0],
          latitude: sample.collectionLatitude || sample.trapLocation.latitude,
          longitude: sample.collectionLongitude || sample.trapLocation.longitude,
          species: sample.mosquitoSpecies,
          laboratoryId,
          collectedBy: sample.collectedBy || undefined
        };

        return await qrCodeService.generateSampleQR(sampleData, {
          size: 150,
          format: 'PNG',
          includeText: false // Text will be added by printer
        });
      })
    );

    // Create print job request
    const printJobRequest: PrintJobRequest = {
      qrCodes,
      printFormat: 'INDIVIDUAL_LABELS',
      labelSize: 'MEDIUM_25MM',
      copies,
      priority,
      options,
      printMethod: 'PDF_DOWNLOAD',
      printerConfig: {
        labelSize: printerConfig.labelSize,
        dpi: printerConfig.dpi
      }
    };

    // Create and execute print job
    const printJob = await printerService.createPrintJob(printJobRequest, laboratoryId);
    
    // Execute the print job asynchronously
    printerService.executePrintJob(printJob.id).then(result => {
      console.log(`Print job ${printJob.id} execution result:`, result);
    }).catch(error => {
      console.error(`Print job ${printJob.id} execution failed:`, error);
    });

    res.status(201).json({
      success: true,
      data: {
        printJob,
        message: `Print job created for ${qrCodes.length} labels`
      }
    });

  } catch (error) {
    console.error('Print job creation error:', error);
    res.status(500).json({
      error: 'Failed to create print job',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get print job status
 * GET /api/printers/print-job/:id
 */
router.get('/print-job/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const printJob = await printerService.getPrintJobStatus(id);

    if (!printJob) {
      return res.status(404).json({ error: 'Print job not found' });
    }

    res.json({
      success: true,
      data: printJob
    });

  } catch (error) {
    console.error('Get print job status error:', error);
    res.status(500).json({
      error: 'Failed to get print job status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get recent print jobs
 * GET /api/printers/print-jobs
 */
router.get('/print-jobs', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const printJobs = await printerService.getRecentPrintJobs(Number(limit));

    res.json({
      success: true,
      data: printJobs
    });

  } catch (error) {
    console.error('Get print jobs error:', error);
    res.status(500).json({
      error: 'Failed to get print jobs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Cancel print job
 * DELETE /api/printers/print-job/:id
 */
router.delete('/print-job/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const printJob = await printerService.getPrintJobStatus(id);

    if (!printJob) {
      return res.status(404).json({ error: 'Print job not found' });
    }

    if (printJob.status === 'COMPLETED') {
      return res.status(400).json({
        error: 'Cannot cancel completed print job'
      });
    }

    // In a real implementation, this would cancel the actual print job
    // For demo, we'll just mark it as cancelled
    printJob.status = 'FAILED';
    printJob.errorMessage = 'Cancelled by user';

    res.json({
      success: true,
      message: 'Print job cancelled'
    });

  } catch (error) {
    console.error('Cancel print job error:', error);
    res.status(500).json({
      error: 'Failed to cancel print job',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;