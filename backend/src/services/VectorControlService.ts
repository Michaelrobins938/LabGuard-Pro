import { PrismaClient, VectorTest, VectorType, VectorPriority, VectorTestStatus, QCStatus, VectorAlert, VectorAlertType, AlertPriority } from '@prisma/client';
import { AuditLogService } from './AuditLogService';
import type { AuditMeta } from './AuditLogService'

const prisma = new PrismaClient();
const auditLogService = new AuditLogService(prisma);

export interface CreateVectorTestData {
  type: VectorType;
  priority: VectorPriority;
  sampleCount: number;
  expectedCompletion: Date;
  location: string;
  notes?: string;
  technicianId?: string;
  equipmentId?: string;
  stakeholders?: {
    email: string;
    role?: string;
    organization?: string;
  }[];
}

export interface UpdateVectorTestData extends AuditMeta {
  status?: VectorTestStatus;
  qcStatus?: QCStatus;
  actualCompletion?: Date;
  notes?: string;
  technicianId?: string;
  equipmentId?: string;
}

export interface CreateVectorAlertData {
  type: VectorAlertType;
  priority: AlertPriority;
  message: string;
  actions: string[];
  testId: string;
}

export interface VectorTestWithRelations extends VectorTest {
  technician?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  equipment?: {
    id: string;
    name: string;
    model: string | null;
    location: string | null;
  } | null;
  stakeholders: {
    id: string;
    email: string;
    role: string | null;
    organization: string | null;
  }[];
  alerts: {
    id: string;
    type: VectorAlertType;
    priority: AlertPriority;
    message: string;
    actions: string[];
    resolved: boolean;
    createdAt: Date;
  }[];
}

