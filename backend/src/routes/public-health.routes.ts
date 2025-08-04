import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { PublicHealthService } from '../services/PublicHealthService';

const router = Router();

// Validation schemas
const chainOfCustodySchema = z.object({
  caseNumber: z.string().min(1),
  sampleId: z.string().min(1),
  sampleType: z.enum(['clinical', 'environmental', 'bioterrorism_suspect']),
  collectionOfficer: z.string().min(1),
  collectionLocation: z.string().min(1),
  suspectedAgent: z.string().optional(),
  urgencyLevel: z.enum(['routine', 'urgent', 'stat', 'bioterrorism']),
  storageConditions: z.string().min(1),
  specialInstructions: z.string().optional()
});

const custodyTransferSchema = z.object({
  fromPerson: z.string().min(1),
  toPerson: z.string().min(1),
  purpose: z.string().min(1),
  condition: z.string().min(1),
  witnessed: z.boolean(),
  witnessName: z.string().optional()
});

const clinicalSubmissionSchema = z.object({
  patientInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string(),
    mrn: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional()
  }),
  clinicalInfo: z.object({
    symptoms: z.array(z.string()),
    onsetDate: z.string().optional(),
    travelHistory: z.string().optional(),
    occupation: z.string().optional(),
    animalExposure: z.boolean(),
    suspectedAgent: z.string().optional()
  }),
  specimenInfo: z.object({
    type: z.string().min(1),
    collectionDate: z.string(),
    collectionTime: z.string(),
    submittedBy: z.string().min(1),
    facility: z.string().min(1)
  }),
  testingRequested: z.array(z.string()),
  urgency: z.enum(['routine', 'urgent', 'stat', 'bioterrorism'])
});

const environmentalSubmissionSchema = z.object({
  sampleInfo: z.object({
    sampleType: z.string().min(1),
    collectionSite: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }),
    collectionDate: z.string(),
    collectionTime: z.string(),
    weatherConditions: z.string().optional()
  }),
  suspectedContamination: z.object({
    suspected: z.boolean(),
    agent: z.string().optional(),
    source: z.string().optional(),
    exposureRisk: z.string().optional()
  }),
  submitterInfo: z.object({
    name: z.string().min(1),
    organization: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().optional()
  }),
  testingRequested: z.array(z.string()),
  urgency: z.enum(['routine', 'urgent', 'stat', 'bioterrorism'])
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/public-health/chain-of-custody - Get all chain of custody records
router.get('/chain-of-custody', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const records = await PublicHealthService.getChainOfCustodyRecords(req.user.laboratoryId);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch chain of custody records' });
  }
});

// POST /api/public-health/chain-of-custody - Create new chain of custody record
router.post('/chain-of-custody', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const validatedData = chainOfCustodySchema.parse(req.body);
    const record = await PublicHealthService.createChainOfCustodyRecord({
      ...validatedData,
      laboratoryId: req.user.laboratoryId,
      collectionDateTime: new Date().toISOString(),
      status: 'active',
      tamperSealsIntact: true,
      transfers: [],
      currentCustodian: validatedData.collectionOfficer
    });
    res.json({ success: true, data: record });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ success: false, error: 'Failed to create chain of custody record' });
    }
  }
});

// POST /api/public-health/chain-of-custody/:id/transfer - Add custody transfer
router.post('/chain-of-custody/:id/transfer', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { id } = req.params;
    const validatedData = custodyTransferSchema.parse(req.body);
    const transfer = await PublicHealthService.addCustodyTransfer(id, {
      ...validatedData,
      transferDateTime: new Date().toISOString(),
      signature: `${validatedData.toPerson}_${Date.now()}`
    });
    res.json({ success: true, data: transfer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ success: false, error: 'Failed to add custody transfer' });
    }
  }
});

// POST /api/public-health/chain-of-custody/:id/form - Generate custody form PDF
router.post('/chain-of-custody/:id/form', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { id } = req.params;
    const pdfBuffer = await PublicHealthService.generateCustodyForm(id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="chain_of_custody_${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate custody form' });
  }
});

// POST /api/public-health/submissions/clinical - Submit clinical sample
router.post('/submissions/clinical', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const validatedData = clinicalSubmissionSchema.parse(req.body);
    const submission = await PublicHealthService.submitClinicalSample({
      ...validatedData,
      laboratoryId: req.user.laboratoryId,
      submittedAt: new Date().toISOString(),
      sampleId: `CLIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    res.json({ success: true, data: submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ success: false, error: 'Failed to submit clinical sample' });
    }
  }
});

// POST /api/public-health/submissions/environmental - Submit environmental sample
router.post('/submissions/environmental', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const validatedData = environmentalSubmissionSchema.parse(req.body);
    const submission = await PublicHealthService.submitEnvironmentalSample({
      ...validatedData,
      laboratoryId: req.user.laboratoryId,
      submittedAt: new Date().toISOString(),
      sampleId: `ENV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    res.json({ success: true, data: submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ success: false, error: 'Failed to submit environmental sample' });
    }
  }
});

// GET /api/public-health/emergency-response - Get emergency response status
router.get('/emergency-response', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const status = await PublicHealthService.getEmergencyResponseStatus(req.user.laboratoryId);
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch emergency response status' });
  }
});

// POST /api/public-health/emergency-response/notify - Send emergency notification
router.post('/emergency-response/notify', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { type, details, urgency } = req.body;
    const notification = await PublicHealthService.sendEmergencyNotification({
      type,
      details,
      urgency,
      laboratoryId: req.user.laboratoryId,
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send emergency notification' });
  }
});

// GET /api/public-health/bioterrorism - Get bioterrorism preparedness status
router.get('/bioterrorism', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const status = await PublicHealthService.getBioterrorismPreparednessStatus(req.user.laboratoryId);
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bioterrorism preparedness status' });
  }
});

// POST /api/public-health/bioterrorism/alert - Trigger bioterrorism alert
router.post('/bioterrorism/alert', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { suspectedAgent, location, details } = req.body;
    const alert = await PublicHealthService.triggerBioterrorismAlert({
      suspectedAgent,
      location,
      details,
      laboratoryId: req.user.laboratoryId,
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to trigger bioterrorism alert' });
  }
});

export default router; 