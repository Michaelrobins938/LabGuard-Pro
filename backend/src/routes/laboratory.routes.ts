import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.middleware';
import { LaboratoryService } from '../services/LaboratoryService';
import { BiomniService } from '../services/BiomniService';

const router = Router();

// Validation schemas
const laboratoryModuleSchema = z.object({
  name: z.string().min(1, 'Module name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  configuration: z.record(z.any()).optional(),
  aiCapabilities: z.record(z.any()).optional()
});

const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  steps: z.array(z.record(z.any())),
  moduleId: z.string().min(1, 'Module ID is required'),
  active: z.boolean().default(true),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
  estimatedTime: z.number().optional(),
  aiAssisted: z.boolean().default(false)
});

const complianceRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  ruleType: z.string().min(1, 'Rule type is required'),
  requirements: z.record(z.any()),
  moduleId: z.string().min(1, 'Module ID is required'),
  active: z.boolean().default(true),
  automated: z.boolean().default(false)
});

const sampleSchema = z.object({
  sampleId: z.string().min(1, 'Sample ID is required'),
  type: z.enum(['CLINICAL', 'WATER', 'DAIRY', 'BIOTERRORISM', 'SURVEILLANCE', 'ENVIRONMENTAL', 'FOOD', 'OTHER']),
  priority: z.enum(['ROUTINE', 'STAT', 'URGENT', 'EMERGENCY']).default('ROUTINE'),
  moduleId: z.string().min(1, 'Module ID is required'),
  collectedBy: z.string().optional(),
  collectionDate: z.string().transform((str) => new Date(str)).optional(),
  location: z.string().optional(),
  notes: z.string().optional()
});

const integrationSchema = z.object({
  name: z.string().min(1, 'Integration name is required'),
  type: z.enum(['LIMS', 'EMR', 'LIS', 'INSTRUMENT', 'REPORTING', 'SURVEILLANCE', 'OTHER']),
  configuration: z.record(z.any()),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ERROR', 'MAINTENANCE']).default('ACTIVE')
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * GET /api/laboratory/modules
 * Get all laboratory modules for the current laboratory
 */
router.get('/modules', async (req: Request, res: Response) => {
  try {
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const modules = await LaboratoryService.getLaboratoryModules(laboratoryId);
    
    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching laboratory modules:', error);
    res.status(500).json({ error: 'Failed to fetch laboratory modules' });
  }
});

/**
 * POST /api/laboratory/modules
 * Create a new laboratory module
 */
router.post('/modules', async (req: Request, res: Response) => {
  try {
    const data = laboratoryModuleSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const module = await LaboratoryService.createLaboratoryModule({
      ...data,
      laboratoryId
    });
    
    res.status(201).json({
      success: true,
      message: 'Laboratory module created successfully',
      data: module
    });
  } catch (error) {
    console.error('Error creating laboratory module:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create laboratory module' });
  }
});

/**
 * PUT /api/laboratory/modules/:id
 * Update a laboratory module
 */
router.put('/modules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = laboratoryModuleSchema.partial().parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const module = await LaboratoryService.updateLaboratoryModule(id, data, laboratoryId);
    
    res.json({
      success: true,
      message: 'Laboratory module updated successfully',
      data: module
    });
  } catch (error) {
    console.error('Error updating laboratory module:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update laboratory module' });
  }
});

/**
 * DELETE /api/laboratory/modules/:id
 * Delete a laboratory module
 */
router.delete('/modules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    await LaboratoryService.deleteLaboratoryModule(id, laboratoryId);
    
    res.json({
      success: true,
      message: 'Laboratory module deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting laboratory module:', error);
    res.status(500).json({ error: 'Failed to delete laboratory module' });
  }
});

/**
 * GET /api/laboratory/workflows
 * Get all workflows for the current laboratory
 */
