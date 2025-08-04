import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { WestNileVirusService } from '../services/WestNileVirusService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Validation schemas for West Nile virus specific workflows
const mosquitoPoolSchema = z.object({
  poolId: z.string().optional(), // Auto-generated if not provided
  collectionInfo: z.object({
    trapLocation: z.object({
      latitude: z.number(),
      longitude: z.number(),
      address: z.string().optional()
    }),
    collectionDate: z.string().transform(str => new Date(str)),
    collectorName: z.string().min(1, 'Collector name is required'),
    trapType: z.enum(['CDC_LIGHT', 'GRAVID', 'BG_SENTINEL']),
    environmentalConditions: z.object({
      temperature: z.number().optional(),
      humidity: z.number().optional(),
      windSpeed: z.number().optional(),
      precipitation: z.number().optional()
    }).optional()
  }),
  taxonomicInfo: z.object({
    mosquitoSpecies: z.enum(['CULEX_PIPIENS', 'CULEX_QUINQUEFASCIATUS', 'AEDES_ALBOPICTUS', 'OTHER']),
    poolSize: z.number().min(1, 'Pool size must be at least 1'),
    sexDetermination: z.enum(['FEMALE', 'MALE', 'MIXED']),
    speciesConfirmation: z.string().optional()
  }),
  processingInfo: z.object({
    processingDate: z.string().transform(str => new Date(str)),
    processingTechnician: z.string().min(1, 'Processing technician is required'),
    homogenizationMethod: z.string(),
    storageConditions: z.string(),
    extractionDate: z.string().transform(str => new Date(str)).optional()
  })
});

const pcrPlateSchema = z.object({
  plateId: z.string().min(1, 'Plate ID is required'),
  plateFormat: z.enum(['96_WELL']).default('96_WELL'),
  samples: z.array(z.object({
    wellPosition: z.string().regex(/^[A-H](0[1-9]|1[0-2])$/, 'Invalid well position'),
    sampleId: z.string().min(1, 'Sample ID is required'),
    sampleType: z.enum(['SAMPLE', 'POSITIVE_CONTROL', 'NEGATIVE_CONTROL', 'EXTRACTION_CONTROL'])
  })),
  controls: z.object({
    positiveControls: z.array(z.string()),
    negativeControls: z.array(z.string()),
    extractionControls: z.array(z.string())
  }),
  reagentLots: z.object({
    forwardPrimer: z.object({ lot: z.string(), expiration: z.string() }),
    reversePrimer: z.object({ lot: z.string(), expiration: z.string() }),
    probe: z.object({ lot: z.string(), expiration: z.string() }),
    masterMix: z.object({ lot: z.string(), expiration: z.string() })
  })
});

const pcrResultSchema = z.object({
  plateId: z.string().min(1, 'Plate ID is required'),
  results: z.array(z.object({
    wellPosition: z.string(),
    sampleId: z.string(),
    ctValue: z.number().optional(),
    result: z.enum(['POSITIVE', 'NEGATIVE', 'INDETERMINATE', 'INVALID']),
    notes: z.string().optional()
  })),
  qcResults: z.object({
    positiveControlPassed: z.boolean(),
    negativeControlPassed: z.boolean(),
    extractionControlPassed: z.boolean(),
    notes: z.string().optional()
  }),
  runInfo: z.object({
    startTime: z.string().transform(str => new Date(str)),
    endTime: z.string().transform(str => new Date(str)),
    operator: z.string(),
    equipmentId: z.string(),
    protocolVersion: z.string().default('WNV_RT_PCR_v2.1')
  })
});

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * POST /api/west-nile-virus/mosquito-pools
 * Register new mosquito pool sample for West Nile virus testing
 */
router.post('/mosquito-pools', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = mosquitoPoolSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const mosquitoPool = await WestNileVirusService.registerMosquitoPool(
      data,
      laboratoryId,
      userId
    );

    res.status(201).json({
      success: true,
      data: mosquitoPool,
      message: 'Mosquito pool registered successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    console.error('Error registering mosquito pool:', error);
    res.status(500).json({ error: 'Failed to register mosquito pool' });
  }
});

