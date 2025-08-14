import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import QRCodeService from '../services/QRCodeService';

const router = Router();
const prisma = new PrismaClient();
const qrCodeService = new QRCodeService();

// Validation schemas
const createSampleSchema = z.object({
  poolId: z.string().min(1),
  trapLocationId: z.string().optional(),
  trapId: z.string().min(1),
  collectionDate: z.string().min(1),
  collectionTime: z.string().min(1),
  collectedBy: z.string().min(1),
  mosquitoSpecies: z.enum([
    'CULEX_QUINQUEFASCIATUS',
    'CULEX_PIPIENS',
    'CULEX_RESTUANS',
    'CULEX_SALINARIUS',
    'CULEX_TARSALIS',
    'AEDES_ALBOPICTUS',
    'AEDES_AEGYPTI',
    'AEDES_VEXANS',
    'ANOPHELES_QUADRIMACULATUS',
    'OCHLEROTATUS_SOLLICITANS',
    'UNKNOWN',
    'MIXED'
  ]),
  poolSize: z.number().min(1).max(100),
  poolCondition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DEGRADED']),
  collectionLatitude: z.number().optional(),
  collectionLongitude: z.number().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  weatherConditions: z.string().optional(),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional()
});

const updateSampleSchema = z.object({
  testResult: z.enum(['PENDING', 'POSITIVE', 'NEGATIVE', 'INCONCLUSIVE', 'INVALID', 'RETEST_REQUIRED']).optional(),
  ctValue: z.number().optional(),
  internalControlCt: z.number().optional(),
  qcStatus: z.enum(['PASS', 'FAIL', 'PENDING']).optional(),
  qcNotes: z.string().optional(),
  retestRequired: z.boolean().optional(),
  pcrBatchId: z.string().optional(),
  notes: z.string().optional()
});

const createPCRBatchSchema = z.object({
  batchId: z.string().min(1),
  plateLayout: z.enum(['PLATE_96', 'PLATE_384', 'CUSTOM']).optional(),
  technician: z.string().min(1),
  protocol: z.string().optional(),
  kitLotNumber: z.string().optional(),
  equipmentId: z.string().optional(),
  thermalCycler: z.string().optional(),
  sampleIds: z.array(z.string()).min(1).max(96),
  positiveControls: z.array(z.object({
    well: z.string(),
    controlType: z.string(),
    expectedCt: z.number().optional()
  })),
  negativeControls: z.array(z.object({
    well: z.string(),
    controlType: z.string()
  })),
  internalControls: z.array(z.object({
    well: z.string(),
    controlType: z.string(),
    expectedCtRange: z.object({
      min: z.number(),
      max: z.number()
    }).optional()
  }))
});

