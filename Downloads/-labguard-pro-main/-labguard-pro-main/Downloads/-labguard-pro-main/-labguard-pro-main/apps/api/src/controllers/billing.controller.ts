import { Request, Response } from 'express';
import { PrismaClient } from '@labguard/database';
import BillingService from '../services/BillingService';

const prisma = new PrismaClient();

export class BillingController {
  /**
   * Get available subscription plans
   */
  async getPlans(req: Request, res: Response) {
    try {
      const plans = BillingService.getAvailablePlans();

      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      console.error('Get plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get plans',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(req: Request, res: Response) {
    try {
      const { userId, email, name } = req.body;

      if (!userId || !email || !name) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: userId, email, name'
        });
      }

      const customerId = await BillingService.createCustomer(userId, email, name);

      res.json({
        success: true,
        data: { customerId }
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(req: Request, res: Response) {
    try {
      const { customerId, planId, paymentMethodId } = req.body;

      if (!customerId || !planId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customerId, planId'
        });
      }

      const subscription = await BillingService.createSubscription(
        customerId,
        planId,
        paymentMethodId
      );

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      const { cancelAtPeriodEnd = true } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Missing subscription ID'
        });
      }

      await BillingService.cancelSubscription(subscriptionId, cancelAtPeriodEnd);

      res.json({
        success: true,
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      const { planId } = req.body;

      if (!subscriptionId || !planId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: subscriptionId, planId'
        });
      }

      const subscription = await BillingService.updateSubscription(subscriptionId, planId);

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Track usage
   */
  async trackUsage(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const metrics = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Missing user ID'
        });
      }

      await BillingService.trackUsage(userId, metrics);

      res.json({
        success: true,
        message: 'Usage tracked successfully'
      });
    } catch (error) {
      console.error('Track usage error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track usage',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get user usage
   */
  async getUserUsage(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Missing user ID'
        });
      }

      const usage = await BillingService.getUserUsage(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json({
        success: true,
        data: usage
      });
    } catch (error) {
      console.error('Get user usage error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user usage',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate invoice
   */
  async generateInvoice(req: Request, res: Response) {
    try {
      const { customerId, subscriptionId, items } = req.body;

      if (!customerId || !subscriptionId || !items) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customerId, subscriptionId, items'
        });
      }

      const invoice = await BillingService.generateInvoice(customerId, subscriptionId, items);

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Generate invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check user limits
   */
  async checkUserLimits(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Missing user ID'
        });
      }

      const limits = await BillingService.checkUserLimits(userId);

      res.json({
        success: true,
        data: limits
      });
    } catch (error) {
      console.error('Check user limits error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check user limits',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !endpointSecret) {
        return res.status(400).json({
          success: false,
          message: 'Missing signature or webhook secret'
        });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      await BillingService.handleWebhook(event);

      res.json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get subscription by ID
   */
  async getSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Missing subscription ID'
        });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
        include: {
          user: true
        }
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get customer subscriptions
   */
  async getCustomerSubscriptions(req: Request, res: Response) {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: 'Missing customer ID'
        });
      }

      const subscriptions = await prisma.subscription.findMany({
        where: { userId: customerId },
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      console.error('Get customer subscriptions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customer subscriptions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new BillingController(); 