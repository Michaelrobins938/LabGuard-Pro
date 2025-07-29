# 🚀 Stripe Integration Setup Guide

## Step 1: Get Your Stripe Keys

1. **Go to your Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to Developers → API Keys**
3. **Copy your keys**:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Create Your Environment File

Create a `.env.local` file in the `apps/web` directory with your Stripe keys:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Stripe Price IDs (you'll get these after running the setup script)
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."
```

## Step 3: Create Stripe Products and Prices

Run the setup script to create your subscription products:

```bash
# From the root directory
cd scripts
node setup-stripe.js
```

This will:
- Create 3 subscription products (Starter, Professional, Enterprise)
- Create monthly prices for each product
- Output the price IDs to add to your environment file

## Step 4: Set Up Webhooks

1. **Go to Stripe Dashboard → Developers → Webhooks**
2. **Click "Add endpoint"**
3. **Set the endpoint URL** to: `https://your-domain.com/api/webhooks/stripe`
4. **Select these events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Copy the webhook secret** and add it to your `.env.local` file

## Step 5: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the billing plans page**:
   ```
   http://localhost:3000/dashboard/billing/plans
   ```

3. **Test a subscription**:
   - Click "Get Starter Plan" (or any plan)
   - You'll be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Complete the payment
   - You'll be redirected back to your dashboard

## Step 6: Verify Everything Works

1. **Check your Stripe Dashboard**:
   - Go to Customers → You should see a new customer
   - Go to Subscriptions → You should see the subscription
   - Go to Webhooks → You should see successful webhook deliveries

2. **Check your application**:
   - The subscription should be active
   - User permissions should be updated
   - Billing page should show current subscription

## Test Cards for Development

Use these test cards in Stripe Checkout:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`
- **Insufficient funds**: `4000 0000 0000 9995`

## Production Deployment

1. **Switch to live keys**:
   - Replace `pk_test_` with `pk_live_`
   - Replace `sk_test_` with `sk_live_`

2. **Update webhook endpoint**:
   - Change webhook URL to your production domain
   - Update webhook secret

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Check your Stripe secret key is correct
   - Ensure you're using the right environment (test vs live)

2. **Webhook failures**:
   - Verify webhook secret is correct
   - Check webhook endpoint URL is accessible
   - Ensure all required events are selected

3. **Checkout not working**:
   - Verify publishable key is correct
   - Check browser console for errors
   - Ensure Stripe.js is loading properly

4. **Subscription not created**:
   - Check webhook is receiving events
   - Verify database connection
   - Check server logs for errors

### Debug Commands:

```bash
# Check Stripe products
stripe products list

# Check Stripe prices
stripe prices list

# Check webhook events
stripe events list

# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Next Steps

Once Stripe is integrated, you can:

1. **Add customer portal** for self-service billing
2. **Implement usage tracking** and metered billing
3. **Add invoice generation** and PDF downloads
4. **Set up dunning management** for failed payments
5. **Add subscription analytics** and reporting

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com/
- **Stripe Discord**: https://discord.gg/stripe

---

🎉 **Congratulations!** Your Stripe integration is now complete and ready to process real payments! 