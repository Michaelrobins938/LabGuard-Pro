import { Router, Response } from 'express';
import { z } from 'zod';
import { SurveillanceService } from '../services/SurveillanceService';
import { LabWareIntegrationService } from '../services/LabWareIntegrationService';
import { NEDSSAutomationService } from '../services/NEDSSAutomationService';
import { ArboNETService } from '../services/ArboNETService';
import { FridayReportService } from '../services/FridayReportService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

// Validation schemas
const labwareConnectionSchema = z.object({
  server: z.string().min(1, 'Server is required'),
  database: z.string().min(1, 'Database is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  port: z.number().optional().default(1433)
}).strict();

const nedssCredentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  countyCode: z.string().min(1, 'County code is required')
}).strict();

const arboretCredentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  apiKey: z.string().optional()
}).strict();

const fridayReportSchema = z.object({
  weekEnding: z.string().transform((str) => new Date(str))
});

const countyConfigSchema = z.object({
  countyCode: z.string().min(1, 'County code is required'),
  countyName: z.string().min(1, 'County name is required'),
  recipients: z.array(z.string().email()),
  templateName: z.string().default('default'),
  includeMaps: z.boolean().default(true),
  includeHistorical: z.boolean().default(true),
  customFields: z.record(z.any()).default({}),
  isActive: z.boolean().default(true)
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * POST /api/surveillance/labware/connect
 * Test connection to LabWare LIMS 7.2
 */
router.post('/labware/connect', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = labwareConnectionSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const connection = await LabWareIntegrationService.testConnection(data, laboratoryId);
    
    if (connection.success) {
      // Save connection settings if test successful
      await LabWareIntegrationService.saveConnectionSettings(laboratoryId, data, userId);
    }
    
    res.json({
      success: connection.success,
      message: connection.message,
      data: connection
    });
  } catch (error) {
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
 * Extract weekly sample data for Friday reports
 */
router.get('/labware/samples', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { weekEnding, countyCode } = req.query as { weekEnding?: string; countyCode?: string };
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const weekEndingDate = weekEnding ? new Date(weekEnding) : new Date();
    const samples = await LabWareIntegrationService.extractWeeklySamples(
      laboratoryId,
      weekEndingDate,
      countyCode
    );
    
    res.json({
      success: true,
      data: samples,
      count: samples.samples.length
    });
  } catch {
    res.status(500).json({ error: 'Failed to extract samples from LabWare' });
  }
});

/**
 * POST /api/surveillance/nedss/credentials
 * Configure NEDSS credentials
 */
router.post('/nedss/credentials', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = nedssCredentialsSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    await NEDSSAutomationService.saveCredentials(laboratoryId, data, userId);
    
    res.json({
      success: true,
      message: 'NEDSS credentials configured successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to configure NEDSS credentials' });
  }
});

/**
 * POST /api/surveillance/nedss/automate
 * Automate Texas NEDSS data entry with enhanced session management
 */
router.post('/nedss/automate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cases } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await NEDSSAutomationService.automateSubmission(
      cases,
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
  } catch {
    res.status(500).json({ error: 'Failed to automate NEDSS submission' });
  }
});

/**
 * POST /api/surveillance/arboret/credentials
 * Configure ArboNET credentials
 */
router.post('/arboret/credentials', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = arboretCredentialsSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    await ArboNETService.saveCredentials(laboratoryId, data, userId);
    
    res.json({
      success: true,
      message: 'ArboNET credentials configured successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to configure ArboNET credentials' });
  }
});

/**
 * POST /api/surveillance/arboret/upload
 * Upload data to CDC ArboNET with enhanced validation
 */
router.post('/arboret/upload', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { speciesData, weekEnding } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const csvData = await ArboNETService.generateArboNETCSV(speciesData, new Date(weekEnding));
    const result = await ArboNETService.uploadToArboNET(
      csvData,
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
  } catch {
    res.status(500).json({ error: 'Failed to upload to ArboNET' });
  }
});

/**
 * POST /api/surveillance/reports/friday
 * Generate automated Friday reports for all configured counties
 * Addresses the 4-5 hour manual report generation pain point
 */
