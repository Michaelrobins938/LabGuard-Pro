import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Calibration interfaces for West Nile virus laboratory equipment
interface CalibrationScheduleData {
  equipmentId: string;
  calibrationType: 'THERMAL' | 'PIPETTE' | 'BALANCE' | 'FULL_SERVICE';
  scheduledDate: Date;
  dueDate: Date;
  priority: 'ROUTINE' | 'URGENT' | 'CRITICAL';
  notes?: string;
}

interface ThermalCalibrationData {
  equipmentId: string;
  testTemperatures: number[]; // [50, 60, 72, 95] for WNV protocol
  dwellTime: number; // minutes
  rampRates: {
    heating: number;
    cooling: number;
  };
  uniformityTest: boolean;
  reproducibilityTest: boolean;
  acceptanceCriteria: {
    temperatureTolerance: number; // ±0.5°C
    uniformityLimit: number; // 1.0°C max difference
    reproducibilityLimit: number; // 0.2°C between runs
    rampRateAccuracy: number; // 5% acceptable variance
  };
}

interface PipetteCalibrationData {
  equipmentId: string;
  testVolumes: number[]; // [10, 50, 100, 200, 1000] μL
  replicates: number; // 10 measurements per volume
  environmentalConditions: {
    temperature: number;
    humidity: number;
    barometricPressure: number;
  };
  waterQuality: {
    resistivity: number; // MΩ·cm
    temperature: number;
    evaporationCorrection: boolean;
  };
  acceptanceLimits: {
    accuracy: number; // ±2% for molecular diagnostics
    precision: number; // CV < 1%
  };
}

