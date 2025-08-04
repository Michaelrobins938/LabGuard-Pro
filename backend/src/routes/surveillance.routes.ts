import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SurveillanceService } from '../services/SurveillanceService';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Validation schemas
const labwareConnectionSchema = z.object({
  server: z.string().min(1, 'Server is required'),
  database: z.string().min(1, 'Database is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  port: z.number().optional().default(1433)
});

const nedssAutomationSchema = z.object({
  countyCode: z.string().min(1, 'County code is required'),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  caseData: z.array(z.object({
    patientId: z.string(),
    sampleId: z.string(),
    testType: z.string(),
    result: z.string(),
    collectionDate: z.string(),
    location: z.string()
  }))
});

const arboretUploadSchema = z.object({
  countyCode: z.string().min(1, 'County code is required'),
  weekEnding: z.string().transform((str) => new Date(str)),
  speciesData: z.array(z.object({
    species: z.string(),
    count: z.number(),
    location: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    trapType: z.string(),
    collectionDate: z.string()
  }))
});

const reportGenerationSchema = z.object({
  countyCode: z.string().min(1, 'County code is required'),
  weekEnding: z.string().transform((str) => new Date(str)),
  reportType: z.enum(['weekly', 'monthly', 'quarterly']),
  includeMaps: z.boolean().default(true),
  includeHistorical: z.boolean().default(true)
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * POST /api/surveillance/labware/connect
 * Test connection to LabWare LIMS
 */
router.post('/labware/connect', async (req: Request, res: Response) => {
  try {
    const data = labwareConnectionSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const connection = await SurveillanceService.testLabWareConnection(data, laboratoryId);
    
    res.json({
      success: true,
      message: 'LabWare connection successful',
      data: connection
    });
  } catch (error) {
    console.error('Error testing LabWare connection:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to connect to LabWare' });
  }
});

/**
 * GET /api/surveillance/labware/samples
 * Extract sample data from LabWare
 */
router.get('/labware/samples', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, sampleType } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const samples = await SurveillanceService.extractLabWareSamples(
      laboratoryId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      sampleType as string
    );
    
    res.json({
      success: true,
      data: samples,
      count: samples.length
    });
  } catch (error) {
    console.error('Error extracting LabWare samples:', error);
    res.status(500).json({ error: 'Failed to extract samples from LabWare' });
  }
});

/**
 * POST /api/surveillance/nedss/automate
 * Automate Texas NEDSS data entry
 */
router.post('/nedss/automate', async (req: Request, res: Response) => {
  try {
    const data = nedssAutomationSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await SurveillanceService.automateNEDSSSubmission(
      data,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'NEDSS automation completed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error automating NEDSS submission:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to automate NEDSS submission' });
  }
});

/**
 * POST /api/surveillance/arboret/upload
 * Upload data to CDC ArboNET
 */
router.post('/arboret/upload', async (req: Request, res: Response) => {
  try {
    const data = arboretUploadSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await SurveillanceService.uploadToArboNET(
      data,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'ArboNET upload completed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading to ArboNET:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to upload to ArboNET' });
  }
});

/**
 * POST /api/surveillance/reports/generate
 * Generate automated county reports
 */
router.post('/reports/generate', async (req: Request, res: Response) => {
  try {
    const data = reportGenerationSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const report = await SurveillanceService.generateCountyReport(
      data,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'County report generated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error generating county report:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to generate county report' });
  }
});

/**
 * GET /api/surveillance/reports/history
 * Get report generation history
 */
router.get('/reports/history', async (req: Request, res: Response) => {
  try {
    const { countyCode, startDate, endDate, limit, offset } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const reports = await SurveillanceService.getReportHistory(
      laboratoryId,
      {
        countyCode: countyCode as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0
      }
    );
    
    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching report history:', error);
    res.status(500).json({ error: 'Failed to fetch report history' });
  }
});

/**
 * GET /api/surveillance/analytics/summary
 * Get surveillance analytics summary
 */
router.get('/analytics/summary', async (req: Request, res: Response) => {
  try {
    const { countyCode, timeRange } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const analytics = await SurveillanceService.getAnalyticsSummary(
      laboratoryId,
      countyCode as string,
      timeRange as string
    );
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

/**
 * POST /api/surveillance/equipment/monitor
 * Set up equipment monitoring integration
 */
router.post('/equipment/monitor', async (req: Request, res: Response) => {
  try {
    const { equipmentType, integrationType, credentials } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const monitoring = await SurveillanceService.setupEquipmentMonitoring(
      {
        equipmentType,
        integrationType,
        credentials
      },
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'Equipment monitoring setup successfully',
      data: monitoring
    });
  } catch (error) {
    console.error('Error setting up equipment monitoring:', error);
    res.status(500).json({ error: 'Failed to setup equipment monitoring' });
  }
});

export default router; 