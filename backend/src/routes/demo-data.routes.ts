import { Router } from 'express';
import { Request, Response } from 'express';
import { generateDemoData } from '../data/generateDemoData';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Generate demo data for West Nile virus surveillance
 * POST /api/demo-data/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    // Check if demo data already exists
    const existingSamples = await prisma.mosquitoPool.count({
      where: { laboratoryId }
    });

    if (existingSamples > 100) {
      return res.status(400).json({
        error: 'Demo data already exists',
        message: `Found ${existingSamples} existing samples. Use the reset endpoint to clear data first.`
      });
    }

    console.log(`Starting demo data generation for laboratory: ${laboratoryId}`);
    
    // Generate demo data (this may take a few minutes)
    await generateDemoData(laboratoryId);

    // Get final statistics
    const stats = await Promise.all([
      prisma.trapLocation.count({ where: { laboratoryId } }),
      prisma.mosquitoPool.count({ where: { laboratoryId } }),
      prisma.pCRBatch.count({ where: { laboratoryId } }),
      prisma.surveillanceAlert.count({ where: { laboratoryId } }),
      prisma.weatherData.count()
    ]);

    const [trapLocations, mosquitoPools, pcrBatches, surveillanceAlerts, weatherRecords] = stats;

    res.json({
      success: true,
      message: 'Demo data generated successfully',
      data: {
        trapLocations,
        mosquitoPools,
        pcrBatches,
        surveillanceAlerts,
        weatherRecords,
        laboratory: laboratoryId
      }
    });

  } catch (error) {
    console.error('Demo data generation error:', error);
    res.status(500).json({
      error: 'Failed to generate demo data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Reset demo data (careful - this deletes data!)
 * DELETE /api/demo-data/reset
 */
router.delete('/reset', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const { confirm } = req.body;
    if (confirm !== 'DELETE_ALL_DEMO_DATA') {
      return res.status(400).json({
        error: 'Confirmation required',
        message: 'Send { "confirm": "DELETE_ALL_DEMO_DATA" } to confirm deletion'
      });
    }

    console.log(`Resetting demo data for laboratory: ${laboratoryId}`);

    // Delete in reverse dependency order
    await prisma.mosquitoPool.deleteMany({ where: { laboratoryId } });
    await prisma.pCRBatch.deleteMany({ where: { laboratoryId } });
    await prisma.surveillanceAlert.deleteMany({ where: { laboratoryId } });
    await prisma.trapLocation.deleteMany({ where: { laboratoryId } });
    
    // Don't delete weather data as it's global
    // await prisma.weatherData.deleteMany({});

    res.json({
      success: true,
      message: 'Demo data reset successfully'
    });

  } catch (error) {
    console.error('Demo data reset error:', error);
    res.status(500).json({
      error: 'Failed to reset demo data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get demo data status
 * GET /api/demo-data/status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const stats = await Promise.all([
      prisma.trapLocation.count({ where: { laboratoryId } }),
      prisma.mosquitoPool.count({ where: { laboratoryId } }),
      prisma.pCRBatch.count({ where: { laboratoryId } }),
      prisma.surveillanceAlert.count({ where: { laboratoryId } }),
      prisma.weatherData.count()
    ]);

    const [trapLocations, mosquitoPools, pcrBatches, surveillanceAlerts, weatherRecords] = stats;

    // Check if demo data is present
    const hasDemoData = trapLocations > 10 && mosquitoPools > 100;

    res.json({
      success: true,
      data: {
        hasDemoData,
        trapLocations,
        mosquitoPools,
        pcrBatches,
        surveillanceAlerts,
        weatherRecords,
        laboratory: laboratoryId
      }
    });

  } catch (error) {
    console.error('Demo data status error:', error);
    res.status(500).json({
      error: 'Failed to get demo data status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;