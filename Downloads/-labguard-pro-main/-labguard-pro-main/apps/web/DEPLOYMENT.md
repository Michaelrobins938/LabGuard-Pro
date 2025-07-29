# LabGuard Pro - Production Deployment Guide

## Overview

This guide covers the production deployment of the LabGuard Pro billing system, including Stripe integration, webhook configuration, database setup, and monitoring.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account with API keys
- Vercel account (for hosting)
- Domain name (optional)

## 1. Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/labguard_pro"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PORTAL_CONFIGURATION_ID="bpc_..."

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"

# Database (for Prisma)
DIRECT_URL="postgresql://username:password@localhost:5432/labguard_pro"
```

### Vercel Environment Variables

Set the same environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each environment variable from the list above

## 2. Database Setup

### Local Development

```bash
# Install dependencies
cd apps/web
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

### Production Database

1. Set up a PostgreSQL database (recommended: Supabase, Railway, or AWS RDS)
2. Update the `DATABASE_URL` in your environment variables
3. Run migrations:

```bash
npx prisma migrate deploy
```

## 3. Stripe Configuration

### 1. Create Stripe Products and Prices

In your Stripe Dashboard:

1. **Create Products:**
   - Starter Plan
   - Professional Plan
   - Enterprise Plan

2. **Create Prices:**
   - Monthly and yearly prices for each plan
   - Note the Price IDs for environment variables

3. **Configure Customer Portal:**
   - Go to Settings > Customer Portal
   - Configure the portal settings
   - Note the Configuration ID

### 2. Webhook Configuration

1. **Create Webhook Endpoint:**
   - Go to Developers > Webhooks in Stripe Dashboard
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.created`
     - `customer.updated`

2. **Get Webhook Secret:**
   - Copy the webhook signing secret
   - Add to `STRIPE_WEBHOOK_SECRET` environment variable

## 4. Vercel Deployment

### 1. Connect Repository

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Environment Variables

Add all environment variables to Vercel:

```bash
# Database
DATABASE_URL
DIRECT_URL

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PORTAL_CONFIGURATION_ID
STRIPE_STARTER_PRICE_ID
STRIPE_PROFESSIONAL_PRICE_ID
STRIPE_ENTERPRISE_PRICE_ID

# Application
NEXT_PUBLIC_APP_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
```

### 3. Deploy

1. Push your code to the main branch
2. Vercel will automatically deploy
3. Check the deployment logs for any errors

## 5. Post-Deployment Setup

### 1. Database Migration

After deployment, run database migrations:

```bash
# Connect to your production database
npx prisma migrate deploy
```

### 2. Verify Webhooks

1. Check Stripe Dashboard > Webhooks
2. Verify webhook deliveries are successful
3. Test webhook events if needed

### 3. Test Payment Flow

1. Use Stripe test cards to test the checkout flow
2. Verify webhook events are received
3. Check database records are created

## 6. Monitoring and Analytics

### 1. Error Monitoring

Set up error monitoring with Sentry:

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js`:

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
});
```

### 2. Usage Analytics

The application includes built-in usage tracking:

- Equipment usage
- AI compliance checks
- Team member changes
- Storage usage
- API calls
- Report generation

### 3. Logging

Configure structured logging:

```javascript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
```

## 7. Security Considerations

### 1. Environment Variables

- Never commit environment variables to version control
- Use Vercel's environment variable management
- Rotate secrets regularly

### 2. Database Security

- Use connection pooling
- Enable SSL for database connections
- Implement proper access controls

### 3. API Security

- Validate all webhook signatures
- Implement rate limiting
- Use HTTPS in production

## 8. Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_subscription_laboratory_id ON subscriptions(laboratory_id);
CREATE INDEX idx_usage_tracking_period ON usage_tracking(period_start, period_end);
CREATE INDEX idx_usage_events_timestamp ON usage_events(timestamp);
```

### 2. Caching

Implement Redis caching for frequently accessed data:

```javascript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const cache = {
  async get(key: string) {
    return await redis.get(key)
  },
  async set(key: string, value: string, ttl?: number) {
    await redis.set(key, value, 'EX', ttl || 3600)
  }
}
```

### 3. CDN Configuration

Configure Vercel's CDN for static assets:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}
```

## 9. Testing

### 1. Unit Tests

```bash
npm run test
```

### 2. Integration Tests

```bash
npm run test:integration
```

### 3. E2E Tests

```bash
npm run test:e2e
```

## 10. Maintenance

### 1. Regular Updates

- Keep dependencies updated
- Monitor for security vulnerabilities
- Update Stripe SDK regularly

### 2. Database Maintenance

```bash
# Regular database backups
pg_dump $DATABASE_URL > backup.sql

# Monitor database performance
# Check for slow queries
# Optimize indexes as needed
```

### 3. Monitoring

- Set up uptime monitoring
- Monitor error rates
- Track performance metrics
- Monitor usage patterns

## 11. Troubleshooting

### Common Issues

1. **Webhook Failures:**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check server logs

2. **Database Connection Issues:**
   - Verify DATABASE_URL
   - Check connection limits
   - Monitor connection pooling

3. **Payment Processing Errors:**
   - Check Stripe API keys
   - Verify price IDs
   - Test with Stripe test mode

### Support

For issues with:
- **Stripe Integration:** Contact Stripe Support
- **Vercel Deployment:** Check Vercel Documentation
- **Database Issues:** Check your database provider's documentation

## 12. Scaling Considerations

### 1. Database Scaling

- Consider read replicas for heavy read workloads
- Implement database sharding for large datasets
- Use connection pooling

### 2. Application Scaling

- Vercel automatically scales based on traffic
- Consider edge functions for global performance
- Implement caching strategies

### 3. Monitoring Scaling

- Set up alerts for high usage
- Monitor database performance
- Track API response times

---

## Quick Deployment Checklist

- [ ] Environment variables configured
- [ ] Database set up and migrated
- [ ] Stripe products and prices created
- [ ] Webhooks configured
- [ ] Vercel deployment successful
- [ ] Webhook events verified
- [ ] Payment flow tested
- [ ] Monitoring configured
- [ ] Error tracking set up
- [ ] Performance optimized

---

For additional support, refer to the documentation or contact the development team.