/**
 * Create a new mosquito pool sample
 * POST /api/wnv-samples
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createSampleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid sample data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const {
      poolId,
      trapLocationId,
      trapId,
      collectionDate,
      collectionTime,
      collectedBy,
      mosquitoSpecies,
      poolSize,
      poolCondition,
      collectionLatitude,
      collectionLongitude,
      temperature,
      humidity,
      weatherConditions,
      notes,
      photos
    } = validation.data;

    // Combine date and time
    const collectionDateTime = new Date(`${collectionDate}T${collectionTime}`);
    const collectionWeek = getEpidemiologicalWeek(collectionDateTime);
    const collectionYear = collectionDateTime.getFullYear();

    // Find or create trap location
    let trapLocation;
    if (trapLocationId) {
      trapLocation = await prisma.trapLocation.findUnique({
        where: { id: trapLocationId }
      });
    } else {
      // Try to find existing trap by trapId
      trapLocation = await prisma.trapLocation.findFirst({
        where: { 
          trapId,
          laboratoryId
        }
      });
    }

    if (!trapLocation) {
      return res.status(400).json({
        error: 'Trap location not found. Please register the trap location first.'
      });
    }

    // Generate QR code for the sample
    const qrResult = await qrCodeService.generateSampleQR({
      poolId,
      trapId,
      collectionDate,
      latitude: collectionLatitude || trapLocation.latitude,
      longitude: collectionLongitude || trapLocation.longitude,
      species: mosquitoSpecies,
      laboratoryId,
      collectedBy
    });

    // Create the mosquito pool sample
    const sample = await prisma.mosquitoPool.create({
      data: {
        poolId,
        trapLocationId: trapLocation.id,
        collectionDate: collectionDateTime,
        collectionWeek,
        collectionYear,
        collectedBy,
        mosquitoSpecies,
        poolSize,
        poolCondition,
        collectionLatitude,
        collectionLongitude,
        temperature,
        humidity,
        weatherConditions,
        notes,
        photos: photos ?? undefined,
        qrCode: qrResult.qrCode,
        laboratoryId
      },
      include: {
        trapLocation: true,
        pcrBatch: true
      }
    });

    res.status(201).json({
      success: true,
      data: {
        sample,
        qrCode: qrResult
      }
    });

  } catch (error) {
    console.error('Sample creation error:', error);
    res.status(500).json({
      error: 'Failed to create sample',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get mosquito pool samples with filtering and pagination
 * GET /api/wnv-samples
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const {
      page = 1,
      limit = 50,
      collectionDateFrom,
      collectionDateTo,
      testResult,
      mosquitoSpecies,
      trapId,
      collectedBy,
      search
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Math.min(Number(limit), 100);

    // Build where clause
    const where: any = {
      laboratoryId,
      deletedAt: null
    };

    if (collectionDateFrom || collectionDateTo) {
      where.collectionDate = {};
      if (collectionDateFrom) {
        where.collectionDate.gte = new Date(collectionDateFrom as string);
      }
      if (collectionDateTo) {
        where.collectionDate.lte = new Date(collectionDateTo as string);
      }
    }

    if (testResult) {
      where.testResult = testResult;
    }

    if (mosquitoSpecies) {
      where.mosquitoSpecies = mosquitoSpecies;
    }

    if (trapId) {
      where.trapLocation = {
        trapId: trapId as string
      };
    }

    if (collectedBy) {
      where.collectedBy = {
        contains: collectedBy as string,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { poolId: { contains: search as string, mode: 'insensitive' } },
        { collectedBy: { contains: search as string, mode: 'insensitive' } },
        { notes: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get samples with pagination
    const [samples, totalCount] = await Promise.all([
      prisma.mosquitoPool.findMany({
        where,
        skip,
        take,
        orderBy: { collectionDate: 'desc' },
        include: {
          trapLocation: true,
          pcrBatch: {
            select: {
              id: true,
              batchId: true,
              status: true,
              batchDate: true
            }
          }
        }
      }),
      prisma.mosquitoPool.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        samples,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('Sample retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve samples',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get a specific mosquito pool sample
 * GET /api/wnv-samples/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = (req as any).user?.laboratoryId;

    const sample = await prisma.mosquitoPool.findFirst({
      where: {
        id,
        laboratoryId,
        deletedAt: null
      },
      include: {
        trapLocation: true,
        pcrBatch: true,
        laboratory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!sample) {
      return res.status(404).json({ error: 'Sample not found' });
    }

    res.json({
      success: true,
      data: sample
    });

  } catch (error) {
    console.error('Sample retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve sample',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update a mosquito pool sample
 * PUT /api/wnv-samples/:id
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = updateSampleSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid update data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    const updateData = validation.data;

    // Check if sample exists and belongs to laboratory
    const existingSample = await prisma.mosquitoPool.findFirst({
      where: {
        id,
        laboratoryId,
        deletedAt: null
      }
    });

    if (!existingSample) {
      return res.status(404).json({ error: 'Sample not found' });
    }

    // Update the sample
    const updatedSample = await prisma.mosquitoPool.update({
      where: { id },
      data: updateData,
      include: {
        trapLocation: true,
        pcrBatch: true
      }
    });

    res.json({
      success: true,
      data: updatedSample
    });

  } catch (error) {
    console.error('Sample update error:', error);
    res.status(500).json({
      error: 'Failed to update sample',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Delete a mosquito pool sample (soft delete)
 * DELETE /api/wnv-samples/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laboratoryId = (req as any).user?.laboratoryId;

    // Check if sample exists and belongs to laboratory
    const existingSample = await prisma.mosquitoPool.findFirst({
      where: {
        id,
        laboratoryId,
        deletedAt: null
      }
    });

    if (!existingSample) {
      return res.status(404).json({ error: 'Sample not found' });
    }

    // Soft delete the sample
    await prisma.mosquitoPool.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Sample deleted successfully'
    });

  } catch (error) {
    console.error('Sample deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete sample',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create a PCR batch for testing samples
 * POST /api/wnv-samples/pcr-batches
 */
