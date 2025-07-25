import express from 'express'
import { billingController } from '../controllers/billing.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Get subscription
router.get('/subscription', async (req, res) => {
  try {
    return await billingController.getSubscription(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get subscription' })
  }
})

// Create subscription
router.post('/subscriptions', async (req, res) => {
  try {
    return await billingController.createSubscription(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create subscription' })
  }
})

// Update subscription
router.put('/subscriptions/:id', async (req, res) => {
  try {
    return await billingController.updateSubscription(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update subscription' })
  }
})

// Cancel subscription
router.post('/subscriptions/:id/cancel', async (req, res) => {
  try {
    return await billingController.cancelSubscription(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

// Get invoices
router.get('/invoices', async (req, res) => {
  try {
    return await billingController.getInvoices(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get invoices' })
  }
})

// Get payment methods
router.get('/payment-methods', async (req, res) => {
  try {
    return await billingController.getPaymentMethods(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get payment methods' })
  }
})

// Add payment method
router.post('/payment-methods', async (req, res) => {
  try {
    return await billingController.addPaymentMethod(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add payment method' })
  }
})

// Get usage
router.get('/usage', async (req, res) => {
  try {
    return await billingController.getUsage(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get usage' })
  }
})

// Webhook handler (no auth required)
router.post('/webhook', async (req, res) => {
  try {
    return await billingController.handleWebhook(req, res)
  } catch (error) {
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
})

export default router 