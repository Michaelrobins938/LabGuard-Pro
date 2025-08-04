import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PublicHealthService } from '../services/PublicHealthService';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Validation schemas
const mosquitoPoolSchema = z.object({
  poolId: z.string().min(1, 'Pool ID is required'),
  collectionDate: z.string().transform((str) => new Date(str)),
  countyId: z.string().min(1, 'County ID is required'),
  trapId: z.string().optional(),
  species: z.string().optional(),
  mosquitoCount: z.number().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  collectionMethod: z.string().optional()
});

const surveillanceTestSchema = z.object({
  sampleId: z.string().optional(),
  testType: z.enum(['west_nile', 'zika', 'chikungunya']),
  pcrResult: z.enum(['positive', 'negative', 'indeterminate']).optional(),
  ctValue: z.number().optional(),
  amplificationCurve: z.string().optional(),
  interpretation: z.string().optional(),
  mosquitoPoolId: z.string().optional()
});

const countyConfigSchema = z.object({
  countyName: z.string().min(1, 'County name is required'),
  countyCode: z.string().min(1, 'County code is required'),
  nedssCode: z.string().optional(),
  contactEmail: z.string().email().optional(),
  reportTemplate: z.string().optional(),
  specificRequirements: z.record(z.any()).optional()
});

const reportGenerationSchema = z.object({
  reportType: z.enum(['weekly', 'monthly', 'quarterly']),
  countyId: z.string().optional(),
  dataPeriodStart: z.string().transform((str) => new Date(str)),
  dataPeriodEnd: z.string().transform((str) => new Date(str)),
  distributionList: z.array(z.string().email()).optional()
});

const equipmentMonitoringSchema = z.object({
  equipmentId: z.string().optional(),
  parameterName: z.string().min(1, 'Parameter name is required'),
  measuredValue: z.number(),
  acceptableRange: z.string().optional(),
  status: z.enum(['normal', 'warning', 'critical']),
  sourceSystem: z.string().min(1, 'Source system is required')
});

const systemIntegrationSchema = z.object({
  systemName: z.string().min(1, 'System name is required'),
  integrationType: z.enum(['api', 'odbc', 'file_transfer', 'web_automation']),
  connectionString: z.string().optional(),
  apiCredentials: z.record(z.any()).optional(),
  configuration: z.record(z.any()).optional()
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// ===== SURVEILLANCE ENDPOINTS =====

/**
 * GET /api/v1/public-health/surveillance/samples
 * List surveillance samples with filtering and pagination
 */
router.get('/surveillance/samples', async (req: Request, res: Response) => {
  try {
    const { 
      countyId, 
      startDate, 
      endDate, 
      testType, 
      result, 
      page = '1', 
      limit = '50' 
    } = req.query;
    
    const laboratoryId = req.user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const samples = await PublicHealthService.getSurveillanceSamples({
      laboratoryId,
      countyId: countyId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      testType: testType as string,
      result: result as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: samples.data,
      pagination: samples.pagination
    });
  } catch (error) {
    console.error('Error fetching surveillance samples:', error);
    res.status(500).json({ error: 'Failed to fetch surveillance samples' });
  }
});

/**
 * POST /api/v1/public-health/surveillance/samples
 * Create new surveillance sample entry
 */
router.post('/surveillance/samples', async (req: Request, res: Response) => {
  try {
    const data = mosquitoPoolSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const sample = await PublicHealthService.createMosquitoPool(data, laboratoryId, userId);

    res.status(201).json({
      success: true,
      message: 'Mosquito pool created successfully',
      data: sample
    });
  } catch (error) {
    console.error('Error creating mosquito pool:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create mosquito pool' });
  }
});

/**
 * PUT /api/v1/public-health/surveillance/samples/:id
 * Update surveillance sample information
 */
router.put('/surveillance/samples/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = mosquitoPoolSchema.partial().parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const sample = await PublicHealthService.updateMosquitoPool(id, data, laboratoryId, userId);

    res.json({
      success: true,
      message: 'Mosquito pool updated successfully',
      data: sample
    });
  } catch (error) {
    console.error('Error updating mosquito pool:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update mosquito pool' });
  }
});

/**
 * GET /api/v1/public-health/surveillance/samples/:id/results
 * Get test results for a specific sample
 */
router.get('/surveillance/samples/:id/results', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const results = await PublicHealthService.getSampleResults(id, laboratoryId);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching sample results:', error);
    res.status(500).json({ error: 'Failed to fetch sample results' });
  }
});

/**
 * POST /api/v1/public-health/surveillance/samples/:id/results
 * Add test results to a sample
 */
router.post('/surveillance/samples/:id/results', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = surveillanceTestSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await PublicHealthService.addTestResult(id, data, laboratoryId, userId);

    res.status(201).json({
      success: true,
      message: 'Test result added successfully',
      data: result
    });
  } catch (error) {
    console.error('Error adding test result:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to add test result' });
  }
});

// ===== REPORTING ENDPOINTS =====

/**
 * GET /api/v1/public-health/reporting/counties
 * List configured counties
 */
router.get('/reporting/counties', async (req: Request, res: Response) => {
  try {
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const counties = await PublicHealthService.getCountyConfigurations(laboratoryId);

    res.json({
      success: true,
      data: counties
    });
  } catch (error) {
    console.error('Error fetching county configurations:', error);
    res.status(500).json({ error: 'Failed to fetch county configurations' });
  }
});

