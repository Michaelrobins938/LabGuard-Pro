import { PrismaClient } from '@labguard/database'
import { EncryptionService } from '../security/EncryptionService'

export interface Organization {
  id: string
  name: string
  domain: string
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
  settings: {
    maxUsers: number
    maxEquipment: number
    features: string[]
    complianceFrameworks: string[]
    customBranding: boolean
    ssoEnabled: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
  organizationId: string
  isSystem: boolean
}

export class MultiTenancyService {
  private prisma: PrismaClient
  private encryptionService: EncryptionService

  constructor() {
    this.prisma = new PrismaClient()
    this.encryptionService = new EncryptionService()
  }

  // Organization Management
  async createOrganization(data: {
    name: string
    domain: string
    plan: Organization['plan']
    adminUser: {
      email: string
      name: string
      password: string
    }
  }): Promise<Organization> {
    const organization = await this.prisma.organization.create({
      data: {
        name: data.name,
        domain: data.domain,
        plan: data.plan,
        status: 'ACTIVE',
        settings: this.getDefaultSettings(data.plan),
        users: {
          create: {
            email: data.adminUser.email,
            name: data.adminUser.name,
            password: await this.encryptionService.hashSensitiveData(data.adminUser.password),
            role: 'ADMIN',
            isActive: true
          }
        }
      }
    })

    // Create default roles for the organization
    await this.createDefaultRoles(organization.id)

    return organization
  }

