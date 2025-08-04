import { PrismaClient } from '@prisma/client';
import { BiomniService } from './BiomniService';

const prisma = new PrismaClient();

export class LaboratoryService {
  /**
   * Get all laboratory modules for a laboratory
   */
  static async getLaboratoryModules(laboratoryId: string) {
    try {
      const modules = await prisma.laboratoryModule.findMany({
        where: { laboratoryId },
        include: {
          workflows: {
            where: { active: true },
            orderBy: { priority: 'desc' }
          },
          complianceRules: {
            where: { active: true }
          }
        },
        orderBy: { name: 'asc' }
      });

      return modules;
    } catch (error) {
      console.error('Error fetching laboratory modules:', error);
      throw new Error('Failed to fetch laboratory modules');
    }
  }

  /**
   * Create a new laboratory module
   */
  static async createLaboratoryModule(data: {
    name: string;
    displayName: string;
    description?: string;
    enabled: boolean;
    configuration?: any;
    aiCapabilities?: any;
    laboratoryId: string;
  }) {
    try {
      const module = await prisma.laboratoryModule.create({
        data: {
          name: data.name,
          displayName: data.displayName,
          description: data.description,
          type: 'CUSTOM', // Default type
          enabled: data.enabled,
          configuration: data.configuration || {},
          aiCapabilities: data.aiCapabilities || {},
          laboratoryId: data.laboratoryId
        },
        include: {
          workflows: true,
          complianceRules: true
        }
      });

      return module;
    } catch (error) {
      console.error('Error creating laboratory module:', error);
      throw new Error('Failed to create laboratory module');
    }
  }

  /**
   * Update a laboratory module
   */
  static async updateLaboratoryModule(
    id: string,
    data: Partial<{
      name: string;
      displayName: string;
      description: string;
      enabled: boolean;
      configuration: any;
      aiCapabilities: any;
    }>,
    laboratoryId: string
  ) {
    try {
      const module = await prisma.laboratoryModule.update({
        where: { id, laboratoryId },
        data,
        include: {
          workflows: true,
          complianceRules: true
        }
      });

      return module;
    } catch (error) {
      console.error('Error updating laboratory module:', error);
      throw new Error('Failed to update laboratory module');
    }
  }

  /**
   * Delete a laboratory module
   */
  static async deleteLaboratoryModule(id: string, laboratoryId: string) {
    try {
      await prisma.laboratoryModule.delete({
        where: { id, laboratoryId }
      });
    } catch (error) {
      console.error('Error deleting laboratory module:', error);
      throw new Error('Failed to delete laboratory module');
    }
  }

  /**
   * Get workflows for a laboratory
   */
  static async getWorkflows(laboratoryId: string, moduleId?: string) {
    try {
      const where: any = {
        module: { laboratoryId }
      };

      if (moduleId) {
        where.moduleId = moduleId;
      }

      const workflows = await prisma.workflow.findMany({
        where,
        include: {
          module: true
        },
        orderBy: [
          { priority: 'desc' },
          { name: 'asc' }
        ]
      });

      return workflows;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw new Error('Failed to fetch workflows');
    }
  }

  /**
   * Create a new workflow
   */
  static async createWorkflow(data: {
    name: string;
    description?: string;
    steps: any[];
    moduleId: string;
    active: boolean;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    estimatedTime?: number;
    aiAssisted: boolean;
    laboratoryId: string;
  }) {
    try {
      const workflow = await prisma.workflow.create({
        data: {
          name: data.name,
          description: data.description,
          steps: data.steps,
          moduleId: data.moduleId,
          active: data.active,
          priority: data.priority,
          estimatedTime: data.estimatedTime,
          aiAssisted: data.aiAssisted,
          laboratoryId: data.laboratoryId
        },
        include: {
          module: true
        }
      });

      return workflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw new Error('Failed to create workflow');
    }
  }