/**
 * POST /api/v1/public-health/reporting/counties
 * Create new county configuration
 */
router.post('/reporting/counties', async (req: Request, res: Response) => {
  try {
    const data = countyConfigSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const county = await PublicHealthService.createCountyConfiguration(data, laboratoryId, userId);

    res.status(201).json({
      success: true,
      message: 'County configuration created successfully',
      data: county
    });
  } catch (error) {
    console.error('Error creating county configuration:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create county configuration' });
  }
});

/**
 * POST /api/v1/public-health/reporting/generate
 * Trigger report generation
 */
router.post('/reporting/generate', async (req: Request, res: Response) => {
  try {
    const data = reportGenerationSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const report = await PublicHealthService.generateReport(data, laboratoryId, userId);

    res.json({
      success: true,
      message: 'Report generation initiated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * GET /api/v1/public-health/reporting/reports/:id
 * Get specific report
 */
router.get('/reporting/reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const report = await PublicHealthService.getReport(id, laboratoryId);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

/**
 * POST /api/v1/public-health/reporting/distribute
 * Send reports
 */
router.post('/reporting/distribute', async (req: Request, res: Response) => {
  try {
    const { reportIds } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await PublicHealthService.distributeReports(reportIds, laboratoryId, userId);

    res.json({
      success: true,
      message: 'Reports distributed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error distributing reports:', error);
    res.status(500).json({ error: 'Failed to distribute reports' });
  }
});

// ===== INTEGRATIONS ENDPOINTS =====

/**
 * POST /api/v1/public-health/integrations/labware/sync
 * Sync with LabWare LIMS
 */
router.post('/integrations/labware/sync', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, sampleTypes } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await PublicHealthService.syncLabWareData({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      sampleTypes
    }, laboratoryId, userId);

    res.json({
      success: true,
      message: 'LabWare sync completed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error syncing with LabWare:', error);
    res.status(500).json({ error: 'Failed to sync with LabWare' });
  }
});

/**
 * POST /api/v1/public-health/integrations/nedss/submit
 * Submit to Texas NEDSS
 */
router.post('/integrations/nedss/submit', async (req: Request, res: Response) => {
  try {
    const { countyCode, caseData } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await PublicHealthService.submitToNEDSS({
      countyCode,
      caseData
    }, laboratoryId, userId);

    res.json({
      success: true,
      message: 'NEDSS submission completed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error submitting to NEDSS:', error);
    res.status(500).json({ error: 'Failed to submit to NEDSS' });
  }
});

/**
 * POST /api/v1/public-health/integrations/arbonet/upload
 * Upload to CDC ArboNET
 */
router.post('/integrations/arbonet/upload', async (req: Request, res: Response) => {
  try {
    const { countyCode, weekEnding, speciesData } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await PublicHealthService.uploadToArboNET({
      countyCode,
      weekEnding: new Date(weekEnding),
      speciesData
    }, laboratoryId, userId);

    res.json({
      success: true,
      message: 'ArboNET upload completed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading to ArboNET:', error);
    res.status(500).json({ error: 'Failed to upload to ArboNET' });
  }
});

/**
 * GET /api/v1/public-health/integrations/equipment/status
 * Get equipment monitoring status
 */
router.get('/integrations/equipment/status', async (req: Request, res: Response) => {
  try {
    const { equipmentId, parameterName, hours } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const status = await PublicHealthService.getEquipmentStatus({
      equipmentId: equipmentId as string,
      parameterName: parameterName as string,
      hours: hours ? parseInt(hours as string) : 24
    }, laboratoryId);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching equipment status:', error);
    res.status(500).json({ error: 'Failed to fetch equipment status' });
  }
});

// ===== ANALYTICS ENDPOINTS =====

/**
 * GET /api/v1/public-health/analytics/patterns
 * Get geographic/temporal patterns
 */
router.get('/analytics/patterns', async (req: Request, res: Response) => {
  try {
    const { countyId, startDate, endDate, patternType } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const patterns = await PublicHealthService.getPatternAnalysis({
      countyId: countyId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      patternType: patternType as string
    }, laboratoryId);

    res.json({
      success: true,
      data: patterns
    });
  } catch (error) {
    console.error('Error fetching pattern analysis:', error);
    res.status(500).json({ error: 'Failed to fetch pattern analysis' });
  }
});

/**
 * GET /api/v1/public-health/analytics/trends
 * Get surveillance trends
 */
router.get('/analytics/trends', async (req: Request, res: Response) => {
  try {
    const { countyId, startDate, endDate, trendType } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const trends = await PublicHealthService.getTrendAnalysis({
      countyId: countyId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      trendType: trendType as string
    }, laboratoryId);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching trend analysis:', error);
    res.status(500).json({ error: 'Failed to fetch trend analysis' });
  }
});

/**
 * POST /api/v1/public-health/analytics/alerts
 * Generate automated alerts
 */
router.post('/analytics/alerts', async (req: Request, res: Response) => {
  try {
    const { alertType, parameters } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const alerts = await PublicHealthService.generateAlerts({
      alertType,
      parameters
    }, laboratoryId, userId);

    res.json({
      success: true,
      message: 'Alerts generated successfully',
      data: alerts
    });
  } catch (error) {
    console.error('Error generating alerts:', error);
    res.status(500).json({ error: 'Failed to generate alerts' });
  }
});

export default router; 