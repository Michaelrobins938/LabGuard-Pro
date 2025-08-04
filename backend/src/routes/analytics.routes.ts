import { Router } from 'express';
import { Request, Response } from 'express';
import AnalyticsService from '../services/AnalyticsService';
import { z } from 'zod';

const router = Router();
const analyticsService = new AnalyticsService();

// Validation schemas
const spatialTemporalAnalysisSchema = z.object({
  dateRange: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  spatialRadius: z.number().min(0.1).max(50).optional(),
  temporalWindow: z.number().min(1).max(90).optional(),
  minSampleSize: z.number().min(1).max(100).optional(),
  minPositiveRate: z.number().min(0).max(1).optional()
});

const heatmapSchema = z.object({
  dateRange: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  metric: z.enum(['POSITIVITY_RATE', 'SAMPLE_DENSITY', 'RISK_SCORE']),
  resolution: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional()
});

const surveillanceMetricsSchema = z.object({
  dateRange: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  includeForecasting: z.boolean().optional()
});

const outbreakDetectionSchema = z.object({
  baselinePeriod: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  currentPeriod: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  sensitivityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional()
});

const forecastingSchema = z.object({
  historicalPeriod: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  forecastPeriod: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }),
  model: z.enum(['SEASONAL', 'REGRESSION', 'ENSEMBLE']).optional()
});

/**
 * Perform spatial-temporal clustering analysis
 * POST /api/analytics/spatial-temporal
 */
