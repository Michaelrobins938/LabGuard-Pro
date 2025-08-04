import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import QRCodeService from '../../backend/src/services/QRCodeService';
import PrinterService from '../../backend/src/services/PrinterService';
import { generateDemoData } from '../../backend/src/data/generateDemoData';

interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  throughput: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: NodeJS.CpuUsage;
}

interface SampleProcessingMetrics extends PerformanceMetrics {
  samplesProcessed: number;
  successCount: number;
  errorCount: number;
  averageProcessingTime: number;
}

interface BulkOperationResult {
  metrics: SampleProcessingMetrics;
  errors: Array<{ sampleId: string; error: string }>;
  warnings: string[];
}

const prisma = new PrismaClient();
const qrCodeService = new QRCodeService();
const printerService = new PrinterService();

// Test configuration
const PERFORMANCE_THRESHOLDS = {
  BULK_SAMPLE_PROCESSING: {
    maxTimePerSample: 50, // ms per sample
    maxTotalTime: 5000,   // 5 seconds for 100 samples
    minThroughput: 20,    // samples per second
    maxMemoryIncrease: 100 // MB
  },
  PCR_BATCH_CREATION: {
    maxTimeFor96Samples: 2000, // 2 seconds
    maxMemoryUsage: 50,        // MB
    minSuccessRate: 0.99       // 99% success rate
  },
  QR_GENERATION: {
    maxTimePerQR: 100,    // ms per QR code
    maxBatchTime: 3000,   // 3 seconds for 100 QR codes
    minSuccessRate: 1.0   // 100% success rate
  },
  DATABASE_OPERATIONS: {
    maxQueryTime: 500,     // ms per complex query
    maxInsertTime: 300,    // ms per bulk insert
    maxConcurrentQueries: 50
  }
};

