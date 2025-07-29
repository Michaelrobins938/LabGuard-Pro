import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { VectorControlService, CreateVectorTestData, UpdateVectorTestData, CreateVectorAlertData } from '../services/VectorControlService';
import { authMiddleware } from '../middleware/auth.middleware';
import { VectorType, VectorPriority, VectorTestStatus, QCStatus, VectorAlertType, AlertPriority } from '@prisma/client';

const router = Router();

// Validation schemas
const createVectorTestSchema = z.object({
  type: z.nativeEnum(VectorType),
  priority: z.nativeEnum(VectorPriority),
  sampleCount: z.number().int().positive('Sample count must be positive'),
  expectedCompletion: z.string().transform((str) => new Date(str)),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
  technicianId: z.string().optional(),
  equipmentId: z.string().optional(),
  stakeholders: z.array(z.object({
    email: z.string().email('Invalid email format'),
    role: z.string().optional(),
    organization: z.string().optional()
  })).optional()
});

const updateVectorTestSchema = z.object({
  status: z.nativeEnum(VectorTestStatus).optional(),
  qcStatus: z.nativeEnum(QCStatus).optional(),
  actualCompletion: z.string().transform((str) => new Date(str)).optional(),
  notes: z.string().optional(),
  technicianId: z.string().optional(),
  equipmentId: z.string().optional()
});

const createVectorAlertSchema = z.object({
  type: z.nativeEnum(VectorAlertType),
  priority: z.nativeEnum(AlertPriority),
  message: z.string().min(1, 'Message is required'),
  actions: z.array(z.string()).min(1, 'At least one action is required'),
  testId: z.string().min(1, 'Test ID is required')
});

const querySchema = z.object({
  status: z.nativeEnum(VectorTestStatus).optional(),
  type: z.nativeEnum(VectorType).optional(),
  priority: z.nativeEnum(VectorPriority).optional(),
  limit: z.string().transform((str) => parseInt(str)).optional(),
  offset: z.string().transform((str) => parseInt(str)).optional()
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * GET /api/vector-control/tests
 * Get all vector tests for the authenticated user's laboratory
 */
router.get('/tests', async (req: Request, res: Response) => {
  try {
    const query = querySchema.parse(req.query);
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const tests = await VectorControlService.getVectorTests(laboratoryId, query);
    
    res.json({
      success: true,
      data: tests,
      count: tests.length
    });
  } catch (error) {
    console.error('Error fetching vector tests:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to fetch vector tests' });
  }
});

/**
 * POST /api/vector-control/tests
 * Create a new vector test
 */
router.post('/tests', async (req: Request, res: Response) => {
  try {
    const data = createVectorTestSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const test = await VectorControlService.createVectorTest(
      data as CreateVectorTestData,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json({
      success: true,
      message: 'Vector test created successfully',
      data: test
    });
  } catch (error) {
    console.error('Error creating vector test:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create vector test' });
  }
});

/**
 * GET /api/vector-control/tests/:id
 * Get a specific vector test by ID
 */
router.get('/tests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const test = await VectorControlService.getVectorTestById(id, laboratoryId);

    if (!test) {
      return res.status(404).json({ error: 'Vector test not found' });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Error fetching vector test:', error);
    res.status(500).json({ error: 'Failed to fetch vector test' });
  }
});

/**
 * PUT /api/vector-control/tests/:id
 * Update a vector test
 */
router.put('/tests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateVectorTestSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const test = await VectorControlService.updateVectorTest(
      id,
      data as UpdateVectorTestData,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      success: true,
      message: 'Vector test updated successfully',
      data: test
    });
  } catch (error) {
    console.error('Error updating vector test:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update vector test' });
  }
});

/**
 * DELETE /api/vector-control/tests/:id
 * Delete a vector test (soft delete)
 */
router.delete('/tests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    await VectorControlService.deleteVectorTest(
      id,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      success: true,
      message: 'Vector test deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vector test:', error);
    res.status(500).json({ error: 'Failed to delete vector test' });
  }
});

/**
 * POST /api/vector-control/alerts
 * Create a new vector alert
 */
router.post('/alerts', async (req: Request, res: Response) => {
  try {
    const data = createVectorAlertSchema.parse(req.body);
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const alert = await VectorControlService.createVectorAlert(
      data as CreateVectorAlertData,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json({
      success: true,
      message: 'Vector alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error creating vector alert:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create vector alert' });
  }
});

/**
 * PUT /api/vector-control/alerts/:id/resolve
 * Resolve a vector alert
 */
router.put('/alerts/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = req.user?.laboratoryId;
    const userId = req.user?.id;

    if (!laboratoryId || !userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const alert = await VectorControlService.resolveVectorAlert(
      id,
      laboratoryId,
      userId,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      success: true,
      message: 'Vector alert resolved successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error resolving vector alert:', error);
    res.status(500).json({ error: 'Failed to resolve vector alert' });
  }
});

/**
 * GET /api/vector-control/alerts
 * Get all active alerts for the laboratory
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const alerts = await VectorControlService.getActiveAlerts(laboratoryId);

    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Error fetching vector alerts:', error);
    res.status(500).json({ error: 'Failed to fetch vector alerts' });
  }
});

/**
 * GET /api/vector-control/stats
 * Get vector test statistics for dashboard
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const laboratoryId = req.user?.laboratoryId;

    if (!laboratoryId) {
      return res.status(403).json({ error: 'Access denied: No laboratory access' });
    }

    const stats = await VectorControlService.getVectorTestStats(laboratoryId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching vector test stats:', error);
    res.status(500).json({ error: 'Failed to fetch vector test statistics' });
  }
});

export default router; 