export class CalibrationService {
  /**
   * Schedule automatic calibrations for West Nile virus laboratory equipment
   */
  static async scheduleCalibrations(laboratoryId: string) {
    try {
      // Get all active equipment that needs calibration
      const equipment = await prisma.equipment.findMany({
        where: {
          laboratoryId,
          status: 'ACTIVE',
          deletedAt: null,
          OR: [
            { nextCalibrationAt: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
            { nextCalibrationAt: null }
          ]
        }
      });

      const scheduledCalibrations = [];

      for (const item of equipment) {
        const calibrationInterval = item.calibrationIntervalDays || 365;
        const dueDate = new Date(Date.now() + calibrationInterval * 24 * 60 * 60 * 1000);
        const scheduledDate = new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Schedule 1 week before due

        // Determine calibration type based on equipment
        let calibrationType: 'THERMAL' | 'PIPETTE' | 'BALANCE' | 'FULL_SERVICE' = 'FULL_SERVICE';
        let priority: 'ROUTINE' | 'URGENT' | 'CRITICAL' = 'ROUTINE';

        if (item.equipmentType === 'ANALYZER' && 
            (item.name.toLowerCase().includes('pcr') || item.name.toLowerCase().includes('cycler'))) {
          calibrationType = 'THERMAL';
          priority = 'CRITICAL'; // PCR equipment is critical for WNV testing
        } else if (item.name.toLowerCase().includes('pipette')) {
          calibrationType = 'PIPETTE';
          priority = 'CRITICAL'; // Pipettes are critical for accurate volume delivery
        } else if (item.equipmentType === 'BALANCE') {
          calibrationType = 'BALANCE';
          priority = 'URGENT'; // Balances important for reagent preparation
        }

        const calibrationRecord = await prisma.calibrationRecord.create({
          data: {
            equipmentId: item.id,
            userId: 'system', // System-scheduled
            laboratoryId,
            calibrationDate: new Date(),
            dueDate,
            scheduledDate,
            status: 'PENDING',
            method: this.getCalibrationMethod(calibrationType),
            notes: `Automatically scheduled ${calibrationType.toLowerCase()} calibration for West Nile virus laboratory compliance`
          }
        });

        // Update equipment next calibration date
        await prisma.equipment.update({
          where: { id: item.id },
          data: { nextCalibrationAt: dueDate }
        });

        // Create notification
        await prisma.notification.create({
          data: {
            type: 'CALIBRATION_DUE',
            title: `Calibration Scheduled: ${item.name}`,
            message: `${calibrationType} calibration scheduled for ${scheduledDate.toLocaleDateString()}`,
            laboratoryId,
            metadata: {
              equipmentId: item.id,
              calibrationId: calibrationRecord.id,
              calibrationType,
              priority,
              dueDate
            }
          }
        });

        scheduledCalibrations.push({
          equipmentId: item.id,
          equipmentName: item.name,
          calibrationType,
          priority,
          scheduledDate,
          dueDate,
          calibrationId: calibrationRecord.id
        });
      }

      return {
        scheduledCount: scheduledCalibrations.length,
        calibrations: scheduledCalibrations
      };
    } catch (error) {
      console.error('Error scheduling calibrations:', error);
      throw new Error(`Failed to schedule calibrations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform thermal calibration for PCR machines used in West Nile virus testing
   */
  static async performThermalCalibration(
    data: ThermalCalibrationData,
    laboratoryId: string,
    userId: string
  ) {
    try {
      // Find the calibration record
      const calibrationRecord = await prisma.calibrationRecord.findFirst({
        where: {
          equipmentId: data.equipmentId,
          status: 'PENDING',
          laboratoryId
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!calibrationRecord) {
        throw new Error('No pending calibration record found for this equipment');
      }

      // Simulate thermal calibration measurements
      const measurements = await this.simulateThermalMeasurements(data);
      
      // Validate results against acceptance criteria
      const results = this.validateThermalResults(measurements, data.acceptanceCriteria);

      // Update calibration record
      const updatedRecord = await prisma.calibrationRecord.update({
        where: { id: calibrationRecord.id },
        data: {
          status: 'COMPLETED',
          result: results.passed ? 'PASS' : 'FAIL',
          performedDate: new Date(),
          temperature: data.testTemperatures[0], // First test temperature
          accuracy: results.accuracy,
          precision: results.precision,
          linearity: results.linearity,
          repeatability: results.repeatability,
          isCompliant: results.passed,
          complianceScore: results.complianceScore,
          notes: `Thermal calibration completed. ${results.passed ? 'All criteria met' : 'Failed criteria: ' + results.failedCriteria.join(', ')}`,
          deviations: results.deviations,
          correctiveActions: results.passed ? undefined : results.correctiveActions,
          reportGenerated: true
        }
      });

      // Update equipment calibration date
      await prisma.equipment.update({
        where: { id: data.equipmentId },
        data: {
          lastCalibratedAt: new Date(),
          nextCalibrationAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Annual for thermal
          status: results.passed ? 'ACTIVE' : 'MAINTENANCE'
        }
      });

      // Create CLIA compliance notification if failed
      if (!results.passed) {
        await prisma.notification.create({
          data: {
            type: 'SYSTEM_ALERT',
            title: 'CRITICAL: Calibration Failure',
            message: `Thermal calibration failed for PCR equipment. Immediate corrective action required.`,
            laboratoryId,
            metadata: {
              equipmentId: data.equipmentId,
              calibrationId: calibrationRecord.id,
              failedCriteria: results.failedCriteria,
              urgency: 'CRITICAL'
            }
          }
        });
      }

      // Log calibration activity
      await prisma.auditLog.create({
        data: {
          action: 'THERMAL_CALIBRATION_COMPLETED',
          entity: 'CalibrationRecord',
          entityId: calibrationRecord.id,
          userId,
          laboratoryId,
          details: {
            equipmentId: data.equipmentId,
            result: results.passed ? 'PASS' : 'FAIL',
            complianceScore: results.complianceScore,
            testTemperatures: data.testTemperatures
          }
        }
      });

      return {
        calibrationId: calibrationRecord.id,
        result: results.passed ? 'PASS' : 'FAIL',
        complianceScore: results.complianceScore,
        measurements,
        analysis: results,
        nextCalibrationDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      console.error('Error performing thermal calibration:', error);
      throw new Error(`Failed to perform thermal calibration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform pipette calibration for accurate West Nile virus sample preparation
   */
  static async performPipetteCalibration(
    data: PipetteCalibrationData,
    laboratoryId: string,
    userId: string
  ) {
    try {
      const calibrationRecord = await prisma.calibrationRecord.findFirst({
        where: {
          equipmentId: data.equipmentId,
          status: 'PENDING',
          laboratoryId
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!calibrationRecord) {
        throw new Error('No pending calibration record found for this equipment');
      }

      // Perform gravimetric testing simulation
      const measurements = await this.simulatePipetteMeasurements(data);
      
      // Calculate accuracy and precision
      const results = this.validatePipetteResults(measurements, data.acceptanceLimits);

      // Update calibration record
      const updatedRecord = await prisma.calibrationRecord.update({
        where: { id: calibrationRecord.id },
        data: {
          status: 'COMPLETED',
          result: results.passed ? 'PASS' : 'FAIL',
          performedDate: new Date(),
          temperature: data.environmentalConditions.temperature,
          humidity: data.environmentalConditions.humidity,
          pressure: data.environmentalConditions.barometricPressure,
          accuracy: results.accuracy,
          precision: results.precision,
          isCompliant: results.passed,
          complianceScore: results.complianceScore,
          notes: `Pipette calibration completed. ${results.passed ? 'Meets molecular diagnostics requirements' : 'Failed accuracy/precision requirements'}`,
          deviations: results.deviations,
          correctiveActions: results.passed ? undefined : results.correctiveActions
        }
      });

      // Update equipment status
      await prisma.equipment.update({
        where: { id: data.equipmentId },
        data: {
          lastCalibratedAt: new Date(),
          nextCalibrationAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Quarterly for pipettes
          status: results.passed ? 'ACTIVE' : 'MAINTENANCE',
          accuracy: results.accuracy,
          precision: results.precision
        }
      });

      return {
        calibrationId: calibrationRecord.id,
        result: results.passed ? 'PASS' : 'FAIL',
        accuracy: results.accuracy,
        precision: results.precision,
        complianceScore: results.complianceScore,
        measurements,
        nextCalibrationDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      console.error('Error performing pipette calibration:', error);
      throw new Error(`Failed to perform pipette calibration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get calibration dashboard data for West Nile virus laboratory
   */
  static async getCalibrationDashboard(laboratoryId: string) {
    try {
      const [
        pendingCalibrations,
        overdueCalibrations,
        completedThisMonth,
        upcomingCalibrations,
        complianceMetrics
      ] = await Promise.all([
        prisma.calibrationRecord.count({
          where: {
            laboratoryId,
            status: 'PENDING'
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId,
            dueDate: { lt: new Date() },
            status: { not: 'COMPLETED' }
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId,
            status: 'COMPLETED',
            performedDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        prisma.calibrationRecord.findMany({
          where: {
            laboratoryId,
            status: 'PENDING',
            dueDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          },
          include: {
            equipment: {
              select: { id: true, name: true, equipmentType: true }
            }
          },
          orderBy: { dueDate: 'asc' }
        }),
        this.calculateComplianceMetrics(laboratoryId)
      ]);

      return {
        summary: {
          pendingCalibrations,
          overdueCalibrations,
          completedThisMonth,
          upcomingCount: upcomingCalibrations.length,
          complianceScore: complianceMetrics.overallScore
        },
        upcomingCalibrations: upcomingCalibrations.map(cal => ({
          id: cal.id,
          equipmentId: cal.equipmentId,
          equipmentName: cal.equipment.name,
          equipmentType: cal.equipment.equipmentType,
          dueDate: cal.dueDate,
          scheduledDate: cal.scheduledDate,
          method: cal.method,
          daysUntilDue: Math.ceil((cal.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        })),
        compliance: complianceMetrics
      };
    } catch (error) {
      console.error('Error getting calibration dashboard:', error);
      throw new Error(`Failed to get calibration dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate CLIA compliance calibration report
   */
  static async generateCLIAComplianceReport(
    laboratoryId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      const dateRange = {
        gte: startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lte: endDate || new Date()
      };

      const [calibrations, equipment] = await Promise.all([
        prisma.calibrationRecord.findMany({
          where: {
            laboratoryId,
            performedDate: dateRange
          },
          include: {
            equipment: {
              select: { name: true, equipmentType: true, serialNumber: true }
            }
          },
          orderBy: { performedDate: 'desc' }
        }),
        prisma.equipment.findMany({
          where: { laboratoryId, deletedAt: null },
          select: { id: true, name: true, equipmentType: true }
        })
      ]);

      const complianceAnalysis = {
        reportPeriod: { startDate: dateRange.gte, endDate: dateRange.lte },
        equipmentSummary: {
          totalEquipment: equipment.length,
          pcrMachines: equipment.filter(e => e.name.toLowerCase().includes('pcr')).length,
          pipettes: equipment.filter(e => e.name.toLowerCase().includes('pipette')).length,
          balances: equipment.filter(e => e.equipmentType === 'BALANCE').length
        },
        calibrationSummary: {
          totalCalibrations: calibrations.length,
          passedCalibrations: calibrations.filter(c => c.result === 'PASS').length,
          failedCalibrations: calibrations.filter(c => c.result === 'FAIL').length,
          overdueCounts: await this.getOverdueCounts(laboratoryId)
        },
        cliaCompliance: {
          thermalCalibrationCompliance: this.assessThermalCompliance(calibrations),
          pipetteCalibrationCompliance: this.assessPipetteCompliance(calibrations),
          overallComplianceScore: await this.calculateOverallCompliance(laboratoryId)
        },
        recommendations: this.generateComplianceRecommendations(calibrations),
        generatedAt: new Date()
      };

      return complianceAnalysis;
    } catch (error) {
      console.error('Error generating CLIA compliance report:', error);
      throw new Error(`Failed to generate CLIA compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods
  private static getCalibrationMethod(type: string): string {
    const methods = {
      THERMAL: 'NIST-traceable thermometer verification with uniformity and reproducibility testing',
      PIPETTE: 'Gravimetric testing with NIST-traceable weights and environmental monitoring',
      BALANCE: 'Linearity, repeatability, and eccentricity testing with certified weights',
      FULL_SERVICE: 'Comprehensive manufacturer service protocol with performance verification'
    };
    return methods[type as keyof typeof methods] || methods.FULL_SERVICE;
  }

  private static async simulateThermalMeasurements(data: ThermalCalibrationData) {
    // Simulate realistic thermal calibration measurements
    const measurements = [];
    
    for (const targetTemp of data.testTemperatures) {
      const wellMeasurements = [];
      
      // Simulate 96-well measurements with realistic variation
      for (let well = 1; well <= 96; well++) {
        const measurement = targetTemp + (Math.random() - 0.5) * 0.8; // ±0.4°C variation
        wellMeasurements.push({
          well: `${String.fromCharCode(65 + Math.floor((well - 1) / 12))}${((well - 1) % 12) + 1}`,
          temperature: Number(measurement.toFixed(2))
        });
      }
      
      measurements.push({
        targetTemperature: targetTemp,
        actualTemperatures: wellMeasurements,
        dwellTime: data.dwellTime
      });
    }
    
    return measurements;
  }

  private static validateThermalResults(measurements: any[], criteria: any) {
    const results = {
      passed: true,
      accuracy: 0,
      precision: 0,
      linearity: 0,
      repeatability: 0,
      complianceScore: 100,
      failedCriteria: [] as string[],
      deviations: [] as any[],
      correctiveActions: [] as string[]
    };

    for (const measurement of measurements) {
      const temps = measurement.actualTemperatures.map((t: any) => t.temperature);
      const target = measurement.targetTemperature;
      const mean = temps.reduce((a: number, b: number) => a + b, 0) / temps.length;
      const stdDev = Math.sqrt(temps.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / temps.length);
      
      // Check temperature tolerance
      const accuracy = Math.abs(mean - target);
      if (accuracy > criteria.temperatureTolerance) {
        results.passed = false;
        results.failedCriteria.push(`Temperature tolerance exceeded at ${target}°C`);
        results.correctiveActions.push('Recalibrate thermal block');
      }
      
      // Check uniformity
      const uniformity = Math.max(...temps) - Math.min(...temps);
      if (uniformity > criteria.uniformityLimit) {
        results.passed = false;
        results.failedCriteria.push(`Uniformity limit exceeded at ${target}°C`);
        results.correctiveActions.push('Check thermal block condition');
      }
      
      results.accuracy = Math.max(results.accuracy, accuracy);
      results.precision = Math.max(results.precision, stdDev);
    }

    results.complianceScore = results.passed ? 100 : Math.max(0, 100 - results.failedCriteria.length * 20);
    
    return results;
  }

  private static async simulatePipetteMeasurements(data: PipetteCalibrationData) {
    // Simulate gravimetric pipette measurements
    const measurements = [];
    
    for (const volume of data.testVolumes) {
      const replicateMeasurements = [];
      
      for (let i = 0; i < data.replicates; i++) {
        // Simulate weight measurement with realistic precision
        const expectedWeight = volume * 0.998; // Water density at room temp
        const actualWeight = expectedWeight + (Math.random() - 0.5) * 0.02; // ±1% variation
        
        replicateMeasurements.push({
          replicate: i + 1,
          targetVolume: volume,
          actualWeight: Number(actualWeight.toFixed(4)),
          calculatedVolume: Number((actualWeight / 0.998).toFixed(2))
        });
      }
      
      measurements.push({
        targetVolume: volume,
        replicates: replicateMeasurements
      });
    }
    
    return measurements;
  }

  private static validatePipetteResults(measurements: any[], limits: any) {
    const results = {
      passed: true,
      accuracy: 0,
      precision: 0,
      complianceScore: 100,
      deviations: [] as any[],
      correctiveActions: [] as string[]
    };

    for (const measurement of measurements) {
      const volumes = measurement.replicates.map((r: any) => r.calculatedVolume);
      const target = measurement.targetVolume;
      const mean = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;
      const cv = (Math.sqrt(volumes.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / volumes.length) / mean) * 100;
      
      // Check accuracy
      const accuracy = Math.abs((mean - target) / target) * 100;
      if (accuracy > limits.accuracy) {
        results.passed = false;
        results.correctiveActions.push(`Adjust pipette calibration for ${target}μL`);
      }
      
      // Check precision
      if (cv > limits.precision) {
        results.passed = false;
        results.correctiveActions.push(`Service pipette for improved precision at ${target}μL`);
      }
      
      results.accuracy = Math.max(results.accuracy, accuracy);
      results.precision = Math.max(results.precision, cv);
    }

    results.complianceScore = results.passed ? 100 : Math.max(0, 100 - results.correctiveActions.length * 15);
    
    return results;
  }

  private static async calculateComplianceMetrics(laboratoryId: string) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [overdue, completed, equipment] = await Promise.all([
      prisma.calibrationRecord.count({
        where: { laboratoryId, dueDate: { lt: new Date() }, status: { not: 'COMPLETED' } }
      }),
      prisma.calibrationRecord.count({
        where: { laboratoryId, status: 'COMPLETED', performedDate: { gte: thirtyDaysAgo } }
      }),
      prisma.equipment.count({
        where: { laboratoryId, deletedAt: null }
      })
    ]);

    const overallScore = Math.max(0, 100 - (overdue * 10));
    
    return {
      overallScore,
      overdueCount: overdue,
      completedRecently: completed,
      equipmentCount: equipment,
      complianceRate: equipment > 0 ? ((equipment - overdue) / equipment) * 100 : 100
    };
  }

  private static async getOverdueCounts(laboratoryId: string) {
    return prisma.calibrationRecord.count({
      where: {
        laboratoryId,
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' }
      }
    });
  }

  private static assessThermalCompliance(calibrations: any[]) {
    const thermalCals = calibrations.filter(c => c.method?.includes('thermometer'));
    const passed = thermalCals.filter(c => c.result === 'PASS').length;
    
    return {
      total: thermalCals.length,
      passed,
      complianceRate: thermalCals.length > 0 ? (passed / thermalCals.length) * 100 : 0
    };
  }

  private static assessPipetteCompliance(calibrations: any[]) {
    const pipetteCals = calibrations.filter(c => c.method?.includes('Gravimetric'));
    const passed = pipetteCals.filter(c => c.result === 'PASS').length;
    
    return {
      total: pipetteCals.length,
      passed,
      complianceRate: pipetteCals.length > 0 ? (passed / pipetteCals.length) * 100 : 0
    };
  }

  private static async calculateOverallCompliance(laboratoryId: string) {
    const metrics = await this.calculateComplianceMetrics(laboratoryId);
    return metrics.overallScore;
  }

  private static generateComplianceRecommendations(calibrations: any[]) {
    const recommendations = [];
    
    const failures = calibrations.filter(c => c.result === 'FAIL');
    if (failures.length > 0) {
      recommendations.push('Address failed calibrations immediately to maintain CLIA compliance');
    }
    
    const overdue = calibrations.filter(c => c.dueDate < new Date() && c.status !== 'COMPLETED');
    if (overdue.length > 0) {
      recommendations.push('Complete overdue calibrations to avoid compliance violations');
    }
    
    recommendations.push('Implement preventive maintenance schedule for critical PCR equipment');
    recommendations.push('Maintain environmental monitoring records for all calibrations');
    
    return recommendations;
  }
}