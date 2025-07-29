import Stripe from 'stripe'
import { PrismaClient } from '@labguard/database'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: {
    complianceChecks: number
    equipmentItems: number
    aiFeatures: boolean
    advancedReporting: boolean
    customIntegrations: boolean
    prioritySupport: boolean
  }
  stripePriceId: string
}

export interface UsageMetrics {
  complianceChecks: number
  equipmentItems: number
  aiQueries: number
  storageUsed: number
  apiCalls: number
}

export interface BillingEvent {
  id: string
  type: 'subscription_created' | 'subscription_updated' | 'payment_succeeded' | 'payment_failed' | 'usage_recorded'
  userId: string
  laboratoryId: string
  amount?: number
  currency?: string
  metadata?: Record<string, any>
  timestamp: Date
}

export class BillingService {
  private static readonly PLANS: Record<string, SubscriptionPlan> = {
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 299,
      interval: 'month',
      features: {
        complianceChecks: 100,
        equipmentItems: 10,
        aiFeatures: true,
        advancedReporting: false,
        customIntegrations: false,
        prioritySupport: false
      },
      stripePriceId: process.env.STRIPE_STARTER_PRICE_ID!
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      price: 599,
      interval: 'month',
      features: {
        complianceChecks: 500,
        equipmentItems: 50,
        aiFeatures: true,
        advancedReporting: true,
        customIntegrations: false,
        prioritySupport: false
      },
      stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 1299,
      interval: 'month',
      features: {
        complianceChecks: -1, // Unlimited
        equipmentItems: -1, // Unlimited
        aiFeatures: true,
        advancedReporting: true,
        customIntegrations: true,
        prioritySupport: true
      },
      stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!
    }
  }

  /**
   * Create a new subscription for a laboratory
   */
  async createSubscription(laboratoryId: string, planId: string, customerEmail: string): Promise<Stripe.Subscription> {
    try {
      const plan = BillingService.PLANS[planId]
      if (!plan) {
        throw new Error(`Invalid plan ID: ${planId}`)
      }

      // Create or get Stripe customer
      const customer = await this.getOrCreateCustomer(laboratoryId, customerEmail)

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          laboratoryId,
          planId
        }
      })

      // Update laboratory subscription in database
      await prisma.laboratory.update({
        where: { id: laboratoryId },
        data: {
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          currentPlanId: planId,
          subscriptionStatus: subscription.status,
          trialEndsAt: null
        }
      })

      // Log billing event
      await this.logBillingEvent({
        id: `evt_${Date.now()}`,
        type: 'subscription_created',
        userId: customerEmail,
        laboratoryId,
        amount: plan.price,
        currency: 'usd',
        metadata: { planId, subscriptionId: subscription.id },
        timestamp: new Date()
      })

      logger.info(`Created subscription for laboratory ${laboratoryId}: ${subscription.id}`)
      return subscription
    } catch (error) {
      logger.error(`Failed to create subscription for laboratory ${laboratoryId}:`, error)
      throw error
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(laboratoryId: string, newPlanId: string): Promise<Stripe.Subscription> {
    try {
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        select: { stripeSubscriptionId: true, currentPlanId: true }
      })

      if (!laboratory?.stripeSubscriptionId) {
        throw new Error('No active subscription found')
      }

      const newPlan = BillingService.PLANS[newPlanId]
      if (!newPlan) {
        throw new Error(`Invalid plan ID: ${newPlanId}`)
      }

      // Update subscription in Stripe
      const subscription = await stripe.subscriptions.retrieve(laboratory.stripeSubscriptionId)
      const updatedSubscription = await stripe.subscriptions.update(laboratory.stripeSubscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPlan.stripePriceId
        }],
        proration_behavior: 'create_prorations'
      })

      // Update database
      await prisma.laboratory.update({
        where: { id: laboratoryId },
        data: {
          currentPlanId: newPlanId,
          subscriptionStatus: updatedSubscription.status
        }
      })

      // Log billing event
      await this.logBillingEvent({
        id: `evt_${Date.now()}`,
        type: 'subscription_updated',
        userId: 'system',
        laboratoryId,
        metadata: { 
          oldPlanId: laboratory.currentPlanId, 
          newPlanId, 
          subscriptionId: updatedSubscription.id 
        },
        timestamp: new Date()
      })

      logger.info(`Updated subscription for laboratory ${laboratoryId} to plan ${newPlanId}`)
      return updatedSubscription
    } catch (error) {
      logger.error(`Failed to update subscription for laboratory ${laboratoryId}:`, error)
      throw error
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(laboratoryId: string, cancelAtPeriodEnd: boolean = true): Promise<Stripe.Subscription> {
    try {
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        select: { stripeSubscriptionId: true }
      })

      if (!laboratory?.stripeSubscriptionId) {
        throw new Error('No active subscription found')
      }

      const subscription = await stripe.subscriptions.update(laboratory.stripeSubscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      })

      // Update database
      await prisma.laboratory.update({
        where: { id: laboratoryId },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionEndsAt: cancelAtPeriodEnd ? new Date(subscription.current_period_end * 1000) : null
        }
      })

      logger.info(`Cancelled subscription for laboratory ${laboratoryId}`)
      return subscription
    } catch (error) {
      logger.error(`Failed to cancel subscription for laboratory ${laboratoryId}:`, error)
      throw error
    }
  }

  /**
   * Record usage for billing
   */
  async recordUsage(laboratoryId: string, usageType: keyof UsageMetrics, quantity: number = 1): Promise<void> {
    try {
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        select: { 
          stripeCustomerId: true, 
          currentPlanId: true,
          stripeSubscriptionId: true 
        }
      })

      if (!laboratory?.stripeCustomerId || !laboratory.stripeSubscriptionId) {
        throw new Error('No active subscription found')
      }

      const plan = BillingService.PLANS[laboratory.currentPlanId!]
      if (!plan) {
        throw new Error('Invalid plan configuration')
      }

      // Check usage limits
      const currentUsage = await this.getCurrentUsage(laboratoryId)
      const limit = plan.features[usageType as keyof typeof plan.features]
      
      if (typeof limit === 'number' && limit !== -1 && currentUsage[usageType] + quantity > limit) {
        throw new Error(`Usage limit exceeded for ${usageType}`)
      }

      // Record usage in Stripe (for metered billing)
      if (usageType === 'complianceChecks' || usageType === 'aiQueries') {
        await stripe.subscriptionItems.createUsageRecord(
          laboratory.stripeSubscriptionId,
          {
            quantity,
            timestamp: Math.floor(Date.now() / 1000),
            action: 'increment'
          }
        )
      }

      // Update usage in database
      await prisma.usageRecord.create({
        data: {
          laboratoryId,
          type: usageType,
          quantity,
          recordedAt: new Date()
        }
      })

      logger.info(`Recorded usage for laboratory ${laboratoryId}: ${usageType} +${quantity}`)
    } catch (error) {
      logger.error(`Failed to record usage for laboratory ${laboratoryId}:`, error)
      throw error
    }
  }

  /**
   * Get current usage for a laboratory
   */
  async getCurrentUsage(laboratoryId: string): Promise<UsageMetrics> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const usage = await prisma.usageRecord.groupBy({
      by: ['type'],
      where: {
        laboratoryId,
        recordedAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        quantity: true
      }
    })

    const usageMap = usage.reduce((acc: Partial<UsageMetrics>, record: any) => {
      acc[record.type as keyof UsageMetrics] = record._sum.quantity || 0
      return acc
    }, {} as Partial<UsageMetrics>)

    return {
      complianceChecks: usageMap.complianceChecks || 0,
      equipmentItems: usageMap.equipmentItems || 0,
      aiQueries: usageMap.aiQueries || 0,
      storageUsed: usageMap.storageUsed || 0,
      apiCalls: usageMap.apiCalls || 0
    }
  }

  /**
   * Generate invoice for a laboratory
   */
  async generateInvoice(laboratoryId: string, periodStart: Date, periodEnd: Date): Promise<Stripe.Invoice> {
    try {
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        select: { stripeCustomerId: true, currentPlanId: true }
      })

      if (!laboratory?.stripeCustomerId) {
        throw new Error('No customer found for laboratory')
      }

      const plan = BillingService.PLANS[laboratory.currentPlanId!]
      if (!plan) {
        throw new Error('Invalid plan configuration')
      }

      // Create invoice
      const invoice = await stripe.invoices.create({
        customer: laboratory.stripeCustomerId,
        collection_method: 'charge_automatically',
        metadata: {
          laboratoryId,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString()
        }
      })

      // Add invoice items
      await stripe.invoiceItems.create({
        customer: laboratory.stripeCustomerId,
        invoice: invoice.id,
        amount: plan.price * 100, // Convert to cents
        currency: 'usd',
        description: `${plan.name} Plan - ${periodStart.toLocaleDateString()} to ${periodEnd.toLocaleDateString()}`
      })

      // Finalize and send invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
      await stripe.invoices.sendInvoice(finalizedInvoice.id)

      logger.info(`Generated invoice for laboratory ${laboratoryId}: ${finalizedInvoice.id}`)
      return finalizedInvoice
    } catch (error) {
      logger.error(`Failed to generate invoice for laboratory ${laboratoryId}:`, error)
      throw error
    }
  }

  /**
   * Get all available plans
   */
  getPlans(): SubscriptionPlan[] {
    return Object.values(BillingService.PLANS)
  }

  /**
   * Get plan by ID
   */
  getPlan(planId: string): SubscriptionPlan | null {
    return BillingService.PLANS[planId] || null
  }

  /**
   * Get or create Stripe customer
   */
  private async getOrCreateCustomer(laboratoryId: string, email: string): Promise<Stripe.Customer> {
    const laboratory = await prisma.laboratory.findUnique({
      where: { id: laboratoryId },
      select: { stripeCustomerId: true }
    })

    if (laboratory?.stripeCustomerId) {
      return stripe.customers.retrieve(laboratory.stripeCustomerId) as Promise<Stripe.Customer>
    }

    const customer = await stripe.customers.create({
      email,
      metadata: {
        laboratoryId
      }
    })

    await prisma.laboratory.update({
      where: { id: laboratoryId },
      data: { stripeCustomerId: customer.id }
    })

    return customer
  }

  /**
   * Log billing events for audit trail
   */
  private async logBillingEvent(event: BillingEvent): Promise<void> {
    await prisma.billingEvent.create({
      data: {
        id: event.id,
        type: event.type,
        userId: event.userId,
        laboratoryId: event.laboratoryId,
        amount: event.amount,
        currency: event.currency,
        metadata: event.metadata,
        timestamp: event.timestamp
      }
    })
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break
        default:
          logger.info(`Unhandled webhook event: ${event.type}`)
      }
    } catch (error) {
      logger.error(`Error handling webhook ${event.type}:`, error)
      throw error
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const laboratoryId = invoice.metadata?.laboratoryId
    if (!laboratoryId) return

    await prisma.laboratory.update({
      where: { id: laboratoryId },
      data: { 
        subscriptionStatus: 'active',
        lastPaymentAt: new Date()
      }
    })

    await this.logBillingEvent({
      id: `evt_${Date.now()}`,
      type: 'payment_succeeded',
      userId: 'system',
      laboratoryId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      metadata: { invoiceId: invoice.id },
      timestamp: new Date()
    })
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const laboratoryId = invoice.metadata?.laboratoryId
    if (!laboratoryId) return

    await prisma.laboratory.update({
      where: { id: laboratoryId },
      data: { subscriptionStatus: 'past_due' }
    })

    await this.logBillingEvent({
      id: `evt_${Date.now()}`,
      type: 'payment_failed',
      userId: 'system',
      laboratoryId,
      amount: invoice.amount_due,
      currency: invoice.currency,
      metadata: { invoiceId: invoice.id },
      timestamp: new Date()
    })
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const laboratoryId = subscription.metadata?.laboratoryId
    if (!laboratoryId) return

    await prisma.laboratory.update({
      where: { id: laboratoryId },
      data: { 
        subscriptionStatus: subscription.status,
        subscriptionEndsAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null
      }
    })
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const laboratoryId = subscription.metadata?.laboratoryId
    if (!laboratoryId) return

    await prisma.laboratory.update({
      where: { id: laboratoryId },
      data: { 
        subscriptionStatus: 'cancelled',
        subscriptionEndsAt: new Date()
      }
    })
  }
}

export const billingService = new BillingService() 