describe('Bulk Sample Processing Performance Tests', () => {
  let testLaboratoryId: string;
  let testTrapLocations: any[];

  beforeAll(async () => {
    // Create test laboratory
    const laboratory = await prisma.laboratory.create({
      data: {
        name: 'Performance Test Lab',
        email: `perf-test-${Date.now()}@example.com`,
        planType: 'ENTERPRISE'
      }
    });
    testLaboratoryId = laboratory.id;

    // Create a few trap locations for testing
    testTrapLocations = await Promise.all([
      prisma.trapLocation.create({
        data: {
          trapId: 'PERF-001',
          latitude: 32.7555,
          longitude: -97.3308,
          address: 'Performance Test Location 1',
          city: 'Fort Worth',
          zipCode: '76102',
          county: 'Tarrant',
          state: 'TX',
          habitat: 'URBAN',
          waterSource: 'STORM_DRAIN',
          laboratoryId: testLaboratoryId
        }
      }),
      prisma.trapLocation.create({
        data: {
          trapId: 'PERF-002',
          latitude: 32.7357,
          longitude: -97.1081,
          address: 'Performance Test Location 2',
          city: 'Arlington',
          zipCode: '76006',
          county: 'Tarrant',
          state: 'TX',
          habitat: 'SUBURBAN',
          waterSource: 'CREEK',
          laboratoryId: testLaboratoryId
        }
      })
    ]);
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.mosquitoPool.deleteMany({
      where: { laboratoryId: testLaboratoryId }
    });
    await prisma.trapLocation.deleteMany({
      where: { laboratoryId: testLaboratoryId }
    });
    await prisma.laboratory.delete({
      where: { id: testLaboratoryId }
    });
    await prisma.$disconnect();
  });

  test('Process 100 mosquito pools simultaneously', async () => {
    const sampleCount = 100;
    const startMemory = process.memoryUsage();
    const startCpuUsage = process.cpuUsage();
    const startTime = performance.now();

    const samples = generateMockSamples(sampleCount, testTrapLocations);
    
    try {
      // Process all samples concurrently
      const results = await Promise.allSettled(
        samples.map(sample => processMosquitoPool(sample))
      );

      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      const endCpuUsage = process.cpuUsage(startCpuUsage);
      
      const duration = endTime - startTime;
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;

      const metrics: SampleProcessingMetrics = {
        startTime,
        endTime,
        duration,
        throughput: (successCount / duration) * 1000, // samples per second
        memoryUsage: endMemory,
        cpuUsage: endCpuUsage,
        samplesProcessed: sampleCount,
        successCount,
        errorCount,
        averageProcessingTime: duration / sampleCount
      };

      // Performance assertions
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_SAMPLE_PROCESSING.maxTotalTime);
      expect(metrics.averageProcessingTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_SAMPLE_PROCESSING.maxTimePerSample);
      expect(metrics.throughput).toBeGreaterThan(PERFORMANCE_THRESHOLDS.BULK_SAMPLE_PROCESSING.minThroughput);
      expect(successCount).toBe(sampleCount);
      expect(errorCount).toBe(0);

      // Memory usage check
      const memoryIncreaseMB = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024;
      expect(memoryIncreaseMB).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_SAMPLE_PROCESSING.maxMemoryIncrease);

      console.log('📊 Bulk Sample Processing Metrics:');
      console.log(`   • Total time: ${duration.toFixed(2)}ms`);
      console.log(`   • Samples processed: ${successCount}/${sampleCount}`);
      console.log(`   • Throughput: ${metrics.throughput.toFixed(2)} samples/sec`);
      console.log(`   • Average time per sample: ${metrics.averageProcessingTime.toFixed(2)}ms`);
      console.log(`   • Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
      console.log(`   • CPU user time: ${endCpuUsage.user / 1000}ms`);

    } catch (error) {
      throw new Error(`Bulk processing failed: ${error}`);
    }
  }, 10000); // 10 second timeout

  test('PCR batch creation with 96 samples', async () => {
    const sampleCount = 96; // Standard PCR plate
    const startTime = performance.now();

    // Create samples first
    const samples = generateMockSamples(sampleCount, testTrapLocations);
    const createdSamples = await Promise.all(
      samples.map(sample => processMosquitoPool(sample))
    );

    const batchStartTime = performance.now();

    try {
      const pcrBatch = await createPCRBatch({
        samples: createdSamples,
        laboratoryId: testLaboratoryId,
        plateLayout: 'PLATE_96'
      });

      const endTime = performance.now();
      const batchCreationTime = endTime - batchStartTime;
      const totalTime = endTime - startTime;

      // Performance assertions
      expect(batchCreationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PCR_BATCH_CREATION.maxTimeFor96Samples);
      expect(pcrBatch).toBeDefined();
      expect(pcrBatch.mosquitoPools).toHaveLength(sampleCount);

      console.log('🧪 PCR Batch Creation Metrics:');
      console.log(`   • Batch creation time: ${batchCreationTime.toFixed(2)}ms`);
      console.log(`   • Total time (including sample creation): ${totalTime.toFixed(2)}ms`);
      console.log(`   • Samples in batch: ${pcrBatch.mosquitoPools.length}`);
      console.log(`   • Batch efficiency: ${((sampleCount / totalTime) * 1000).toFixed(2)} samples/sec`);

    } catch (error) {
      throw new Error(`PCR batch creation failed: ${error}`);
    }
  }, 15000);

  test('QR code generation for 100 samples', async () => {
    const sampleCount = 100;
    const startTime = performance.now();

    // Create sample data for QR generation
    const sampleData = Array.from({ length: sampleCount }, (_, i) => ({
      poolId: `QR-TEST-${String(i + 1).padStart(3, '0')}`,
      trapId: `TRAP-${Math.floor(i / 50) + 1}`,
      collectionDate: new Date().toISOString().split('T')[0],
      latitude: 32.7555 + (Math.random() - 0.5) * 0.1,
      longitude: -97.3308 + (Math.random() - 0.5) * 0.1,
      species: 'CULEX_QUINQUEFASCIATUS',
      laboratoryId: testLaboratoryId
    }));

    try {
      // Generate QR codes in batch
      const qrBatch = await qrCodeService.generateBatchQRs(sampleData, {
        format: 'PNG',
        size: 200,
        includeText: true
      });

      const endTime = performance.now();
      const duration = endTime - startTime;
      const averageTimePerQR = duration / sampleCount;

      // Performance assertions
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.QR_GENERATION.maxBatchTime);
      expect(averageTimePerQR).toBeLessThan(PERFORMANCE_THRESHOLDS.QR_GENERATION.maxTimePerQR);
      expect(qrBatch.qrCodes).toHaveLength(sampleCount);
      expect(qrBatch.totalCount).toBe(sampleCount);

      console.log('📱 QR Code Generation Metrics:');
      console.log(`   • Total time: ${duration.toFixed(2)}ms`);
      console.log(`   • QR codes generated: ${qrBatch.totalCount}`);
      console.log(`   • Average time per QR: ${averageTimePerQR.toFixed(2)}ms`);
      console.log(`   • Throughput: ${((sampleCount / duration) * 1000).toFixed(2)} QR codes/sec`);

    } catch (error) {
      throw new Error(`QR code generation failed: ${error}`);
    }
  }, 10000);

  test('Database query performance with large datasets', async () => {
    // First, ensure we have enough data
    const existingSamples = await prisma.mosquitoPool.count({
      where: { laboratoryId: testLaboratoryId }
    });

    if (existingSamples < 500) {
      console.log('Creating additional test data for database performance tests...');
      const additionalSamples = generateMockSamples(500 - existingSamples, testTrapLocations);
      await Promise.all(additionalSamples.map(sample => processMosquitoPool(sample)));
    }

    // Test complex surveillance query
    const queryStartTime = performance.now();
    
    const surveillanceData = await prisma.mosquitoPool.findMany({
      where: {
        laboratoryId: testLaboratoryId,
        collectionDate: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      include: {
        trapLocation: true,
        pcrBatch: {
          select: {
            id: true,
            batchId: true,
            status: true
          }
        }
      },
      orderBy: { collectionDate: 'desc' },
      take: 100
    });

    const queryEndTime = performance.now();
    const queryDuration = queryEndTime - queryStartTime;

    // Test aggregation query
    const aggregationStartTime = performance.now();
    
    const monthlyStats = await prisma.mosquitoPool.groupBy({
      by: ['collectionYear', 'collectionWeek'],
      where: {
        laboratoryId: testLaboratoryId
      },
      _count: true,
      _avg: {
        poolSize: true
      },
      having: {
        poolSize: {
          _avg: {
            gt: 0
          }
        }
      }
    });

    const aggregationEndTime = performance.now();
    const aggregationDuration = aggregationEndTime - aggregationStartTime;

    // Performance assertions
    expect(queryDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.DATABASE_OPERATIONS.maxQueryTime);
    expect(aggregationDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.DATABASE_OPERATIONS.maxQueryTime);
    expect(surveillanceData).toBeDefined();
    expect(monthlyStats).toBeDefined();

    console.log('🗃️ Database Performance Metrics:');
    console.log(`   • Complex query time: ${queryDuration.toFixed(2)}ms`);
    console.log(`   • Aggregation query time: ${aggregationDuration.toFixed(2)}ms`);
    console.log(`   • Records queried: ${surveillanceData.length}`);
    console.log(`   • Aggregation groups: ${monthlyStats.length}`);

  }, 10000);

  test('Concurrent operations stress test', async () => {
    const concurrentOperations = 20;
    const samplesPerOperation = 10;
    const startTime = performance.now();

    try {
      // Run multiple operations concurrently
      const operations = Array.from({ length: concurrentOperations }, async (_, i) => {
        const samples = generateMockSamples(samplesPerOperation, testTrapLocations, `STRESS-${i}`);
        
        // Mix of different operations
        const operation = i % 4;
        switch (operation) {
          case 0: // Sample creation
            return Promise.all(samples.map(sample => processMosquitoPool(sample)));
          case 1: // QR generation
            const sampleData = samples.map(s => ({
              poolId: s.poolId,
              trapId: s.trapId,
              collectionDate: s.collectionDate,
              laboratoryId: testLaboratoryId
            }));
            return qrCodeService.generateBatchQRs(sampleData);
          case 2: // Database query
            return prisma.mosquitoPool.findMany({
              where: { laboratoryId: testLaboratoryId },
              take: 20
            });
          case 3: // Status check
            return prisma.mosquitoPool.count({
              where: { laboratoryId: testLaboratoryId }
            });
          default:
            return Promise.resolve([]);
        }
      });

      const results = await Promise.allSettled(operations);
      const endTime = performance.now();
      const duration = endTime - startTime;

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;

      // Performance assertions
      expect(successCount).toBeGreaterThan(concurrentOperations * 0.95); // 95% success rate
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds

      console.log('⚡ Concurrent Operations Metrics:');
      console.log(`   • Total time: ${duration.toFixed(2)}ms`);
      console.log(`   • Concurrent operations: ${concurrentOperations}`);
      console.log(`   • Successful operations: ${successCount}/${concurrentOperations}`);
      console.log(`   • Error rate: ${((errorCount / concurrentOperations) * 100).toFixed(2)}%`);
      console.log(`   • Operations per second: ${((concurrentOperations / duration) * 1000).toFixed(2)}`);

    } catch (error) {
      throw new Error(`Concurrent operations test failed: ${error}`);
    }
  }, 15000);

  test('Memory leak detection during bulk operations', async () => {
    const iterations = 10;
    const samplesPerIteration = 50;
    const memorySnapshots: number[] = [];

    console.log('🔍 Memory Leak Detection Test Starting...');

    for (let i = 0; i < iterations; i++) {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Take memory snapshot
      const memoryBefore = process.memoryUsage().heapUsed;
      memorySnapshots.push(memoryBefore / 1024 / 1024); // Convert to MB

      // Perform bulk operation
      const samples = generateMockSamples(samplesPerIteration, testTrapLocations, `LEAK-${i}`);
      await Promise.all(samples.map(sample => processMosquitoPool(sample)));

      console.log(`   • Iteration ${i + 1}/${iterations}: ${(memoryBefore / 1024 / 1024).toFixed(2)}MB heap used`);
    }

    // Analyze memory trend
    const memoryIncrease = memorySnapshots[memorySnapshots.length - 1] - memorySnapshots[0];
    const averageIncrease = memoryIncrease / iterations;

    // Memory leak assertion (should not increase more than 5MB per iteration on average)
    expect(averageIncrease).toBeLessThan(5);

    console.log('📈 Memory Analysis:');
    console.log(`   • Initial memory: ${memorySnapshots[0].toFixed(2)}MB`);
    console.log(`   • Final memory: ${memorySnapshots[memorySnapshots.length - 1].toFixed(2)}MB`);
    console.log(`   • Total increase: ${memoryIncrease.toFixed(2)}MB`);
    console.log(`   • Average increase per iteration: ${averageIncrease.toFixed(2)}MB`);

  }, 30000);
});

// Helper functions

function generateMockSamples(count: number, trapLocations: any[], prefix: string = 'TEST'): any[] {
  return Array.from({ length: count }, (_, i) => {
    const trap = trapLocations[i % trapLocations.length];
    return {
      poolId: `${prefix}-${String(i + 1).padStart(3, '0')}`,
      trapId: trap.trapId,
      trapLocationId: trap.id,
      collectionDate: new Date(),
      collectionWeek: Math.floor(Math.random() * 52) + 1,
      collectionYear: new Date().getFullYear(),
      collectedBy: 'Performance Test User',
      mosquitoSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_PIPIENS', 'CULEX_RESTUANS'][Math.floor(Math.random() * 3)],
      poolSize: Math.floor(Math.random() * 50) + 10,
      poolCondition: ['EXCELLENT', 'GOOD', 'FAIR'][Math.floor(Math.random() * 3)],
      testResult: 'PENDING',
      qcStatus: 'PENDING',
      laboratoryId: trap.laboratoryId
    };
  });
}

async function processMosquitoPool(sampleData: any): Promise<any> {
  return await prisma.mosquitoPool.create({
    data: sampleData
  });
}

async function createPCRBatch(params: {
  samples: any[];
  laboratoryId: string;
  plateLayout: string;
}): Promise<any> {
  const { samples, laboratoryId, plateLayout } = params;
  
  const batch = await prisma.pCRBatch.create({
    data: {
      batchId: `PCR-PERF-${Date.now()}`,
      batchDate: new Date(),
      plateLayout: plateLayout as any,
      technician: 'Performance Test Tech',
      protocol: 'Test Protocol',
      status: 'PENDING',
      positiveControls: [
        { well: 'H10', controlType: 'POSITIVE', expectedCt: 28.5 }
      ],
      negativeControls: [
        { well: 'H12', controlType: 'NEGATIVE' }
      ],
      internalControls: [
        { well: 'H11', controlType: 'INTERNAL', expectedCtRange: { min: 20, max: 28 } }
      ],
      laboratoryId
    }
  });

  // Assign samples to batch
  await prisma.mosquitoPool.updateMany({
    where: { id: { in: samples.map(s => s.id) } },
    data: { pcrBatchId: batch.id }
  });

  // Return with samples included
  return await prisma.pCRBatch.findUnique({
    where: { id: batch.id },
    include: { mosquitoPools: true }
  });
}