/**
 * GET /api/west-nile-virus/mosquito-pools
 * Get mosquito pool samples with filtering
 */
router.get('/mosquito-pools', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      startDate, 
      endDate, 
      trapType, 
      species, 
      status, 
      page = '1', 
      limit = '50' 
    } = req.query as Record<string, string>;
    
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      trapType: trapType as any,
      species: species as any,
      status: status as any,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await WestNileVirusService.getMosquitoPools(laboratoryId, filters);

    res.json({
      success: true,
      data: result.pools,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / filters.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching mosquito pools:', error);
    res.status(500).json({ error: 'Failed to fetch mosquito pools' });
  }
});

/**
 * POST /api/west-nile-virus/pcr-plates
 * Set up PCR plate for West Nile virus testing
 */
router.post('/pcr-plates', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = pcrPlateSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const pcrPlate = await WestNileVirusService.setupPCRPlate(
      data,
      laboratoryId,
      userId
    );

    res.status(201).json({
      success: true,
      data: pcrPlate,
      message: 'PCR plate setup successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    console.error('Error setting up PCR plate:', error);
    res.status(500).json({ error: 'Failed to setup PCR plate' });
  }
});

/**
 * POST /api/west-nile-virus/pcr-results
 * Submit PCR test results for West Nile virus
 */
router.post('/pcr-results', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = pcrResultSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await WestNileVirusService.submitPCRResults(
      data,
      laboratoryId,
      userId
    );

    res.json({
      success: true,
      data: result,
      message: 'PCR results submitted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    console.error('Error submitting PCR results:', error);
    res.status(500).json({ error: 'Failed to submit PCR results' });
  }
});

/**
 * GET /api/west-nile-virus/surveillance-summary
 * Get West Nile virus surveillance summary for dashboard
 */
router.get('/surveillance-summary', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { timeRange = '30d' } = req.query as { timeRange?: string };
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const summary = await WestNileVirusService.getSurveillanceSummary(
      laboratoryId,
      timeRange
    );

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching surveillance summary:', error);
    res.status(500).json({ error: 'Failed to fetch surveillance summary' });
  }
});

/**
 * GET /api/west-nile-virus/geographic-analysis
 * Get geographic analysis of West Nile virus positive samples
 */
router.get('/geographic-analysis', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      timeRange = '30d',
      includeNegative = 'false'
    } = req.query as Record<string, string>;
    
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const analysis = await WestNileVirusService.getGeographicAnalysis(
      laboratoryId,
      timeRange,
      includeNegative === 'true'
    );

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error performing geographic analysis:', error);
    res.status(500).json({ error: 'Failed to perform geographic analysis' });
  }
});

/**
 * POST /api/west-nile-virus/alerts/positive-detection
 * Send automated alerts for positive West Nile virus detection
 */
router.post('/alerts/positive-detection', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sampleIds, urgencyLevel = 'HIGH' } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const alertResult = await WestNileVirusService.sendPositiveDetectionAlerts(
      sampleIds,
      urgencyLevel,
      laboratoryId,
      userId
    );

    res.json({
      success: true,
      data: alertResult,
      message: 'Positive detection alerts sent successfully'
    });
  } catch (error) {
    console.error('Error sending positive detection alerts:', error);
    res.status(500).json({ error: 'Failed to send alerts' });
  }
});

/**
 * GET /api/west-nile-virus/compliance-report
 * Generate compliance report for West Nile virus testing program
 */
router.get('/compliance-report', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query as Record<string, string>;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const report = await WestNileVirusService.generateComplianceReport(
      laboratoryId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      format as 'json' | 'pdf'
    );

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=wnv-compliance-report.pdf');
      return res.send(report);
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

export default router;