router.post('/spatial-temporal', async (req: Request, res: Response) => {
  try {
    const validation = spatialTemporalAnalysisSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const analysis = await analyticsService.performSpatialTemporalAnalysis({
      laboratoryId,
      ...validation.data
    });

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Spatial-temporal analysis error:', error);
    res.status(500).json({
      error: 'Failed to perform spatial-temporal analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate surveillance heatmap data
 * POST /api/analytics/heatmap
 */
router.post('/heatmap', async (req: Request, res: Response) => {
  try {
    const validation = heatmapSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const heatmapData = await analyticsService.generateSurveillanceHeatmap({
      laboratoryId,
      ...validation.data
    });

    res.json({
      success: true,
      data: heatmapData
    });

  } catch (error) {
    console.error('Heatmap generation error:', error);
    res.status(500).json({
      error: 'Failed to generate heatmap',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Calculate comprehensive surveillance metrics
 * POST /api/analytics/surveillance-metrics
 */
router.post('/surveillance-metrics', async (req: Request, res: Response) => {
  try {
    const validation = surveillanceMetricsSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const metrics = await analyticsService.calculateSurveillanceMetrics({
      laboratoryId,
      ...validation.data
    });

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Surveillance metrics calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate surveillance metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Detect outbreak patterns
 * POST /api/analytics/outbreak-detection
 */
router.post('/outbreak-detection', async (req: Request, res: Response) => {
  try {
    const validation = outbreakDetectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const outbreakAnalysis = await analyticsService.detectOutbreakPatterns({
      laboratoryId,
      ...validation.data
    });

    res.json({
      success: true,
      data: outbreakAnalysis
    });

  } catch (error) {
    console.error('Outbreak detection error:', error);
    res.status(500).json({
      error: 'Failed to detect outbreak patterns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Forecast West Nile virus activity
 * POST /api/analytics/forecast
 */
router.post('/forecast', async (req: Request, res: Response) => {
  try {
    const validation = forecastingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const forecast = await analyticsService.forecastWNVActivity({
      laboratoryId,
      ...validation.data
    });

    res.json({
      success: true,
      data: forecast
    });

  } catch (error) {
    console.error('WNV forecasting error:', error);
    res.status(500).json({
      error: 'Failed to forecast WNV activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get analytical dashboard summary
 * GET /api/analytics/dashboard
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    // Default to last 30 days for dashboard
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get multiple analytics in parallel
    const [
      spatialAnalysis,
      surveillanceMetrics,
      heatmapData
    ] = await Promise.all([
      analyticsService.performSpatialTemporalAnalysis({
        laboratoryId,
        dateRange: { start: startDate, end: endDate },
        spatialRadius: 5,
        temporalWindow: 14
      }).catch(error => {
        console.warn('Spatial analysis failed:', error);
        return { clusters: [], alerts: [], summary: { totalClusters: 0, activeClusters: 0, highRiskClusters: 0, overallRisk: 'LOW' } };
      }),
      
      analyticsService.calculateSurveillanceMetrics({
        laboratoryId,
        dateRange: { start: startDate, end: endDate },
        includeForecasting: false
      }).catch(error => {
        console.warn('Surveillance metrics failed:', error);
        return {
          periodStart: startDate,
          periodEnd: endDate,
          totalSamples: 0,
          positiveSamples: 0,
          positivityRate: 0,
          spatialCoverage: { activeTraps: 0, totalTraps: 0, coveragePercentage: 0 },
          temporalTrends: { weeklyPositivityRate: [], monthlyTrends: [], seasonalPattern: [] },
          hotspots: [],
          alerts: [],
          riskAssessment: { currentRisk: 'LOW', forecast: [], factors: [] }
        };
      }),
      
      analyticsService.generateSurveillanceHeatmap({
        laboratoryId,
        dateRange: { start: startDate, end: endDate },
        metric: 'POSITIVITY_RATE',
        resolution: 'MEDIUM'
      }).catch(error => {
        console.warn('Heatmap generation failed:', error);
        return {
          points: [],
          bounds: { north: 0, south: 0, east: 0, west: 0 },
          legend: { min: 0, max: 0, unit: '%', description: 'No data available' }
        };
      })
    ]);

    // Compile dashboard summary
    const dashboardSummary = {
      dateRange: { start: startDate, end: endDate },
      overview: {
        totalSamples: surveillanceMetrics.totalSamples,
        positiveSamples: surveillanceMetrics.positiveSamples,
        positivityRate: surveillanceMetrics.positivityRate,
        activeClusters: spatialAnalysis.summary.activeClusters,
        currentRisk: spatialAnalysis.summary.overallRisk
      },
      spatialAnalysis: {
        clusters: spatialAnalysis.clusters.slice(0, 10), // Top 10 clusters
        summary: spatialAnalysis.summary
      },
      alerts: spatialAnalysis.alerts.slice(0, 5), // Top 5 alerts
      heatmap: {
        pointCount: heatmapData.points.length,
        bounds: heatmapData.bounds,
        legend: heatmapData.legend
      },
      spatialCoverage: surveillanceMetrics.spatialCoverage,
      recentTrends: {
        weeklyData: surveillanceMetrics.temporalTrends.weeklyPositivityRate.slice(-8), // Last 8 weeks
        riskAssessment: surveillanceMetrics.riskAssessment
      }
    };

    res.json({
      success: true,
      data: dashboardSummary
    });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      error: 'Failed to generate dashboard summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get cluster details
 * GET /api/analytics/cluster/:clusterId
 */
router.get('/cluster/:clusterId', async (req: Request, res: Response) => {
  try {
    const { clusterId } = req.params;
    const laboratoryId = (req as any).user?.laboratoryId;
    
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    // In a real implementation, this would fetch cluster details from database
    // For now, we'll return a mock response
    const clusterDetails = {
      id: clusterId,
      status: 'ACTIVE',
      riskLevel: 'HIGH',
      affectedArea: {
        centroid: { latitude: 32.7555, longitude: -97.3308 },
        radius: 5.2,
        cities: ['Fort Worth', 'Arlington'],
        zipCodes: ['76102', '76103', '76104']
      },
      timeline: {
        firstDetection: new Date('2024-07-15'),
        lastActivity: new Date('2024-07-28'),
        duration: 13
      },
      samples: {
        total: 47,
        positive: 12,
        positivityRate: 0.255
      },
      affectedTraps: [
        { trapId: 'FTW-001', distance: 0.5, samples: 8, positive: 3 },
        { trapId: 'FTW-002', distance: 1.2, samples: 12, positive: 4 },
        { trapId: 'ARL-015', distance: 2.1, samples: 15, positive: 3 }
      ],
      recommendations: [
        'Increase trap density within 3km radius',
        'Implement targeted larvicide treatment',
        'Issue advisory for residents in affected zip codes',
        'Schedule additional collection rounds'
      ],
      weatherFactors: {
        averageTemp: 85.2,
        totalPrecipitation: 2.4,
        humidity: 68,
        windSpeed: 8.1
      }
    };

    res.json({
      success: true,
      data: clusterDetails
    });

  } catch (error) {
    console.error('Cluster details error:', error);
    res.status(500).json({
      error: 'Failed to get cluster details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Export analytics data
 * GET /api/analytics/export
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId;
    if (!laboratoryId) {
      return res.status(401).json({ error: 'Laboratory ID not found' });
    }

    const { 
      format = 'json',
      dateRange,
      dataType = 'surveillance-metrics'
    } = req.query;

    // Validate date range
    if (!dateRange || typeof dateRange !== 'string') {
      return res.status(400).json({ error: 'Date range is required' });
    }

    const [startStr, endStr] = dateRange.split(',');
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date range format' });
    }

    let exportData: any;

    switch (dataType) {
      case 'surveillance-metrics':
        exportData = await analyticsService.calculateSurveillanceMetrics({
          laboratoryId,
          dateRange: { start: startDate, end: endDate }
        });
        break;
      case 'spatial-analysis':
        exportData = await analyticsService.performSpatialTemporalAnalysis({
          laboratoryId,
          dateRange: { start: startDate, end: endDate }
        });
        break;
      case 'heatmap':
        exportData = await analyticsService.generateSurveillanceHeatmap({
          laboratoryId,
          dateRange: { start: startDate, end: endDate },
          metric: 'POSITIVITY_RATE'
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }

    // Set appropriate headers based on format
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${dataType}-${startStr}-${endStr}.csv`);
      
      // Convert to CSV (simplified)
      const csvData = convertToCSV(exportData);
      res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${dataType}-${startStr}-${endStr}.json`);
      
      res.json({
        metadata: {
          exportDate: new Date(),
          laboratoryId,
          dateRange: { start: startDate, end: endDate },
          dataType,
          format
        },
        data: exportData
      });
    }

  } catch (error) {
    console.error('Analytics export error:', error);
    res.status(500).json({
      error: 'Failed to export analytics data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any): string {
  if (!data || typeof data !== 'object') {
    return '';
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];
    return csvRows.join('\n');
  } else {
    // Handle single object
    const headers = Object.keys(data);
    const csvRows = [
      headers.join(','),
      headers.map(header => {
        const value = data[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ];
    return csvRows.join('\n');
  }
}

export default router;