router.post('/pcr-batches', async (req: Request, res: Response) => {
  try {
    const validation = createPCRBatchSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid PCR batch data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const {
      batchId,
      plateLayout = 'PLATE_96',
      technician,
      protocol,
      kitLotNumber,
      equipmentId,
      thermalCycler,
      sampleIds,
      positiveControls,
      negativeControls,
      internalControls
    } = validation.data;

    // Verify all samples exist and belong to the laboratory
    const samples = await prisma.mosquitoPool.findMany({
      where: {
        id: { in: sampleIds },
        laboratoryId,
        deletedAt: null,
        testResult: 'PENDING'
      }
    });

    if (samples.length !== sampleIds.length) {
      return res.status(400).json({
        error: 'Some samples not found or already processed'
      });
    }

    // Create the PCR batch
    const pcrBatch = await prisma.pCRBatch.create({
      data: {
        batchId,
        batchDate: new Date(),
        plateLayout,
        technician,
        protocol,
        kitLotNumber,
        equipmentId,
        thermalCycler,
        positiveControls,
        negativeControls,
        internalControls,
        laboratoryId
      }
    });

    // Assign samples to the batch
    await prisma.mosquitoPool.updateMany({
      where: { id: { in: sampleIds } },
      data: { pcrBatchId: pcrBatch.id }
    });

    // Get the complete batch with samples
    const completeBatch = await prisma.pCRBatch.findUnique({
      where: { id: pcrBatch.id },
      include: {
        mosquitoPools: {
          include: {
            trapLocation: true
          }
        },
        equipment: {
          select: {
            id: true,
            name: true,
            model: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: completeBatch
    });

  } catch (error) {
    console.error('PCR batch creation error:', error);
    res.status(500).json({
      error: 'Failed to create PCR batch',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get PCR batches
 * GET /api/wnv-samples/pcr-batches
 */
router.get('/pcr-batches', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Math.min(Number(limit), 100);

    const where: any = {
      laboratoryId,
      deletedAt: null
    };

    if (status) {
      where.status = status;
    }

    const [batches, totalCount] = await Promise.all([
      prisma.pCRBatch.findMany({
        where,
        skip,
        take,
        orderBy: { batchDate: 'desc' },
        include: {
          mosquitoPools: {
            select: {
              id: true,
              poolId: true,
              testResult: true,
              ctValue: true
            }
          },
          equipment: {
            select: {
              id: true,
              name: true,
              model: true
            }
          },
          _count: {
            select: {
              mosquitoPools: true
            }
          }
        }
      }),
      prisma.pCRBatch.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        batches,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('PCR batch retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve PCR batches',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get surveillance statistics
 * GET /api/wnv-samples/stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const { year = new Date().getFullYear() } = req.query;

    // Get statistics for the specified year
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const [
      totalSamples,
      positiveSamples,
      samplesBySpecies,
      samplesByWeek,
      activeBatches
    ] = await Promise.all([
      // Total samples
      prisma.mosquitoPool.count({
        where: {
          laboratoryId,
          collectionDate: { gte: startDate, lte: endDate },
          deletedAt: null
        }
      }),
      
      // Positive samples
      prisma.mosquitoPool.count({
        where: {
          laboratoryId,
          collectionDate: { gte: startDate, lte: endDate },
          testResult: 'POSITIVE',
          deletedAt: null
        }
      }),
      
      // Samples by species
      prisma.mosquitoPool.groupBy({
        by: ['mosquitoSpecies'],
        where: {
          laboratoryId,
          collectionDate: { gte: startDate, lte: endDate },
          deletedAt: null
        },
        _count: true
      }),
      
      // Samples by week
      prisma.mosquitoPool.groupBy({
        by: ['collectionWeek'],
        where: {
          laboratoryId,
          collectionYear: Number(year),
          deletedAt: null
        },
        _count: true,
        _avg: {
          poolSize: true
        }
      }),
      
      // Active PCR batches
      prisma.pCRBatch.count({
        where: {
          laboratoryId,
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          deletedAt: null
        }
      })
    ]);

    const positivityRate = totalSamples > 0 ? (positiveSamples / totalSamples) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalSamples,
        positiveSamples,
        positivityRate: parseFloat(positivityRate.toFixed(2)),
        activeBatches,
        samplesBySpecies,
        samplesByWeek: samplesByWeek.sort((a, b) => a.collectionWeek - b.collectionWeek),
        year: Number(year)
      }
    });

  } catch (error) {
    console.error('Statistics retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Helper function to calculate epidemiological week
 */
function getEpidemiologicalWeek(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

export default router;