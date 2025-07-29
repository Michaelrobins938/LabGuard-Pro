import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Validation schemas
const createSubscriptionSchema = z.object({
  planId: z.string().cuid(),
  paymentMethodId: z.string(),
  trialDays: z.number().optional()
})

const updateSubscriptionSchema = z.object({
  planId: z.string().cuid().optional(),
  cancelAtPeriodEnd: z.boolean().optional()
})

export class BillingController {
  /**
   * Create a new subscription
   */
  async createSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const validatedData = createSubscriptionSchema.parse(req.body)

      // Get the plan details
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: validatedData.planId }
      })

      if (!plan) {
        throw new ApiError(404, 'Plan not found')
      }

      // Check if laboratory already has a subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: { laboratoryId: laboratoryId }
      })

      if (existingSubscription) {
        throw new ApiError(400, 'Laboratory already has a subscription')
      }

      // Create Stripe customer if not exists
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId }
      })

      const customer = await stripe.customers.create({
        email: laboratory?.email || 'admin@labguard.com',
        metadata: {
          laboratoryId: laboratoryId
        }
      })

      const stripeCustomerId = customer.id

      // Create Stripe subscription
      const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: plan.stripeId! }],
        trial_period_days: validatedData.trialDays,
        metadata: {
          laboratoryId: laboratoryId,
          planId: validatedData.planId
        }
      })

      // Create subscription in database
      const subscription = await prisma.subscription.create({
        data: {
          laboratoryId: laboratoryId,
          planId: validatedData.planId,
          stripeId: stripeSubscription.id,
          stripeCustomerId: stripeCustomerId,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
          trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null
        },
        include: {
          plan: true,
          laboratory: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      logger.info('Subscription created', {
        subscriptionId: subscription.id,
        laboratoryId: laboratoryId,
        planId: validatedData.planId
      })

      res.status(201).json({
        message: 'Subscription created successfully',
        subscription
      })
    } catch (error) {
      logger.error('Failed to create subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to create subscription')
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validatedData = updateSubscriptionSchema.parse(req.body)

      const subscription = await prisma.subscription.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId
        },
        include: {
          plan: true
        }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      // Update plan if requested
      if (validatedData.planId && validatedData.planId !== subscription.planId) {
        const newPlan = await prisma.subscriptionPlan.findUnique({
          where: { id: validatedData.planId }
        })

        if (!newPlan) {
          throw new ApiError(404, 'Plan not found')
        }

        // Update Stripe subscription
        await stripe.subscriptions.update(subscription.stripeId!, {
          items: [{ id: subscription.stripeId!, price: newPlan.stripeId! }]
        })
      }

      // Update subscription in database
      const updatedSubscription = await prisma.subscription.update({
        where: { id: id },
        data: {
          planId: validatedData.planId,
          cancelAtPeriodEnd: validatedData.cancelAtPeriodEnd
        },
        include: {
          plan: true,
          laboratory: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      logger.info('Subscription updated', {
        subscriptionId: id,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Subscription updated successfully',
        subscription: updatedSubscription
      })
    } catch (error) {
      logger.error('Failed to update subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to update subscription')
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any

      const subscription = await prisma.subscription.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId
        }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      // Cancel in Stripe
      await stripe.subscriptions.update(subscription.stripeId!, {
        cancel_at_period_end: true
      })

      // Update in database
      const updatedSubscription = await prisma.subscription.update({
        where: { id: id },
        data: {
          cancelAtPeriodEnd: true
        },
        include: {
          plan: true,
          laboratory: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      logger.info('Subscription cancelled', {
        subscriptionId: id,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Subscription cancelled successfully',
        subscription: updatedSubscription
      })
    } catch (error) {
      logger.error('Failed to cancel subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to cancel subscription')
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any

      const subscription = await prisma.subscription.findUnique({
        where: { laboratoryId: laboratoryId },
        include: {
          plan: true,
          laboratory: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      res.json(subscription)
    } catch (error) {
      logger.error('Failed to get subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get subscription')
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { period = 'month' } = req.query

      const startDate = this.getStartDate(period as string)
      
      const [usageLogs, equipmentCount] = await Promise.all([
        prisma.usageLog.findMany({
          where: {
            user: { laboratoryId: laboratoryId },
            createdAt: { gte: startDate }
          },
          select: {
            action: true,
            quantity: true,
            cost: true,
            createdAt: true
          }
        }),
        prisma.equipment.count({
          where: { laboratoryId: laboratoryId }
        })
      ])

      const stats = {
        totalComplianceChecks: usageLogs.filter(log => log.action === 'compliance_check').length,
        totalTokensUsed: usageLogs.reduce((sum, log) => sum + (log.quantity || 0), 0),
        totalCost: usageLogs.reduce((sum, log) => sum + (log.cost || 0), 0),
        equipmentCount,
        period
      }

      res.json(stats)

    } catch (error) {
      logger.error('Failed to get usage stats:', error)
      throw new ApiError(500, 'Failed to get usage statistics')
    }
  }

  /**
   * Get invoices
   */
  async getInvoices(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any

      const subscription = await prisma.subscription.findUnique({
        where: { laboratoryId: laboratoryId }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      const invoices = await stripe.invoices.list({
        customer: subscription.stripeCustomerId!,
        limit: 10
      })

      res.json(invoices.data)
    } catch (error) {
      logger.error('Failed to get invoices:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get invoices')
    }
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any

      const subscription = await prisma.subscription.findUnique({
        where: { laboratoryId: laboratoryId }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: subscription.stripeCustomerId!,
        type: 'card'
      })

      res.json(paymentMethods.data)
    } catch (error) {
      logger.error('Failed to get payment methods:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get payment methods')
    }
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { paymentMethodId } = req.body

      const subscription = await prisma.subscription.findUnique({
        where: { laboratoryId: laboratoryId }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: subscription.stripeCustomerId!
      })

      // Set as default payment method
      await stripe.customers.update(subscription.stripeCustomerId!, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

      res.json({ message: 'Payment method added successfully' })
    } catch (error) {
      logger.error('Failed to add payment method:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to add payment method')
    }
  }

  /**
   * Get usage
   */
  async getUsage(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { period = 'month' } = req.query

      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }

      const usage = await prisma.usageLog.groupBy({
        by: ['action'],
        where: {
          laboratoryId: laboratoryId,
          createdAt: {
            gte: startDate
          }
        },
        _sum: {
          quantity: true,
          cost: true
        },
        _count: true
      })

      res.json({
        period,
        totalTokens: usage.reduce((sum: number, record: any) => sum + (record._sum.quantity || 0), 0),
        totalCost: usage.reduce((sum: number, record: any) => sum + (record._sum.cost || 0), 0),
        totalRequests: usage.reduce((sum: number, record: any) => sum + record._count, 0),
        breakdown: usage
      })
    } catch (error) {
      logger.error('Failed to get usage:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get usage')
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'] as string
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

      let event: Stripe.Event

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
      } catch (err) {
        logger.error('Webhook signature verification failed:', err)
        return res.status(400).json({ error: 'Invalid signature' })
      }

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionEvent(event.data.object as Stripe.Subscription)
          break
        case 'invoice.payment_succeeded':
          await this.handleInvoiceEvent(event.data.object as Stripe.Invoice)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailedEvent(event.data.object as Stripe.Invoice)
          break
        default:
          logger.info(`Unhandled event type: ${event.type}`)
      }

      return res.json({ received: true })
    } catch (error) {
      logger.error('Webhook handler error:', error)
      return res.status(500).json({ error: 'Webhook handler failed' })
    }
  }

  private async handleSubscriptionEvent(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeId: subscription.id },
      data: {
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })
  }

  private async handleInvoiceEvent(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await prisma.subscription.findFirst({
        where: { stripeId: invoice.subscription as string }
      })

      if (subscription) {
        // Handle successful payment
        logger.info('Invoice payment succeeded', {
          invoiceId: invoice.id,
          subscriptionId: subscription.id,
          amount: invoice.amount_paid
        })
      }
    }
  }

  private async handlePaymentFailedEvent(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await prisma.subscription.findFirst({
        where: { stripeId: invoice.subscription as string }
      })

      if (subscription) {
        // Handle failed payment
        logger.warn('Invoice payment failed', {
          invoiceId: invoice.id,
          subscriptionId: subscription.id,
          amount: invoice.amount_due
        })
      }
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await prisma.subscription.findFirst({
        where: { stripeId: invoice.subscription as string }
      })

      if (subscription) {
        // Update subscription status
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'PAST_DUE'
          }
        })

        logger.warn('Payment failed for subscription', {
          subscriptionId: subscription.id,
          invoiceId: invoice.id
        })
      }
    }
  }

  private getStartDate(period: string): Date {
    const now = new Date()
    switch (period) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      case 'year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }
}

export const billingController = new BillingController() 