  async getOrganization(orgId: string): Promise<Organization | null> {
    return await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        users: {
          include: {
            role: true
          }
        },
        roles: true
      }
    })
  }

  async updateOrganization(orgId: string, data: Partial<Organization>): Promise<Organization> {
    return await this.prisma.organization.update({
      where: { id: orgId },
      data
    })
  }

  // User Management within Organizations
  async addUserToOrganization(
    orgId: string,
    userData: {
      email: string
      name: string
      roleId: string
      permissions?: string[]
    }
  ): Promise<any> {
    const organization = await this.getOrganization(orgId)
    if (!organization) {
      throw new Error('Organization not found')
    }

    // Check user limits
    const currentUserCount = organization.users?.length || 0
    if (currentUserCount >= organization.settings.maxUsers) {
      throw new Error('User limit reached for this plan')
    }

    return await this.prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        organizationId: orgId,
        roleId: userData.roleId,
        isActive: true,
        permissions: userData.permissions || []
      }
    })
  }

  async removeUserFromOrganization(orgId: string, userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    })
  }

  // Role Management
  async createRole(orgId: string, roleData: {
    name: string
    permissions: string[]
    description?: string
  }): Promise<UserRole> {
    return await this.prisma.userRole.create({
      data: {
        name: roleData.name,
        permissions: roleData.permissions,
        organizationId: orgId,
        description: roleData.description,
        isSystem: false
      }
    })
  }

  async updateRole(roleId: string, data: Partial<UserRole>): Promise<UserRole> {
    return await this.prisma.userRole.update({
      where: { id: roleId },
      data
    })
  }

  async deleteRole(roleId: string): Promise<void> {
    // Check if role is in use
    const usersWithRole = await this.prisma.user.count({
      where: { roleId }
    })

    if (usersWithRole > 0) {
      throw new Error('Cannot delete role that is assigned to users')
    }

    await this.prisma.userRole.delete({
      where: { id: roleId }
    })
  }

  // Permission Management
  async checkUserPermission(userId: string, permission: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        permissions: true
      }
    })

    if (!user) return false

    // Check role permissions
    if (user.role?.permissions?.includes(permission)) {
      return true
    }

    // Check user-specific permissions
    if (user.permissions?.includes(permission)) {
      return true
    }

    return false
  }

  async grantPermission(userId: string, permission: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        permissions: {
          push: permission
        }
      }
    })
  }

  async revokePermission(userId: string, permission: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (user?.permissions) {
      const updatedPermissions = user.permissions.filter(p => p !== permission)
      await this.prisma.user.update({
        where: { id: userId },
        data: { permissions: updatedPermissions }
      })
    }
  }

  // SSO Integration
  async configureSSO(orgId: string, ssoConfig: {
    provider: 'SAML' | 'OIDC' | 'OAUTH2'
    metadata: any
    enabled: boolean
  }): Promise<void> {
    await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        settings: {
          update: {
            ssoEnabled: ssoConfig.enabled,
            ssoProvider: ssoConfig.provider,
            ssoMetadata: ssoConfig.metadata
          }
        }
      }
    })
  }

  // Data Isolation
  async getOrganizationData(orgId: string, dataType: string, filters: any = {}): Promise<any[]> {
    const baseQuery = {
      where: {
        organizationId: orgId,
        ...filters
      }
    }

    switch (dataType) {
      case 'equipment':
        return await this.prisma.equipment.findMany(baseQuery)
      case 'calibrations':
        return await this.prisma.calibrationRecord.findMany({
          ...baseQuery,
          include: {
            equipment: true,
            technician: true
          }
        })
      case 'users':
        return await this.prisma.user.findMany({
          ...baseQuery,
          include: {
            role: true
          }
        })
      case 'reports':
        return await this.prisma.report.findMany(baseQuery)
      default:
        throw new Error(`Unknown data type: ${dataType}`)
    }
  }

  // Billing and Usage Tracking
  async getOrganizationUsage(orgId: string): Promise<any> {
    const organization = await this.getOrganization(orgId)
    if (!organization) return null

    const [
      userCount,
      equipmentCount,
      calibrationCount,
      aiUsageCount
    ] = await Promise.all([
      this.prisma.user.count({
        where: { organizationId: orgId, isActive: true }
      }),
      this.prisma.equipment.count({
        where: { organizationId: orgId }
      }),
      this.prisma.calibrationRecord.count({
        where: {
          equipment: { organizationId: orgId },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      this.prisma.aiUsage.count({
        where: {
          user: { organizationId: orgId },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return {
      organization,
      usage: {
        users: userCount,
        equipment: equipmentCount,
        calibrations: calibrationCount,
        aiRequests: aiUsageCount
      },
      limits: organization.settings,
      compliance: {
        active: userCount > 0 && equipmentCount > 0,
        lastActivity: await this.getLastActivity(orgId)
      }
    }
  }

  // Compliance and Audit
  async getOrganizationAuditTrail(orgId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return await this.prisma.auditLog.findMany({
      where: {
        user: { organizationId: orgId },
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: true
      },
      orderBy: { timestamp: 'desc' }
    })
  }

  // Private helper methods
  private getDefaultSettings(plan: Organization['plan']) {
    const baseSettings = {
      maxUsers: 10,
      maxEquipment: 100,
      features: ['basic_calibration', 'equipment_management'],
      complianceFrameworks: ['CLIA'],
      customBranding: false,
      ssoEnabled: false
    }

    switch (plan) {
      case 'PROFESSIONAL':
        return {
          ...baseSettings,
          maxUsers: 50,
          maxEquipment: 500,
          features: [...baseSettings.features, 'advanced_analytics', 'ai_compliance'],
          complianceFrameworks: ['CLIA', 'CAP', 'HIPAA']
        }
      case 'ENTERPRISE':
        return {
          ...baseSettings,
          maxUsers: 1000,
          maxEquipment: 10000,
          features: [...baseSettings.features, 'advanced_analytics', 'ai_compliance', 'custom_integrations', 'white_label'],
          complianceFrameworks: ['CLIA', 'CAP', 'HIPAA', 'SOC2'],
          customBranding: true,
          ssoEnabled: true
        }
      default:
        return baseSettings
    }
  }

  private async createDefaultRoles(orgId: string): Promise<void> {
    const defaultRoles = [
      {
        name: 'Admin',
        permissions: ['*'],
        description: 'Full access to all features'
      },
      {
        name: 'Manager',
        permissions: [
          'equipment:read',
          'equipment:write',
          'calibration:read',
          'calibration:write',
          'reports:read',
          'users:read'
        ],
        description: 'Manage equipment and calibrations'
      },
      {
        name: 'Technician',
        permissions: [
          'equipment:read',
          'calibration:read',
          'calibration:write'
        ],
        description: 'Perform calibrations and maintenance'
      },
      {
        name: 'Viewer',
        permissions: [
          'equipment:read',
          'calibration:read',
          'reports:read'
        ],
        description: 'View-only access'
      }
    ]

    for (const role of defaultRoles) {
      await this.createRole(orgId, role)
    }
  }

  private async getLastActivity(orgId: string): Promise<Date | null> {
    const lastActivity = await this.prisma.auditLog.findFirst({
      where: {
        user: { organizationId: orgId }
      },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true }
    })

    return lastActivity?.timestamp || null
  }
} 