router.post('/reports/friday', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = fridayReportSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await FridayReportService.generateFridayReports(
      laboratoryId,
      userId,
      data.weekEnding,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'Friday reports generated successfully',
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to generate Friday reports' });
  }
});

/**
 * GET /api/surveillance/reports/counties
 * Get county report configurations
 */
router.get('/reports/counties', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const laboratory = await prisma.laboratory.findUnique({
      where: { id: laboratoryId }
    });

    if (!laboratory?.settings) {
      return res.json({
        success: true,
        data: { countyConfigurations: [] }
      });
    }

    const settings = laboratory.settings as any;
    const countyConfigurations = settings.countyReportConfigurations || [];
    
    res.json({
      success: true,
      data: { countyConfigurations }
    });
  } catch (error) {
    console.error('Failed to fetch county configurations:', error);
    res.status(500).json({ error: 'Failed to fetch county configurations' });
  }
});

/**
 * POST /api/surveillance/reports/counties
 * Update county report configurations
 */
router.post('/reports/counties', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { countyConfigurations } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    // Validate county configurations
    const validatedConfigs = countyConfigurations.map((config: any) => 
      countyConfigSchema.parse(config)
    );

    await FridayReportService.saveCountyConfigurations(
      laboratoryId,
      validatedConfigs,
      userId
    );
    
    res.json({
      success: true,
      message: 'County report configurations updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update county configurations' });
  }
});

/**
 * GET /api/surveillance/reports/history
 * Get report generation history
 */
router.get('/reports/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { countyCode, startDate, endDate, limit, offset } = req.query as {
      countyCode?: string;
      startDate?: string;
      endDate?: string;
      limit?: string;
      offset?: string;
    };
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const reports = await SurveillanceService.getReportHistory(
      laboratoryId,
      {
        countyCode,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      }
    );
    
    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch report history' });
  }
});

/**
 * GET /api/surveillance/analytics/summary
 * Get surveillance analytics summary
 */
router.get('/analytics/summary', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { countyCode, timeRange } = req.query as { countyCode?: string; timeRange?: string };
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const analytics = await SurveillanceService.getAnalyticsSummary(
      laboratoryId,
      countyCode,
      timeRange
    );
    
    res.json({
      success: true,
      data: analytics
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

/**
 * POST /api/surveillance/equipment/monitor
 * Set up equipment monitoring integration
 */
router.post('/equipment/monitor', async (req: AuthenticatedRequest, res: Response) => {
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
  } catch {
    res.status(500).json({ error: 'Failed to setup equipment monitoring' });
  }
});

/**
 * POST /api/surveillance/sync/multi-system
 * Multi-system data integration hub
 * Addresses the triple data entry problem
 */
router.post('/sync/multi-system', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, sourceSystem, targetSystems } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const result = await SurveillanceService.syncDataAcrossSystems(
      data,
      sourceSystem,
      targetSystems,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'Multi-system data sync completed',
      data: result
    });
  } catch {
    res.status(500).json({ error: 'Failed to sync data across systems' });
  }
});

/**
 * POST /api/surveillance/samples/tracking/create
 * Create smart sample tracking with QR codes
 * Addresses lost samples and mix-ups
 */
router.post('/samples/tracking/create', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sampleId, priority, location } = req.body;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const trackingData = await SurveillanceService.createSampleTrackingRecord(
      sampleId,
      laboratoryId,
      userId,
      priority || 'medium',
      location,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'Sample tracking record created successfully',
      data: trackingData
    });
  } catch {
    res.status(500).json({ error: 'Failed to create sample tracking record' });
  }
});

/**
 * PUT /api/surveillance/samples/tracking/update
 * Update sample tracking with chain of custody
 */
router.put('/samples/tracking/update', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sampleId, action, location, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const trackingData = await SurveillanceService.updateSampleTracking(
      sampleId,
      action,
      location,
      userId,
      notes,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({
      success: true,
      message: 'Sample tracking updated successfully',
      data: trackingData
    });
  } catch {
    res.status(500).json({ error: 'Failed to update sample tracking' });
  }
});

export default router; 