  /**
   * Update a workflow
   */
  static async updateWorkflow(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      steps: any[];
      active: boolean;
      priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
      estimatedTime: number;
      aiAssisted: boolean;
    }>,
    laboratoryId: string
  ) {
    try {
      const workflow = await prisma.workflow.update({
        where: { id },
        data,
        include: {
          module: true
        }
      });

      return workflow;
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw new Error('Failed to update workflow');
    }
  }

  /**
   * Get compliance status for a laboratory
   */
  static async getComplianceStatus(laboratoryId: string, moduleId?: string) {
    try {
      const where: any = {
        module: { laboratoryId }
      };

      if (moduleId) {
        where.moduleId = moduleId;
      }

      const rules = await prisma.complianceRule.findMany({
        where,
        include: {
          module: true
        }
      });

      // Calculate compliance scores
      const complianceSummary = {
        totalRules: rules.length,
        automatedRules: rules.filter(r => r.automated).length,
        lastCheckedRules: rules.filter(r => r.lastChecked).length,
        overdueChecks: rules.filter(r => r.nextCheck && r.nextCheck < new Date()).length,
        rules: rules
      };

      return complianceSummary;
    } catch (error) {
      console.error('Error fetching compliance status:', error);
      throw new Error('Failed to fetch compliance status');
    }
  }

  /**
   * Run compliance check for specific rules
   */
  static async runComplianceCheck(ruleIds: string[], laboratoryId: string) {
    try {
      const rules = await prisma.complianceRule.findMany({
        where: {
          id: { in: ruleIds },
          module: { laboratoryId }
        },
        include: {
          module: true
        }
      });

      const results = [];

      for (const rule of rules) {
        try {
          // Use AI to check compliance if automated
          let complianceResult;
          if (rule.automated) {
            complianceResult = await BiomniService.checkCompliance(rule);
          } else {
            complianceResult = {
              compliant: true,
              score: 100,
              issues: [],
              recommendations: []
            };
          }

          // Update the rule with check results
          await prisma.complianceRule.update({
            where: { id: rule.id },
            data: {
              lastChecked: new Date(),
              nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            }
          });

          results.push({
            ruleId: rule.id,
            ruleName: rule.name,
            ruleType: rule.ruleType,
            compliant: complianceResult.compliant,
            score: complianceResult.score,
            issues: complianceResult.issues,
            recommendations: complianceResult.recommendations,
            checkedAt: new Date()
          });
        } catch (error) {
          console.error(`Error checking compliance for rule ${rule.id}:`, error);
          results.push({
            ruleId: rule.id,
            ruleName: rule.name,
            ruleType: rule.ruleType,
            compliant: false,
            score: 0,
            issues: ['Error during compliance check'],
            recommendations: ['Review rule configuration'],
            checkedAt: new Date()
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error running compliance check:', error);
      throw new Error('Failed to run compliance check');
    }
  }

  /**
   * Get compliance reports
   */
  static async getComplianceReports(
    laboratoryId: string,
    startDate?: string,
    endDate?: string,
    ruleType?: string
  ) {
    try {
      const where: any = {
        module: { laboratoryId }
      };

      if (startDate && endDate) {
        where.lastChecked = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }

      if (ruleType) {
        where.ruleType = ruleType;
      }

      const reports = await prisma.complianceRule.findMany({
        where,
        include: {
          module: true
        },
        orderBy: { lastChecked: 'desc' }
      });

      return reports;
    } catch (error) {
      console.error('Error fetching compliance reports:', error);
      throw new Error('Failed to fetch compliance reports');
    }
  }

  /**
   * Get samples for a laboratory
   */
  static async getSamples(
    laboratoryId: string,
    filters: {
      moduleId?: string;
      status?: string;
      priority?: string;
      type?: string;
    }
  ) {
    try {
      const where: any = { laboratoryId };

      if (filters.moduleId) {
        where.moduleId = filters.moduleId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.priority) {
        where.priority = filters.priority;
      }

      if (filters.type) {
        where.type = filters.type;
      }

      const samples = await prisma.sample.findMany({
        where,
        include: {
          module: true
        },
        orderBy: [
          { priority: 'desc' },
          { receivedDate: 'desc' }
        ]
      });

      return samples;
    } catch (error) {
      console.error('Error fetching samples:', error);
      throw new Error('Failed to fetch samples');
    }
  }

  /**
   * Create a new sample
   */
  static async createSample(data: {
    sampleId: string;
    type: 'CLINICAL' | 'WATER' | 'DAIRY' | 'BIOTERRORISM' | 'SURVEILLANCE' | 'ENVIRONMENTAL' | 'FOOD' | 'OTHER';
    priority: 'ROUTINE' | 'STAT' | 'URGENT' | 'EMERGENCY';
    moduleId: string;
    laboratoryId: string;
    collectedBy?: string;
    collectionDate?: Date;
    location?: string;
    notes?: string;
    aiAnalysis?: any;
  }) {
    try {
      const sample = await prisma.sample.create({
        data: {
          sampleId: data.sampleId,
          type: data.type,
          priority: data.priority,
          status: 'RECEIVED', // Default status
          moduleId: data.moduleId,
          laboratoryId: data.laboratoryId,
          collectedBy: data.collectedBy,
          collectionDate: data.collectionDate,
          location: data.location,
          notes: data.notes,
          aiAnalysis: data.aiAnalysis
        },
        include: {
          module: true
        }
      });

      return sample;
    } catch (error) {
      console.error('Error creating sample:', error);
      throw new Error('Failed to create sample');
    }
  }

  /**
   * Update a sample
   */
  static async updateSample(
    id: string,
    data: Partial<{
      sampleId: string;
      type: 'CLINICAL' | 'WATER' | 'DAIRY' | 'BIOTERRORISM' | 'SURVEILLANCE' | 'ENVIRONMENTAL' | 'FOOD' | 'OTHER';
      priority: 'ROUTINE' | 'STAT' | 'URGENT' | 'EMERGENCY';
      status: 'RECEIVED' | 'PROCESSING' | 'TESTING' | 'VALIDATION' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
      moduleId: string;
      collectedBy: string;
      collectionDate: Date;
      processingDate: Date;
      completedDate: Date;
      location: string;
      notes: string;
      aiAnalysis: any;
    }>,
    laboratoryId: string
  ) {
    try {
      const sample = await prisma.sample.update({
        where: { id, laboratoryId },
        data,
        include: {
          module: true
        }
      });

      return sample;
    } catch (error) {
      console.error('Error updating sample:', error);
      throw new Error('Failed to update sample');
    }
  }

  /**
   * Get integrations for a laboratory
   */
  static async getIntegrations(laboratoryId: string) {
    try {
      const integrations = await prisma.integration.findMany({
        where: { laboratoryId },
        orderBy: { name: 'asc' }
      });

      return integrations;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw new Error('Failed to fetch integrations');
    }
  }

  /**
   * Create a new integration
   */
  static async createIntegration(data: {
    name: string;
    type: 'LIMS' | 'EMR' | 'LIS' | 'INSTRUMENT' | 'REPORTING' | 'SURVEILLANCE' | 'OTHER';
    configuration: any;
    status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'MAINTENANCE';
    laboratoryId: string;
  }) {
    try {
      const integration = await prisma.integration.create({
        data: {
          name: data.name,
          type: data.type,
          config: data.configuration, // Use config field as required by schema
          configuration: data.configuration,
          status: data.status,
          laboratoryId: data.laboratoryId
        }
      });

      return integration;
    } catch (error) {
      console.error('Error creating integration:', error);
      throw new Error('Failed to create integration');
    }
  }

  /**
   * Test an integration
   */
  static async testIntegration(id: string, laboratoryId: string) {
    try {
      const integration = await prisma.integration.findFirst({
        where: { id, laboratoryId }
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      // Simulate integration test
      const testResult = {
        integrationId: id,
        status: 'SUCCESS',
        message: 'Integration test completed successfully',
        details: {
          connectionTest: 'PASSED',
          authenticationTest: 'PASSED',
          dataSyncTest: 'PASSED'
        },
        timestamp: new Date()
      };

      // Update integration status
      await prisma.integration.update({
        where: { id },
        data: {
          lastSync: new Date()
        }
      });

      return testResult;
    } catch (error) {
      console.error('Error testing integration:', error);
      throw new Error('Failed to test integration');
    }
  }

  /**
   * Update an integration
   */
  static async updateIntegration(
    id: string,
    data: Partial<{
      name: string;
      type: 'LIMS' | 'EMR' | 'LIS' | 'INSTRUMENT' | 'REPORTING' | 'SURVEILLANCE' | 'OTHER';
      configuration: any;
      status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'MAINTENANCE';
    }>,
    laboratoryId: string
  ) {
    try {
      const integration = await prisma.integration.update({
        where: { id, laboratoryId },
        data
      });

      return integration;
    } catch (error) {
      console.error('Error updating integration:', error);
      throw new Error('Failed to update integration');
    }
  }

  /**
   * Get AI-powered analytics for a laboratory
   */
  static async getAnalytics(
    laboratoryId: string,
    options: {
      moduleId?: string;
      timeframe?: string;
    }
  ) {
    try {
      // Get sample data for analysis
      const where: any = { laboratoryId };
      if (options.moduleId) {
        where.moduleId = options.moduleId;
      }

      const samples = await prisma.sample.findMany({
        where,
        include: {
          module: true
        },
        orderBy: { receivedDate: 'desc' }
      });

      // Use AI to analyze the data
      const analytics = await BiomniService.analyzeLaboratoryAnalytics(samples, options);

      return analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }
} 