import express from 'express'
import { z } from 'zod'
import { billingService } from '../services/BillingService'
import { authMiddleware } from '../middleware/auth.middleware'
import { logger } from '../utils/logger'

const router = express.Router()

// Validation schemas
const createSubscriptionSchema = z.object({
  planId: z.enum(['starter', 'professional', 'enterprise']),
  customerEmail: z.string().email()
})

const updateSubscriptionSchema = z.object({
  planId: z.enum(['starter', 'professional', 'enterprise'])
})

const recordUsageSchema = z.object({
  usageType: z.enum(['complianceChecks', 'equipmentItems', 'aiQueries', 'storageUsed', 'apiCalls']),
  quantity: z.number().positive().default(1)
})

const generateInvoiceSchema = z.object({
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime()
})

/**
 * @route GET /api/billing/plans
 * @desc Get all available subscription plans
 * @access Public
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = billingService.getPlans()
    res.json({
      success: true,
      data: plans
    })
  } catch (error) {
    logger.error('Failed to get plans:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plans'
    })
  }
})

/**
 * @route GET /api/billing/plans/:planId
 * @desc Get specific plan details
 * @access Public
 */
router.get('/plans/:planId', async (req, res) => {
  try {
    const { planId } = req.params
    const plan = billingService.getPlan(planId)
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      })
    }

    res.json({
      success: true,
      data: plan
    })
  } catch (error) {
    logger.error('Failed to get plan:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plan'
    })
  }
})

/**
 * @route POST /api/billing/subscriptions
 * @desc Create a new subscription
 * @access Private
 */
router.post('/subscriptions', authMiddleware, async (req, res) => {
  try {
    const { planId, customerEmail } = createSubscriptionSchema.parse(req.body)
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    const subscription = await billingService.createSubscription(
      laboratoryId,
      planId,
      customerEmail
    )

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
      }
    })
  } catch (error) {
    logger.error('Failed to create subscription:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    })
  }
})

/**
 * @route PUT /api/billing/subscriptions/:laboratoryId
 * @desc Update subscription plan
 * @access Private
 */
router.put('/subscriptions/:laboratoryId', authMiddleware, async (req, res) => {
  try {
    const { laboratoryId } = req.params
    const { planId } = updateSubscriptionSchema.parse(req.body)

    // Verify user has access to this laboratory
    if ((req as any).user?.laboratoryId !== laboratoryId && (req as any).user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    const subscription = await billingService.updateSubscription(laboratoryId, planId)

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        planId
      }
    })
  } catch (error) {
    logger.error('Failed to update subscription:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update subscription'
    })
  }
})

/**
 * @route DELETE /api/billing/subscriptions/:laboratoryId
 * @desc Cancel subscription
 * @access Private
 */
router.delete('/subscriptions/:laboratoryId', authMiddleware, async (req, res) => {
  try {
    const { laboratoryId } = req.params
    const { cancelAtPeriodEnd = true } = req.query

    // Verify user has access to this laboratory
    if ((req as any).user?.laboratoryId !== laboratoryId && (req as any).user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    const subscription = await billingService.cancelSubscription(
      laboratoryId,
      cancelAtPeriodEnd === 'true'
    )

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })
  } catch (error) {
    logger.error('Failed to cancel subscription:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    })
  }
})

/**
 * @route POST /api/billing/usage
 * @desc Record usage for billing
 * @access Private
 */
router.post('/usage', authMiddleware, async (req, res) => {
  try {
    const { usageType, quantity } = recordUsageSchema.parse(req.body)
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    await billingService.recordUsage(laboratoryId, usageType, quantity)

    res.json({
      success: true,
      message: 'Usage recorded successfully'
    })
  } catch (error) {
    logger.error('Failed to record usage:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record usage'
    })
  }
})

/**
 * @route GET /api/billing/usage/:laboratoryId
 * @desc Get current usage for a laboratory
 * @access Private
 */
router.get('/usage/:laboratoryId', authMiddleware, async (req, res) => {
  try {
    const { laboratoryId } = req.params

    // Verify user has access to this laboratory
    if ((req as any).user?.laboratoryId !== laboratoryId && (req as any).user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    const usage = await billingService.getCurrentUsage(laboratoryId)

    res.json({
      success: true,
      data: usage
    })
  } catch (error) {
    logger.error('Failed to get usage:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve usage'
    })
  }
})

/**
 * @route POST /api/billing/invoices
 * @desc Generate invoice for a laboratory
 * @access Private
 */
router.post('/invoices', authMiddleware, async (req, res) => {
  try {
    const { periodStart, periodEnd } = generateInvoiceSchema.parse(req.body)
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    const invoice = await billingService.generateInvoice(
      laboratoryId,
      new Date(periodStart),
      new Date(periodEnd)
    )

    res.json({
      success: true,
      data: {
        invoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status,
        hostedInvoiceUrl: invoice.hosted_invoice_url
      }
    })
  } catch (error) {
    logger.error('Failed to generate invoice:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate invoice'
    })
  }
})

/**
 * @route POST /api/billing/webhooks
 * @desc Handle Stripe webhooks
 * @access Public
 */
router.post('/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!endpointSecret) {
      return res.status(500).json({
        success: false,
        error: 'Webhook secret not configured'
      })
    }

    // Verify webhook signature
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)

    // Handle the webhook
    await billingService.handleWebhook(event)

    res.json({ received: true })
  } catch (error) {
    logger.error('Webhook error:', error)
    res.status(400).json({
      success: false,
      error: 'Webhook signature verification failed'
    })
  }
})

/**
 * @route GET /api/billing/subscription/:laboratoryId
 * @desc Get subscription details for a laboratory
 * @access Private
 */
router.get('/subscription/:laboratoryId', authMiddleware, async (req, res) => {
  try {
    const { laboratoryId } = req.params

    // Verify user has access to this laboratory
    if ((req as any).user?.laboratoryId !== laboratoryId && (req as any).user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    // Get laboratory subscription info from database
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    const laboratory = await prisma.laboratory.findUnique({
      where: { id: laboratoryId },
      select: {
        currentPlanId: true,
        subscriptionStatus: true,
        stripeSubscriptionId: true,
        subscriptionEndsAt: true,
        trialEndsAt: true,
        lastPaymentAt: true
      }
    })

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        error: 'Laboratory not found'
      })
    }

    const plan = laboratory.currentPlanId ? billingService.getPlan(laboratory.currentPlanId) : null

    res.json({
      success: true,
      data: {
        plan,
        status: laboratory.subscriptionStatus,
        subscriptionId: laboratory.stripeSubscriptionId,
        endsAt: laboratory.subscriptionEndsAt,
        trialEndsAt: laboratory.trialEndsAt,
        lastPaymentAt: laboratory.lastPaymentAt
      }
    })
  } catch (error) {
    logger.error('Failed to get subscription:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription'
    })
  }
})

export default router 