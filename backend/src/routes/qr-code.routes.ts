import { Router } from 'express';
import { Request, Response } from 'express';
import QRCodeService, { SampleQRData, QRCodeOptions } from '../services/QRCodeService';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const qrCodeService = new QRCodeService();
const prisma = new PrismaClient();

// Validation schemas
const generateQRSchema = z.object({
  poolId: z.string().min(1),
  trapId: z.string().min(1),
  collectionDate: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  species: z.string().optional(),
  collectedBy: z.string().optional(),
  options: z.object({
    size: z.number().min(100).max(500).optional(),
    margin: z.number().min(0).max(10).optional(),
    errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional(),
    format: z.enum(['PNG', 'SVG', 'PDF']).optional(),
    includeText: z.boolean().optional()
  }).optional()
});

const generateBatchSchema = z.object({
  samples: z.array(z.object({
    poolId: z.string().min(1),
    trapId: z.string().min(1),
    collectionDate: z.string().min(1),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    species: z.string().optional(),
    collectedBy: z.string().optional()
  })).min(1).max(100),
  options: z.object({
    size: z.number().min(100).max(500).optional(),
    margin: z.number().min(0).max(10).optional(),
    errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional(),
    format: z.enum(['PNG', 'SVG', 'PDF']).optional(),
    includeText: z.boolean().optional()
  }).optional()
});

const validateQRSchema = z.object({
  qrData: z.string().min(1)
});

/**
 * Generate QR code for a single sample
 * POST /api/qr-codes/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = generateQRSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const { poolId, trapId, collectionDate, latitude, longitude, species, collectedBy, options = {} } = validation.data;
    
    // Get laboratory ID from authenticated user
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    // Create sample data
    const sampleData: SampleQRData = {
      poolId,
      trapId,
      collectionDate,
      laboratoryId,
      ...(latitude && { latitude }),
      ...(longitude && { longitude }),
      ...(species && { species }),
      ...(collectedBy && { collectedBy })
    };

    // Generate QR code
    const qrResult = await qrCodeService.generateSampleQR(sampleData, options);

    // Store QR code reference in database (optional - for tracking)
    // This could be extended to store in a QRCode table for audit purposes

    res.json({
      success: true,
      data: qrResult
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({
      error: 'Failed to generate QR code',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate QR codes for multiple samples (batch)
 * POST /api/qr-codes/generate-batch
 */
router.post('/generate-batch', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = generateBatchSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const { samples, options = {} } = validation.data;
    
    // Get laboratory ID from authenticated user
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    // Prepare sample data
    const sampleDataArray: SampleQRData[] = samples.map(sample => ({
      ...sample,
      laboratoryId
    }));

    // Generate batch QR codes
    const batchResult = await qrCodeService.generateBatchQRs(sampleDataArray, options);

    res.json({
      success: true,
      data: batchResult
    });

  } catch (error) {
    console.error('Batch QR code generation error:', error);
    res.status(500).json({
      error: 'Failed to generate QR code batch',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Validate QR code data
 * POST /api/qr-codes/validate
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const validation = validateQRSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const { qrData } = validation.data;
    const validationResult = await qrCodeService.validateQRData(qrData);

    res.json({
      success: true,
      data: validationResult
    });

  } catch (error) {
    console.error('QR code validation error:', error);
    res.status(500).json({
      error: 'Failed to validate QR code',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get QR code generation statistics
 * GET /api/qr-codes/stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await qrCodeService.getQRCodeStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('QR code stats error:', error);
    res.status(500).json({
      error: 'Failed to get QR code statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Clean up old QR code files
 * DELETE /api/qr-codes/cleanup
 */
router.delete('/cleanup', async (req: Request, res: Response) => {
  try {
    const olderThanDays = parseInt(req.query.days as string) || 30;
    const deletedCount = await qrCodeService.cleanupOldFiles(olderThanDays);

    res.json({
      success: true,
      data: {
        deletedCount,
        olderThanDays
      }
    });

  } catch (error) {
    console.error('QR code cleanup error:', error);
    res.status(500).json({
      error: 'Failed to cleanup QR code files',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;