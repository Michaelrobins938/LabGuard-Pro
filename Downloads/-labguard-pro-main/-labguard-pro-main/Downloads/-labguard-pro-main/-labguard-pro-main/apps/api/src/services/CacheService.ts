import Redis from 'ioredis'
import { PrismaClient } from '@labguard/database'

export class CacheService {
  private redis: Redis
  private prisma: PrismaClient

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
    this.prisma = new PrismaClient()
  }

  // Cache equipment data with automatic invalidation
  async getEquipmentWithCache(equipmentId: string): Promise<any> {
    const cacheKey = `equipment:${equipmentId}`
    
    try {
      // Try cache first
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      // Fallback to database
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: equipmentId },
        include: {
          calibrationRecords: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          },
          maintenanceRecords: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (equipment) {
        // Cache for 1 hour
        await this.redis.setex(cacheKey, 3600, JSON.stringify(equipment))
      }
      
      return equipment
    } catch (error) {
      console.error('Cache error:', error)
      // Fallback to database only
      return await this.prisma.equipment.findUnique({
        where: { id: equipmentId },
        include: {
          calibrationRecords: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    }
  }

  // Cache dashboard statistics
  async getDashboardStatsWithCache(labId: string): Promise<any> {
    const cacheKey = `dashboard:stats:${labId}`
    
    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const stats = await this.calculateDashboardStats(labId)
      
      // Cache for 5 minutes (frequent updates needed)
      await this.redis.setex(cacheKey, 300, JSON.stringify(stats))
      
      return stats
    } catch (error) {
      console.error('Dashboard stats cache error:', error)
      return await this.calculateDashboardStats(labId)
    }
  }

  // Cache calibration data
  async getCalibrationsWithCache(labId: string, filters: any = {}): Promise<any[]> {
    const cacheKey = `calibrations:${labId}:${JSON.stringify(filters)}`
    
    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const calibrations = await this.prisma.calibrationRecord.findMany({
        where: {
          equipment: {
            laboratoryId: labId
          },
          ...filters
        },
        include: {
          equipment: true,
          technician: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

      // Cache for 10 minutes
      await this.redis.setex(cacheKey, 600, JSON.stringify(calibrations))
      
      return calibrations
    } catch (error) {
      console.error('Calibrations cache error:', error)
      return await this.prisma.calibrationRecord.findMany({
        where: {
          equipment: {
            laboratoryId: labId
          },
          ...filters
        },
        include: {
          equipment: true,
          technician: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    }
  }

  // Cache user permissions and roles
  async getUserPermissionsWithCache(userId: string): Promise<any> {
    const cacheKey = `user:permissions:${userId}`
    
    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: true,
          permissions: true
        }
      })

      if (user) {
        // Cache for 30 minutes
        await this.redis.setex(cacheKey, 1800, JSON.stringify(user))
      }
      
      return user
    } catch (error) {
      console.error('User permissions cache error:', error)
      return await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: true,
          permissions: true
        }
      })
    }
  }

  // Cache AI responses for common queries
  async getAIResponseWithCache(query: string, context: any): Promise<any> {
    const cacheKey = `ai:response:${this.hashQuery(query, context)}`
    
    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      // This would be replaced with actual AI service call
      const response = await this.generateAIResponse(query, context)
      
      // Cache for 1 hour
      await this.redis.setex(cacheKey, 3600, JSON.stringify(response))
      
      return response
    } catch (error) {
      console.error('AI response cache error:', error)
      return await this.generateAIResponse(query, context)
    }
  }

  // Invalidate cache when data changes
  async invalidateEquipmentCache(equipmentId: string): Promise<void> {
    try {
      await this.redis.del(`equipment:${equipmentId}`)
      
      // Also invalidate related caches
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: equipmentId }
      })
      
      if (equipment) {
        await this.redis.del(`dashboard:stats:${equipment.laboratoryId}`)
        await this.redis.del(`calibrations:${equipment.laboratoryId}:*`)
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      await this.redis.del(`user:permissions:${userId}`)
    } catch (error) {
      console.error('User cache invalidation error:', error)
    }
  }

  async invalidateLabCache(labId: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`*:${labId}:*`)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Lab cache invalidation error:', error)
    }
  }

  // Background job for cache warming
  async warmCache(): Promise<void> {
    try {
      console.log('🔥 Starting cache warming...')
      
      // Warm equipment cache
      const activeEquipment = await this.prisma.equipment.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true }
      })

      for (const equipment of activeEquipment) {
        await this.getEquipmentWithCache(equipment.id)
      }

      // Warm dashboard stats
      const laboratories = await this.prisma.laboratory.findMany({
        select: { id: true }
      })

      for (const lab of laboratories) {
        await this.getDashboardStatsWithCache(lab.id)
      }

      console.log('✅ Cache warming completed')
    } catch (error) {
      console.error('Cache warming error:', error)
    }
  }

  // Cache performance monitoring
  async getCacheStats(): Promise<any> {
    try {
      const info = await this.redis.info()
      const keys = await this.redis.dbsize()
      
      return {
        keys,
        memory: info.match(/used_memory_human:(.+)/)?.[1] || 'unknown',
        hitRate: await this.calculateHitRate(),
        lastWarmed: await this.redis.get('cache:last_warmed')
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return { error: 'Unable to get cache stats' }
    }
  }

  // Clear all cache (for maintenance)
  async clearAllCache(): Promise<void> {
    try {
      await this.redis.flushall()
      console.log('🗑️ All cache cleared')
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  // Private helper methods
  private async calculateDashboardStats(labId: string): Promise<any> {
    const [
      totalEquipment,
      activeEquipment,
      overdueCalibrations,
      completedThisMonth
    ] = await Promise.all([
      this.prisma.equipment.count({
        where: { laboratoryId: labId }
      }),
      this.prisma.equipment.count({
        where: { 
          laboratoryId: labId,
          status: 'ACTIVE'
        }
      }),
      this.prisma.calibrationRecord.count({
        where: {
          equipment: { laboratoryId: labId },
          dueDate: { lt: new Date() },
          status: 'PENDING'
        }
      }),
      this.prisma.calibrationRecord.count({
        where: {
          equipment: { laboratoryId: labId },
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return {
      totalEquipment,
      activeEquipment,
      overdueCalibrations,
      completedThisMonth,
      complianceRate: totalEquipment > 0 ? (activeEquipment / totalEquipment) * 100 : 0
    }
  }

  private async generateAIResponse(query: string, context: any): Promise<any> {
    // Mock AI response - replace with actual AI service
    return {
      response: `AI response for: ${query}`,
      confidence: 0.95,
      sources: ['calibration_manual', 'compliance_guidelines'],
      timestamp: new Date().toISOString()
    }
  }

  private hashQuery(query: string, context: any): string {
    const crypto = require('crypto')
    const data = query + JSON.stringify(context)
    return crypto.createHash('md5').update(data).digest('hex')
  }

  private async calculateHitRate(): Promise<number> {
    try {
      const info = await this.redis.info('stats')
      const hits = parseInt(info.match(/keyspace_hits:(\d+)/)?.[1] || '0')
      const misses = parseInt(info.match(/keyspace_misses:(\d+)/)?.[1] || '0')
      
      return hits + misses > 0 ? (hits / (hits + misses)) * 100 : 0
    } catch (error) {
      return 0
    }
  }
} 