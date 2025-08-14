import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// West Nile Virus specific interfaces
interface MosquitoPoolData {
  poolId?: string;
  collectionInfo: {
    trapLocation: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    collectionDate: Date;
    collectorName: string;
    trapType: 'CDC_LIGHT' | 'GRAVID' | 'BG_SENTINEL';
    environmentalConditions?: {
      temperature?: number;
      humidity?: number;
      windSpeed?: number;
      precipitation?: number;
    };
  };
  taxonomicInfo: {
    mosquitoSpecies: 'CULEX_PIPIENS' | 'CULEX_QUINQUEFASCIATUS' | 'AEDES_ALBOPICTUS' | 'OTHER';
    poolSize: number;
    sexDetermination: 'FEMALE' | 'MALE' | 'MIXED';
    speciesConfirmation?: string;
  };
  processingInfo: {
    processingDate: Date;
    processingTechnician: string;
    homogenizationMethod: string;
    storageConditions: string;
    extractionDate?: Date;
  };
}

interface PCRPlateData {
  plateId: string;
  plateFormat: '96_WELL';
  samples: Array<{
    wellPosition: string;
    sampleId: string;
    sampleType: 'SAMPLE' | 'POSITIVE_CONTROL' | 'NEGATIVE_CONTROL' | 'EXTRACTION_CONTROL';
  }>;
  controls: {
    positiveControls: string[];
    negativeControls: string[];
    extractionControls: string[];
  };
  reagentLots: {
    forwardPrimer: { lot: string; expiration: string };
    reversePrimer: { lot: string; expiration: string };
    probe: { lot: string; expiration: string };
    masterMix: { lot: string; expiration: string };
  };
}

interface PCRResultData {
  plateId: string;
  results: Array<{
    wellPosition: string;
    sampleId: string;
    ctValue?: number;
    result: 'POSITIVE' | 'NEGATIVE' | 'INDETERMINATE' | 'INVALID';
    notes?: string;
  }>;
  qcResults: {
    positiveControlPassed: boolean;
    negativeControlPassed: boolean;
    extractionControlPassed: boolean;
    notes?: string;
  };
  runInfo: {
    startTime: Date;
    endTime: Date;
    operator: string;
    equipmentId: string;
    protocolVersion: string;
  };
}

