import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const prisma = new PrismaClient()
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received webhook event:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  try {
    const { planId, isYearly, planName, laboratoryId } = paymentIntent.metadata
    
    // Find the plan
    const plan = await prisma.subscriptionPlan.findFirst({
      where: { id: planId }
    })

    if (!plan) {
      console.error('Plan not found:', planId)
      return
    }

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { 
        laboratoryId: laboratoryId || 'default' 
      },
      update: {
        planId: planId,
        stripeId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer as string,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (isYearly === 'true' ? 365 : 30) * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      },
      create: {
        laboratoryId: laboratoryId || 'default',
        planId: planId,
        stripeId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer as string,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (isYearly === 'true' ? 365 : 30) * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
    })

    // Create usage tracking record
    await prisma.usageTracking.create({
      data: {
        laboratoryId: laboratoryId || 'default',
        subscriptionId: subscription.id,
        equipmentCount: 0,
        aiChecksUsed: 0,
        teamMembersCount: 0,
        storageUsed: 0,
        periodStart: new Date(),
        periodEnd: new Date(Date.now() + (isYearly === 'true' ? 365 : 30) * 24 * 60 * 60 * 1000)
      }
    })

    console.log(`Subscription created for plan: ${planName}`)
  } catch (error) {
    console.error('Failed to create subscription:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  try {
    const { laboratoryId } = paymentIntent.metadata
    
    // Update subscription status to failed
    await prisma.subscription.updateMany({
      where: { 
        laboratoryId: laboratoryId || 'default',
        stripeId: paymentIntent.id
      },
      data: {
        status: 'PAST_DUE'
      }
    })
    
    console.log('Payment failure handled')
  } catch (error) {
    console.error('Failed to handle payment failure:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)
  
  try {
    const laboratoryId = subscription.metadata.laboratoryId || 'default'
    
    // Update subscription in database
    await prisma.subscription.updateMany({
      where: { 
        laboratoryId: laboratoryId,
        stripeId: subscription.id
      },
      data: {
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false
      }
    })
    
    console.log('Subscription created in database')
  } catch (error) {
    console.error('Failed to update subscription:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  
  try {
    const laboratoryId = subscription.metadata.laboratoryId || 'default'
    
    // Update subscription in database
    await prisma.subscription.updateMany({
      where: { 
        laboratoryId: laboratoryId,
        stripeId: subscription.id
      },
      data: {
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false
      }
    })
    
    console.log('Subscription updated in database')
  } catch (error) {
    console.error('Failed to update subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  try {
    const laboratoryId = subscription.metadata.laboratoryId || 'default'
    
    // Update subscription status to cancelled
    await prisma.subscription.updateMany({
      where: { 
        laboratoryId: laboratoryId,
        stripeId: subscription.id
      },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true
      }
    })
    
    console.log('Subscription cancelled in database')
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  try {
    if (invoice.subscription) {
      // Update subscription status
      await prisma.subscription.updateMany({
        where: { 
          stripeId: invoice.subscription as string
        },
        data: {
          status: 'ACTIVE'
        }
      })

      // Record invoice payment
      await prisma.invoice.create({
        data: {
          stripeId: invoice.id,
          subscriptionId: invoice.subscription as string,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'paid',
          paidAt: new Date(),
          description: invoice.description || 'Subscription payment'
        }
      })
    }
    
    console.log('Invoice payment recorded')
  } catch (error) {
    console.error('Failed to record invoice payment:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)
  
  try {
    if (invoice.subscription) {
      // Update subscription status
      await prisma.subscription.updateMany({
        where: { 
          stripeId: invoice.subscription as string
        },
        data: {
          status: 'PAST_DUE'
        }
      })

      // Record failed invoice
      await prisma.invoice.create({
        data: {
          stripeId: invoice.id,
          subscriptionId: invoice.subscription as string,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed',
          failedAt: new Date(),
          description: invoice.description || 'Subscription payment'
        }
      })
    }
    
    console.log('Failed payment handled')
  } catch (error) {
    console.error('Failed to handle failed payment:', error)
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log('Customer created:', customer.id)
  
  try {
    // Create customer record in database
    await prisma.customer.upsert({
      where: { stripeId: customer.id },
      update: {
        email: customer.email || '',
        name: customer.name || '',
        phone: customer.phone || '',
        metadata: customer.metadata
      },
      create: {
        stripeId: customer.id,
        email: customer.email || '',
        name: customer.name || '',
        phone: customer.phone || '',
        metadata: customer.metadata
      }
    })
    
    console.log('Customer created in database')
  } catch (error) {
    console.error('Failed to create customer:', error)
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  console.log('Customer updated:', customer.id)
  
  try {
    // Update customer in database
    await prisma.customer.updateMany({
      where: { stripeId: customer.id },
      data: {
        email: customer.email || '',
        name: customer.name || '',
        phone: customer.phone || '',
        metadata: customer.metadata
      }
    })
    
    console.log('Customer updated in database')
  } catch (error) {
    console.error('Failed to update customer:', error)
  }
}