router.get('/workflows', async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const workflows = await LaboratoryService.getWorkflows(laboratoryId, moduleId as string);
    
    res.json({
      success: true,
      data: workflows
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

/**
 * POST /api/laboratory/workflows
 * Create a new workflow
 */
router.post('/workflows', async (req: Request, res: Response) => {
  try {
    const data = workflowSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const workflow = await LaboratoryService.createWorkflow({
      ...data,
      laboratoryId
    });
    
    res.status(201).json({
      success: true,
      message: 'Workflow created successfully',
      data: workflow
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

/**
 * PUT /api/laboratory/workflows/:id
 * Update a workflow
 */
router.put('/workflows/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = workflowSchema.partial().parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const workflow = await LaboratoryService.updateWorkflow(id, data, laboratoryId);
    
    res.json({
      success: true,
      message: 'Workflow updated successfully',
      data: workflow
    });
  } catch (error) {
    console.error('Error updating workflow:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

/**
 * GET /api/laboratory/compliance
 * Get compliance status for the current laboratory
 */
router.get('/compliance', async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const compliance = await LaboratoryService.getComplianceStatus(laboratoryId, moduleId as string);
    
    res.json({
      success: true,
      data: compliance
    });
  } catch (error) {
    console.error('Error fetching compliance status:', error);
    res.status(500).json({ error: 'Failed to fetch compliance status' });
  }
});

/**
 * POST /api/laboratory/compliance/check
 * Run compliance check for specific rules
 */
router.post('/compliance/check', async (req: Request, res: Response) => {
  try {
    const { ruleIds } = req.body;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const results = await LaboratoryService.runComplianceCheck(ruleIds, laboratoryId);
    
    res.json({
      success: true,
      message: 'Compliance check completed',
      data: results
    });
  } catch (error) {
    console.error('Error running compliance check:', error);
    res.status(500).json({ error: 'Failed to run compliance check' });
  }
});

/**
 * GET /api/laboratory/compliance/reports
 * Get compliance reports
 */
router.get('/compliance/reports', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, ruleType } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const reports = await LaboratoryService.getComplianceReports(
      laboratoryId,
      startDate as string,
      endDate as string,
      ruleType as string
    );
    
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching compliance reports:', error);
    res.status(500).json({ error: 'Failed to fetch compliance reports' });
  }
});

/**
 * GET /api/laboratory/samples
 * Get samples for the current laboratory
 */
router.get('/samples', async (req: Request, res: Response) => {
  try {
    const { moduleId, status, priority, type } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const samples = await LaboratoryService.getSamples(laboratoryId, {
      moduleId: moduleId as string,
      status: status as string,
      priority: priority as string,
      type: type as string
    });
    
    res.json({
      success: true,
      data: samples
    });
  } catch (error) {
    console.error('Error fetching samples:', error);
    res.status(500).json({ error: 'Failed to fetch samples' });
  }
});

/**
 * POST /api/laboratory/samples
 * Create a new sample
 */
router.post('/samples', async (req: Request, res: Response) => {
  try {
    const data = sampleSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    // Use AI to analyze sample priority and requirements
    const aiAnalysis = await BiomniService.analyzeSample({
      sampleType: data.type,
      sampleData: data,
      analysisGoals: ['priority_assessment', 'requirements_analysis'],
      userId: req.user?.id || 'system',
      labId: laboratoryId
    });
    
    const sample = await LaboratoryService.createSample({
      ...data,
      laboratoryId,
      aiAnalysis
    });
    
    res.status(201).json({
      success: true,
      message: 'Sample created successfully',
      data: sample
    });
  } catch (error) {
    console.error('Error creating sample:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create sample' });
  }
});

/**
 * PUT /api/laboratory/samples/:id
 * Update a sample
 */
router.put('/samples/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = sampleSchema.partial().parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const sample = await LaboratoryService.updateSample(id, data, laboratoryId);
    
    res.json({
      success: true,
      message: 'Sample updated successfully',
      data: sample
    });
  } catch (error) {
    console.error('Error updating sample:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update sample' });
  }
});

/**
 * GET /api/laboratory/integrations
 * Get integrations for the current laboratory
 */
router.get('/integrations', async (req: Request, res: Response) => {
  try {
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const integrations = await LaboratoryService.getIntegrations(laboratoryId);
    
    res.json({
      success: true,
      data: integrations
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

/**
 * POST /api/laboratory/integrations
 * Create a new integration
 */
router.post('/integrations', async (req: Request, res: Response) => {
  try {
    const data = integrationSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const integration = await LaboratoryService.createIntegration({
      ...data,
      laboratoryId
    });
    
    res.status(201).json({
      success: true,
      message: 'Integration created successfully',
      data: integration
    });
  } catch (error) {
    console.error('Error creating integration:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create integration' });
  }
});

/**
 * POST /api/laboratory/integrations/:id/test
 * Test an integration
 */
router.post('/integrations/:id/test', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const result = await LaboratoryService.testIntegration(id, laboratoryId);
    
    res.json({
      success: true,
      message: 'Integration test completed',
      data: result
    });
  } catch (error) {
    console.error('Error testing integration:', error);
    res.status(500).json({ error: 'Failed to test integration' });
  }
});

/**
 * PUT /api/laboratory/integrations/:id
 * Update an integration
 */
router.put('/integrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = integrationSchema.partial().parse(req.body);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const integration = await LaboratoryService.updateIntegration(id, data, laboratoryId);
    
    res.json({
      success: true,
      message: 'Integration updated successfully',
      data: integration
    });
  } catch (error) {
    console.error('Error updating integration:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

/**
 * GET /api/laboratory/analytics
 * Get AI-powered analytics for the laboratory
 */
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const { moduleId, timeframe } = req.query;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const analytics = await LaboratoryService.getAnalytics(laboratoryId, {
      moduleId: moduleId as string,
      timeframe: timeframe as string
    });
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * POST /api/laboratory/ai/analyze
 * Use AI to analyze laboratory data
 */
router.post('/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { data, analysisType } = req.body;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const analysis = await BiomniService.analyzeLaboratoryData(data, analysisType, laboratoryId);
    
    res.json({
      success: true,
      message: 'AI analysis completed',
      data: analysis
    });
  } catch (error) {
    console.error('Error performing AI analysis:', error);
    res.status(500).json({ error: 'Failed to perform AI analysis' });
  }
});

export default router; 