export class WestNileVirusService {
  /**
   * Register mosquito pool sample for West Nile virus testing
   */
  static async registerMosquitoPool(
    data: MosquitoPoolData,
    laboratoryId: string,
    userId: string
  ) {
    try {
      // Generate unique pool ID if not provided
      const poolId = data.poolId || this.generatePoolId();

      // Create sample record
      const sample = await prisma.sample.create({
        data: {
          sampleId: poolId,
          type: 'SURVEILLANCE',
          priority: 'ROUTINE',
          status: 'RECEIVED',
          receivedDate: new Date(),
          collectedBy: data.collectionInfo.collectorName,
          collectionDate: data.collectionInfo.collectionDate,
          processingDate: data.processingInfo.processingDate,
          location: data.collectionInfo.trapLocation.address || 
                   `${data.collectionInfo.trapLocation.latitude}, ${data.collectionInfo.trapLocation.longitude}`,
          notes: `Species: ${data.taxonomicInfo.mosquitoSpecies}, Pool Size: ${data.taxonomicInfo.poolSize}`,
          data: {
            poolId,
            collectionInfo: data.collectionInfo,
            taxonomicInfo: data.taxonomicInfo,
            processingInfo: data.processingInfo,
            qrCode: this.generateQRCode(poolId),
            barcode: this.generateBarcode(poolId)
          },
          laboratoryId
        }
      });

      // Create chain of custody record
      await prisma.chainOfCustodyRecord.create({
        data: {
          caseNumber: poolId,
          sampleId: poolId,
          sampleType: 'environmental',
          collectionOfficer: data.collectionInfo.collectorName,
          collectionDateTime: data.collectionInfo.collectionDate,
          collectionLocation: data.collectionInfo.trapLocation.address || 
                             `${data.collectionInfo.trapLocation.latitude}, ${data.collectionInfo.trapLocation.longitude}`,
          suspectedAgent: 'West Nile Virus',
          urgencyLevel: 'routine',
          storageConditions: data.processingInfo.storageConditions,
          currentCustodian: data.processingInfo.processingTechnician,
          status: 'active',
          laboratoryId
        }
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          action: 'MOSQUITO_POOL_REGISTERED',
          entity: 'Sample',
          entityId: sample.id,
          userId,
          laboratoryId,
          details: {
            poolId,
            trapType: data.collectionInfo.trapType,
            species: data.taxonomicInfo.mosquitoSpecies,
            poolSize: data.taxonomicInfo.poolSize
          }
        }
      });

      return {
        id: sample.id,
        poolId,
        sampleId: sample.sampleId,
        status: sample.status,
        qrCode: (sample.data as any).qrCode,
        barcode: (sample.data as any).barcode,
        createdAt: sample.createdAt
      };
    } catch (error) {
      console.error('Error registering mosquito pool:', error);
      throw new Error(`Failed to register mosquito pool: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get mosquito pools with filtering and pagination
   */
  static async getMosquitoPools(
    laboratoryId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      trapType?: string;
      species?: string;
      status?: string;
      page: number;
      limit: number;
    }
  ) {
    try {
      const where: any = {
        laboratoryId,
        type: 'SURVEILLANCE'
      };

      if (filters.startDate || filters.endDate) {
        where.collectionDate = {};
        if (filters.startDate) where.collectionDate.gte = filters.startDate;
        if (filters.endDate) where.collectionDate.lte = filters.endDate;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      // Filter by trap type and species in the data JSON field
      if (filters.trapType || filters.species) {
        where.data = {};
        if (filters.trapType) {
          where.data.path = ['collectionInfo', 'trapType'];
          where.data.equals = filters.trapType;
        }
        if (filters.species) {
          where.data.path = ['taxonomicInfo', 'mosquitoSpecies'];
          where.data.equals = filters.species;
        }
      }

      const [pools, total] = await Promise.all([
        prisma.sample.findMany({
          where,
          orderBy: { collectionDate: 'desc' },
          skip: (filters.page - 1) * filters.limit,
          take: filters.limit,
          include: {
            module: true
          }
        }),
        prisma.sample.count({ where })
      ]);

      return { pools, total };
    } catch (error) {
      console.error('Error fetching mosquito pools:', error);
      throw new Error(`Failed to fetch mosquito pools: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Setup PCR plate for West Nile virus testing
   */
  static async setupPCRPlate(
    data: PCRPlateData,
    laboratoryId: string,
    userId: string
  ) {
    try {
      // Validate that all samples exist
      const sampleIds = data.samples
        .filter(s => s.sampleType === 'SAMPLE')
        .map(s => s.sampleId);

      const existingSamples = await prisma.sample.findMany({
        where: {
          sampleId: { in: sampleIds },
          laboratoryId
        }
      });

      if (existingSamples.length !== sampleIds.length) {
        throw new Error('Some samples not found in laboratory');
      }

      // Create vector test record for the PCR run
      const vectorTest = await prisma.vectorTest.create({
        data: {
          type: 'MOSQUITO',
          priority: 'ROUTINE',
          status: 'PENDING',
          qcStatus: 'PENDING',
          sampleCount: data.samples.filter(s => s.sampleType === 'SAMPLE').length,
          expectedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
          location: 'PCR Laboratory',
          notes: `96-well plate setup for West Nile virus detection. Plate ID: ${data.plateId}`,
          laboratoryId,
          technicianId: userId
        }
      });

      // Update sample statuses to IN_PROGRESS
      await prisma.sample.updateMany({
        where: {
          sampleId: { in: sampleIds },
          laboratoryId
        },
        data: {
          status: 'PROCESSING',
          processingDate: new Date()
        }
      });

      // Store plate layout and reagent information
      const plateData = {
        vectorTestId: vectorTest.id,
        plateId: data.plateId,
        plateFormat: data.plateFormat,
        sampleLayout: data.samples,
        controls: data.controls,
        reagentLots: data.reagentLots,
        setupDate: new Date(),
        setupBy: userId
      };

      // Log the PCR setup activity
      await prisma.auditLog.create({
        data: {
          action: 'PCR_PLATE_SETUP',
          entity: 'VectorTest',
          entityId: vectorTest.id,
          userId,
          laboratoryId,
          details: {
            plateId: data.plateId,
            sampleCount: sampleIds.length,
            reagentLots: data.reagentLots
          }
        }
      });

      return {
        vectorTestId: vectorTest.id,
        plateId: data.plateId,
        status: vectorTest.status,
        sampleCount: vectorTest.sampleCount,
        expectedCompletion: vectorTest.expectedCompletion,
        plateData
      };
    } catch (error) {
      console.error('Error setting up PCR plate:', error);
      throw new Error(`Failed to setup PCR plate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Submit PCR test results for West Nile virus
   */
  static async submitPCRResults(
    data: PCRResultData,
    laboratoryId: string,
    userId: string
  ) {
    try {
      // Find the vector test by plate ID
      const vectorTest = await prisma.vectorTest.findFirst({
        where: {
          laboratoryId,
          notes: { contains: data.plateId }
        }
      });

      if (!vectorTest) {
        throw new Error(`Vector test not found for plate ${data.plateId}`);
      }

      // Validate QC results
      const qcPassed = data.qcResults.positiveControlPassed && 
                      data.qcResults.negativeControlPassed && 
                      data.qcResults.extractionControlPassed;

      // Update vector test status
      await prisma.vectorTest.update({
        where: { id: vectorTest.id },
        data: {
          status: qcPassed ? 'COMPLETED' : 'FAILED',
          qcStatus: qcPassed ? 'PASS' : 'FAIL',
          actualCompletion: data.runInfo.endTime,
          notes: vectorTest.notes + `\nQC Status: ${qcPassed ? 'PASSED' : 'FAILED'}`
        }
      });

      // Process individual sample results
      const positiveResults = [];
      for (const result of data.results) {
        if (result.sampleId && result.sampleId !== 'CONTROL') {
          // Update sample with result
          await prisma.sample.updateMany({
            where: {
              sampleId: result.sampleId,
              laboratoryId
            },
            data: {
              status: 'COMPLETED',
              completedDate: data.runInfo.endTime,
              aiAnalysis: {
                wnvResult: result.result,
                ctValue: result.ctValue,
                qcPassed,
                plateId: data.plateId,
                runDate: data.runInfo.endTime
              }
            }
          });

          // Track positive results for alerting
          if (result.result === 'POSITIVE') {
            positiveResults.push({
              sampleId: result.sampleId,
              ctValue: result.ctValue,
              wellPosition: result.wellPosition
            });
          }
        }
      }

      // Create compliance record
      await prisma.complianceReport.create({
        data: {
          title: `West Nile Virus PCR Results - ${data.plateId}`,
          description: `PCR testing results for ${data.results.length} samples`,
          reportType: 'PERFORMANCE',
          status: 'PUBLISHED',
          content: {
            plateId: data.plateId,
            results: data.results,
            qcResults: data.qcResults,
            runInfo: data.runInfo,
            positiveCount: positiveResults.length,
            totalSamples: data.results.filter((r: any) => r.sampleType !== 'CONTROL').length
          },
          laboratoryId,
          generatedById: userId
        }
      });

      // Send alerts for positive results if any
      if (positiveResults.length > 0) {
        await this.sendPositiveDetectionAlerts(
          positiveResults.map(r => r.sampleId),
          'HIGH',
          laboratoryId,
          userId
        );
      }

      // Log the results submission
      await prisma.auditLog.create({
        data: {
          action: 'PCR_RESULTS_SUBMITTED',
          entity: 'VectorTest',
          entityId: vectorTest.id,
          userId,
          laboratoryId,
          details: {
            plateId: data.plateId,
            qcPassed,
            positiveResults: positiveResults.length,
            totalResults: data.results.length
          }
        }
      });

      return {
        vectorTestId: vectorTest.id,
        plateId: data.plateId,
        qcPassed,
        positiveResults: positiveResults.length,
        totalResults: data.results.length,
        completedAt: data.runInfo.endTime
      };
    } catch (error) {
      console.error('Error submitting PCR results:', error);
      throw new Error(`Failed to submit PCR results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get surveillance summary for West Nile virus program
   */
  static async getSurveillanceSummary(
    laboratoryId: string,
    timeRange: string
  ) {
    try {
      const days = this.parseTimeRange(timeRange);
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const [
        totalSamples,
        positiveSamples,
        completedTests,
        pendingTests,
        recentActivity
      ] = await Promise.all([
        prisma.sample.count({
          where: {
            laboratoryId,
            type: 'SURVEILLANCE',
            createdAt: { gte: startDate }
          }
        }),
        prisma.sample.count({
          where: {
            laboratoryId,
            type: 'SURVEILLANCE',
            createdAt: { gte: startDate },
            aiAnalysis: {
              path: ['wnvResult'],
              equals: 'POSITIVE'
            }
          }
        }),
        prisma.vectorTest.count({
          where: {
            laboratoryId,
            status: 'COMPLETED',
            createdAt: { gte: startDate }
          }
        }),
        prisma.vectorTest.count({
          where: {
            laboratoryId,
            status: { in: ['PENDING', 'IN_PROGRESS'] }
          }
        }),
        prisma.auditLog.count({
          where: {
            laboratoryId,
            action: { contains: 'WNV' },
            createdAt: { gte: startDate }
          }
        })
      ]);

      return {
        summary: {
          totalSamples,
          positiveSamples,
          positivityRate: totalSamples > 0 ? (positiveSamples / totalSamples) * 100 : 0,
          completedTests,
          pendingTests,
          recentActivity
        },
        timeRange,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting surveillance summary:', error);
      throw new Error(`Failed to get surveillance summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get geographic analysis of West Nile virus samples
   */
  static async getGeographicAnalysis(
    laboratoryId: string,
    timeRange: string,
    includeNegative: boolean
  ) {
    try {
      const days = this.parseTimeRange(timeRange);
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const where: any = {
        laboratoryId,
        type: 'SURVEILLANCE',
        createdAt: { gte: startDate }
      };

      if (!includeNegative) {
        where.aiAnalysis = {
          path: ['wnvResult'],
          equals: 'POSITIVE'
        };
      }

      const samples = await prisma.sample.findMany({
        where,
        select: {
          id: true,
          sampleId: true,
          collectionDate: true,
          location: true,
          data: true,
          aiAnalysis: true
        }
      });

      // Process geographic data
      const geographicData = samples.map(sample => {
        const data = sample.data as any;
        const analysis = sample.aiAnalysis as any;
        
        return {
          sampleId: sample.sampleId,
          latitude: data?.collectionInfo?.trapLocation?.latitude,
          longitude: data?.collectionInfo?.trapLocation?.longitude,
          location: sample.location,
          result: analysis?.wnvResult || 'PENDING',
          ctValue: analysis?.ctValue,
          collectionDate: sample.collectionDate,
          trapType: data?.collectionInfo?.trapType,
          species: data?.taxonomicInfo?.mosquitoSpecies
        };
      }).filter(item => item.latitude && item.longitude);

      return {
        samples: geographicData,
        summary: {
          totalLocations: geographicData.length,
          positiveLocations: geographicData.filter(s => s.result === 'POSITIVE').length,
          speciesDistribution: this.calculateSpeciesDistribution(geographicData),
          trapTypeDistribution: this.calculateTrapTypeDistribution(geographicData)
        }
      };
    } catch (error) {
      console.error('Error performing geographic analysis:', error);
      throw new Error(`Failed to perform geographic analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send automated alerts for positive West Nile virus detection
   */
  static async sendPositiveDetectionAlerts(
    sampleIds: string[],
    urgencyLevel: string,
    laboratoryId: string,
    userId: string
  ) {
    try {
      const alertsCreated = [];

      for (const sampleId of sampleIds) {
        // Create high-priority notification
        const notification = await prisma.notification.create({
          data: {
            type: 'SYSTEM_ALERT',
            title: 'POSITIVE West Nile Virus Detection',
            message: `Positive WNV result detected in sample ${sampleId}. Immediate reporting required.`,
            laboratoryId,
            metadata: {
              sampleId,
              urgencyLevel,
              alertType: 'POSITIVE_WNV_DETECTION',
              timestamp: new Date()
            }
          }
        });

        alertsCreated.push(notification);

        // Log critical event
        await prisma.auditLog.create({
          data: {
            action: 'POSITIVE_WNV_ALERT_SENT',
            entity: 'Sample',
            entityId: sampleId,
            userId,
            laboratoryId,
            details: {
              sampleId,
              urgencyLevel,
              notificationId: notification.id
            }
          }
        });
      }

      return {
        alertsSent: alertsCreated.length,
        notifications: alertsCreated.map(n => n.id),
        urgencyLevel,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error sending positive detection alerts:', error);
      throw new Error(`Failed to send alerts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate compliance report for West Nile virus testing program
   */
  static async generateComplianceReport(
    laboratoryId: string,
    startDate?: Date,
    endDate?: Date,
    format: 'json' | 'pdf' = 'json'
  ) {
    try {
      const dateRange = {
        gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lte: endDate || new Date()
      };

      const [
        totalTests,
        positiveTests,
        qcFailures,
        equipmentCalibrations,
        auditActivities
      ] = await Promise.all([
        prisma.vectorTest.count({
          where: {
            laboratoryId,
            type: 'MOSQUITO',
            createdAt: dateRange
          }
        }),
        prisma.sample.count({
          where: {
            laboratoryId,
            type: 'SURVEILLANCE',
            createdAt: dateRange,
            aiAnalysis: {
              path: ['wnvResult'],
              equals: 'POSITIVE'
            }
          }
        }),
        prisma.vectorTest.count({
          where: {
            laboratoryId,
            qcStatus: 'FAIL',
            createdAt: dateRange
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId,
            status: 'COMPLETED',
            calibrationDate: dateRange
          }
        }),
        prisma.auditLog.count({
          where: {
            laboratoryId,
            createdAt: dateRange
          }
        })
      ]);

      const complianceData = {
        reportPeriod: {
          startDate: dateRange.gte,
          endDate: dateRange.lte
        },
        testingMetrics: {
          totalTests,
          positiveTests,
          positivityRate: totalTests > 0 ? (positiveTests / totalTests) * 100 : 0,
          qcFailureRate: totalTests > 0 ? (qcFailures / totalTests) * 100 : 0
        },
        qualityMetrics: {
          equipmentCalibrations,
          auditActivities,
          complianceScore: this.calculateComplianceScore(totalTests, qcFailures, equipmentCalibrations)
        },
        generatedAt: new Date(),
        laboratoryId
      };

      if (format === 'pdf') {
        // In a real implementation, this would generate a PDF
        return Buffer.from(JSON.stringify(complianceData, null, 2));
      }

      return complianceData;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw new Error(`Failed to generate compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods
  private static generatePoolId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `WNV-${year}-${random}`;
  }

  private static generateQRCode(poolId: string): string {
    // In a real implementation, this would generate an actual QR code
    return `QR:${poolId}:${Date.now()}`;
  }

  private static generateBarcode(poolId: string): string {
    // In a real implementation, this would generate an actual barcode
    return `BC:${poolId}:${Date.now()}`;
  }

  private static parseTimeRange(timeRange: string): number {
    const ranges: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '365d': 365
    };
    return ranges[timeRange] || 30;
  }

  private static calculateSpeciesDistribution(samples: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    samples.forEach(sample => {
      const species = sample.species || 'UNKNOWN';
      distribution[species] = (distribution[species] || 0) + 1;
    });
    return distribution;
  }

  private static calculateTrapTypeDistribution(samples: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    samples.forEach(sample => {
      const trapType = sample.trapType || 'UNKNOWN';
      distribution[trapType] = (distribution[trapType] || 0) + 1;
    });
    return distribution;
  }

  private static calculateComplianceScore(
    totalTests: number,
    qcFailures: number,
    calibrations: number
  ): number {
    let score = 100;
    
    // Deduct points for QC failures
    const qcFailureRate = totalTests > 0 ? (qcFailures / totalTests) * 100 : 0;
    score -= qcFailureRate * 2;
    
    // Bonus points for regular calibrations
    score += Math.min(calibrations * 2, 10);
    
    return Math.max(0, Math.min(100, score));
  }
}