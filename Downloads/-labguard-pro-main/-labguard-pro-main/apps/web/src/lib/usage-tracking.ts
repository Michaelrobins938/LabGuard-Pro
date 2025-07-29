import { apiService } from './api-service'

export interface UsageMetrics {
  equipment: {
    used: number
    limit: number
    percentage: number
  }
  aiChecks: {
    used: number
    limit: number
    percentage: number
  }
  teamMembers: {
    used: number
    limit: number
    percentage: number
  }
  storage: {
    used: number
    limit: number
    percentage: number
  }
  apiCalls: {
    used: number
    limit: number
    percentage: number
  }
  reports: {
    used: number
    limit: number
    percentage: number
  }
}

export interface UsageEvent {
  type: 'equipment_added' | 'equipment_removed' | 'ai_check_performed' | 'team_member_added' | 'team_member_removed' | 'storage_used' | 'api_call_made' | 'report_generated'
  value: number
  metadata?: Record<string, any>
  timestamp: Date
}

class UsageTrackingService {
  private static instance: UsageTrackingService
  private eventQueue: UsageEvent[] = []
  private isProcessing = false
  private flushInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.startPeriodicFlush()
  }

  static getInstance(): UsageTrackingService {
    if (!UsageTrackingService.instance) {
      UsageTrackingService.instance = new UsageTrackingService()
    }
    return UsageTrackingService.instance
  }

  /**
   * Track a usage event
   */
  trackEvent(event: Omit<UsageEvent, 'timestamp'>): void {
    const fullEvent: UsageEvent = {
      ...event,
      timestamp: new Date()
    }

    this.eventQueue.push(fullEvent)
    this.checkQueueSize()
  }

  /**
   * Track equipment usage
   */
  trackEquipmentChange(change: 'added' | 'removed', equipmentId: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: change === 'added' ? 'equipment_added' : 'equipment_removed',
      value: 1,
      metadata: {
        equipmentId,
        ...metadata
      }
    })
  }

  /**
   * Track AI compliance check
   */
  trackAICheck(checkType: string, complexity: 'low' | 'medium' | 'high', metadata?: Record<string, any>): void {
    const complexityMultiplier = {
      low: 1,
      medium: 2,
      high: 3
    }

    this.trackEvent({
      type: 'ai_check_performed',
      value: complexityMultiplier[complexity],
      metadata: {
        checkType,
        complexity,
        ...metadata
      }
    })
  }

  /**
   * Track team member changes
   */
  trackTeamMemberChange(change: 'added' | 'removed', userId: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: change === 'added' ? 'team_member_added' : 'team_member_removed',
      value: 1,
      metadata: {
        userId,
        ...metadata
      }
    })
  }

  /**
   * Track storage usage
   */
  trackStorageUsage(bytes: number, fileType: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'storage_used',
      value: bytes,
      metadata: {
        fileType,
        ...metadata
      }
    })
  }

  /**
   * Track API call
   */
  trackAPICall(endpoint: string, method: string, responseTime: number, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'api_call_made',
      value: 1,
      metadata: {
        endpoint,
        method,
        responseTime,
        ...metadata
      }
    })
  }

  /**
   * Track report generation
   */
  trackReportGeneration(reportType: string, complexity: 'basic' | 'standard' | 'advanced', metadata?: Record<string, any>): void {
    const complexityMultiplier = {
      basic: 1,
      standard: 2,
      advanced: 3
    }

    this.trackEvent({
      type: 'report_generated',
      value: complexityMultiplier[complexity],
      metadata: {
        reportType,
        complexity,
        ...metadata
      }
    })
  }

  /**
   * Get current usage metrics
   */
  async getCurrentUsage(): Promise<UsageMetrics> {
    try {
      const response = await apiService.billing.getUsage()
      return response.usage
    } catch (error) {
      console.error('Failed to get current usage:', error)
      throw error
    }
  }

  /**
   * Get usage history for a specific period
   */
  async getUsageHistory(startDate: Date, endDate: Date): Promise<UsageEvent[]> {
    try {
      const response = await apiService.billing.getUsageHistory({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      return response.events
    } catch (error) {
      console.error('Failed to get usage history:', error)
      throw error
    }
  }

  /**
   * Check if usage is approaching limits
   */
  async checkUsageLimits(): Promise<{
    warnings: string[]
    critical: string[]
  }> {
    try {
      const usage = await this.getCurrentUsage()
      const warnings: string[] = []
      const critical: string[] = []

      // Check each metric
      Object.entries(usage).forEach(([key, metric]) => {
        if (metric.limit === -1) return // Unlimited

        const percentage = metric.percentage

        if (percentage >= 90) {
          critical.push(`${key} usage is at ${percentage}% of limit`)
        } else if (percentage >= 75) {
          warnings.push(`${key} usage is at ${percentage}% of limit`)
        }
      })

      return { warnings, critical }
    } catch (error) {
      console.error('Failed to check usage limits:', error)
      throw error
    }
  }

  /**
   * Get usage analytics
   */
  async getUsageAnalytics(period: '7d' | '30d' | '90d'): Promise<{
    totalEvents: number
    eventBreakdown: Record<string, number>
    trends: Record<string, number>
    topUsers: Array<{ userId: string; usage: number }>
  }> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      const events = await this.getUsageHistory(startDate, endDate)
      
      // Process events
      const eventBreakdown: Record<string, number> = {}
      const userUsage: Record<string, number> = {}
      
      events.forEach(event => {
        eventBreakdown[event.type] = (eventBreakdown[event.type] || 0) + event.value
        
        if (event.metadata?.userId) {
          userUsage[event.metadata.userId] = (userUsage[event.metadata.userId] || 0) + event.value
        }
      })

      // Calculate trends (simplified)
      const trends: Record<string, number> = {}
      Object.keys(eventBreakdown).forEach(key => {
        trends[key] = Math.round((eventBreakdown[key] / events.length) * 100)
      })

      // Get top users
      const topUsers = Object.entries(userUsage)
        .map(([userId, usage]) => ({ userId, usage }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 10)

      return {
        totalEvents: events.length,
        eventBreakdown,
        trends,
        topUsers
      }
    } catch (error) {
      console.error('Failed to get usage analytics:', error)
      throw error
    }
  }

  /**
   * Flush events to the server
   */
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0 || this.isProcessing) {
      return
    }

    this.isProcessing = true

    try {
      const eventsToSend = [...this.eventQueue]
      this.eventQueue = []

      await apiService.billing.trackUsageEvents(eventsToSend)
      
      console.log(`Flushed ${eventsToSend.length} usage events`)
    } catch (error) {
      console.error('Failed to flush usage events:', error)
      // Re-add events to queue for retry
      this.eventQueue.unshift(...this.eventQueue)
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Check queue size and flush if needed
   */
  private checkQueueSize(): void {
    if (this.eventQueue.length >= 10) {
      this.flushEvents()
    }
  }

  /**
   * Start periodic flush
   */
  private startPeriodicFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushEvents()
    }, 30000) // Flush every 30 seconds
  }

  /**
   * Stop the service
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushEvents() // Final flush
  }
}

// Export singleton instance
export const usageTracking = UsageTrackingService.getInstance()

// Export convenience functions
export const trackEquipmentChange = (change: 'added' | 'removed', equipmentId: string, metadata?: Record<string, any>) => {
  usageTracking.trackEquipmentChange(change, equipmentId, metadata)
}

export const trackAICheck = (checkType: string, complexity: 'low' | 'medium' | 'high', metadata?: Record<string, any>) => {
  usageTracking.trackAICheck(checkType, complexity, metadata)
}

export const trackTeamMemberChange = (change: 'added' | 'removed', userId: string, metadata?: Record<string, any>) => {
  usageTracking.trackTeamMemberChange(change, userId, metadata)
}

export const trackStorageUsage = (bytes: number, fileType: string, metadata?: Record<string, any>) => {
  usageTracking.trackStorageUsage(bytes, fileType, metadata)
}

export const trackAPICall = (endpoint: string, method: string, responseTime: number, metadata?: Record<string, any>) => {
  usageTracking.trackAPICall(endpoint, method, responseTime, metadata)
}

export const trackReportGeneration = (reportType: string, complexity: 'basic' | 'standard' | 'advanced', metadata?: Record<string, any>) => {
  usageTracking.trackReportGeneration(reportType, complexity, metadata)
}