export class VectorControlService {
  /**
   * Create a new vector control test
   */
  static async createVectorTest(
    data: CreateVectorTestData,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VectorTestWithRelations> {
    try {
      const vectorTest = await prisma.vectorTest.create({
        data: {
          type: data.type,
          priority: data.priority,
          sampleCount: data.sampleCount,
          expectedCompletion: data.expectedCompletion,
          location: data.location,
          notes: data.notes,
          laboratoryId,
          technicianId: data.technicianId,
          equipmentId: data.equipmentId,
          stakeholders: data.stakeholders ? {
            create: data.stakeholders
          } : undefined
        },
        include: {
          technician: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              location: true
            }
          },
          stakeholders: true,
          alerts: true
        }
      });

      // Log the action
      await auditLogService.log({
        laboratoryId,
        userId,
        action: 'VECTOR_TEST_CREATED',
        entity: 'VectorTest',
        entityId: vectorTest.id,
        details: {
          type: data.type,
          priority: data.priority,
          sampleCount: data.sampleCount,
          location: data.location
        },
        ipAddress,
        userAgent
      });

      return vectorTest;
    } catch (error) {
      console.error('Error creating vector test:', error);
      throw new Error('Failed to create vector test');
    }
  }

  /**
   * Get all vector tests for a laboratory
   */
  static async getVectorTests(
    laboratoryId: string,
    options: {
      status?: VectorTestStatus;
      type?: VectorType;
      priority?: VectorPriority;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<VectorTestWithRelations[]> {
    try {
      const where: any = { laboratoryId };
      
      if (options.status) where.status = options.status;
      if (options.type) where.type = options.type;
      if (options.priority) where.priority = options.priority;

      return await prisma.vectorTest.findMany({
        where,
        include: {
          technician: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              location: true
            }
          },
          stakeholders: true,
          alerts: {
            where: { resolved: false }, // Only show unresolved alerts
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: [
          { priority: 'asc' }, // OUTBREAK first, then ROUTINE, RESEARCH
          { expectedCompletion: 'asc' }
        ],
        take: options.limit || 50,
        skip: options.offset || 0
      });
    } catch (error) {
      console.error('Error fetching vector tests:', error);
      throw new Error('Failed to fetch vector tests');
    }
  }

  /**
   * Get a specific vector test by ID
   */
  static async getVectorTestById(
    id: string,
    laboratoryId: string
  ): Promise<VectorTestWithRelations | null> {
    try {
      return await prisma.vectorTest.findFirst({
        where: { id, laboratoryId },
        include: {
          technician: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              location: true
            }
          },
          stakeholders: true,
          alerts: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching vector test:', error);
      throw new Error('Failed to fetch vector test');
    }
  }

  /**
   * Update a vector test
   */
  static async updateVectorTest(
    id: string,
    data: UpdateVectorTestData,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VectorTestWithRelations> {
    try {
      const vectorTest = await prisma.vectorTest.update({
        where: { id, laboratoryId },
        data,
        include: {
          technician: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              location: true
            }
          },
          stakeholders: true,
          alerts: true
        }
      });

      // Log the action
      await auditLogService.log({
        laboratoryId,
        userId,
        action: 'VECTOR_TEST_UPDATED',
        entity: 'VectorTest',
        entityId: id,
        details: data,
        ipAddress,
        userAgent
      });

      return vectorTest;
    } catch (error) {
      console.error('Error updating vector test:', error);
      throw new Error('Failed to update vector test');
    }
  }

  /**
   * Delete a vector test
   */
  static async deleteVectorTest(
    id: string,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await prisma.vectorTest.update({
        where: { id, laboratoryId },
        data: { deletedAt: new Date() }
      });

      // Log the action
      await auditLogService.log({
        laboratoryId,
        userId,
        action: 'VECTOR_TEST_DELETED',
        entity: 'VectorTest',
        entityId: id,
        details: {},
        ipAddress,
        userAgent
      });
    } catch (error) {
      console.error('Error deleting vector test:', error);
      throw new Error('Failed to delete vector test');
    }
  }

  /**
   * Create a vector alert
   */
  static async createVectorAlert(
    data: CreateVectorAlertData,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VectorAlert> {
    try {
      const alert = await prisma.vectorAlert.create({
        data: {
          ...data,
          laboratoryId
        }
      });

      // Log the action
      await auditLogService.log({
        laboratoryId,
        userId,
        action: 'VECTOR_ALERT_CREATED',
        entity: 'VectorAlert',
        entityId: alert.id,
        details: {
          type: data.type,
          priority: data.priority,
          message: data.message,
          testId: data.testId
        },
        ipAddress,
        userAgent
      });

      return alert;
    } catch (error) {
      console.error('Error creating vector alert:', error);
      throw new Error('Failed to create vector alert');
    }
  }

  /**
   * Resolve a vector alert
   */
  static async resolveVectorAlert(
    id: string,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VectorAlert> {
    try {
      const alert = await prisma.vectorAlert.update({
        where: { id, laboratoryId },
        data: {
          resolved: true,
          resolvedAt: new Date()
        }
      });

      // Log the action
      await auditLogService.log({
        laboratoryId,
        userId,
        action: 'VECTOR_ALERT_RESOLVED',
        entity: 'VectorAlert',
        entityId: id,
        details: {},
        ipAddress,
        userAgent
      });

      return alert;
    } catch (error) {
      console.error('Error resolving vector alert:', error);
      throw new Error('Failed to resolve vector alert');
    }
  }

  /**
   * Get active alerts for a laboratory
   */
  static async getActiveAlerts(laboratoryId: string): Promise<VectorAlert[]> {
    try {
      return await prisma.vectorAlert.findMany({
        where: {
          laboratoryId,
          resolved: false
        },
        orderBy: [
          { priority: 'asc' }, // CRITICAL first
          { createdAt: 'desc' }
        ]
      });
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw new Error('Failed to fetch active alerts');
    }
  }

  /**
   * Get vector test statistics for dashboard
   */
  static async getVectorTestStats(laboratoryId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    criticalAlerts: number;
    overdueTests: number;
  }> {
    try {
      const [
        total,
        pending,
        inProgress,
        completed,
        failed,
        criticalAlerts,
        overdueTests
      ] = await Promise.all([
        prisma.vectorTest.count({ where: { laboratoryId, deletedAt: null } }),
        prisma.vectorTest.count({ where: { laboratoryId, status: 'PENDING', deletedAt: null } }),
        prisma.vectorTest.count({ where: { laboratoryId, status: 'IN_PROGRESS', deletedAt: null } }),
        prisma.vectorTest.count({ where: { laboratoryId, status: 'COMPLETED', deletedAt: null } }),
        prisma.vectorTest.count({ where: { laboratoryId, status: 'FAILED', deletedAt: null } }),
        prisma.vectorAlert.count({ 
          where: { 
            laboratoryId, 
            priority: 'CRITICAL', 
            resolved: false 
          } 
        }),
        prisma.vectorTest.count({
          where: {
            laboratoryId,
            expectedCompletion: { lt: new Date() },
            status: { not: 'COMPLETED' },
            deletedAt: null
          }
        })
      ]);

      return {
        total,
        pending,
        inProgress,
        completed,
        failed,
        criticalAlerts,
        overdueTests
      };
    } catch (error) {
      console.error('Error fetching vector test stats:', error);
      throw new Error('Failed to fetch vector test statistics');
    }
  }
} 