const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function setupStripeProducts() {
  try {
    console.log('🚀 Setting up Stripe products and prices...\n');

    // Create products
    const products = [
      {
        name: 'LabGuard Pro Starter',
        description: 'Perfect for small laboratories with up to 10 equipment items',
        price: 29900, // $299.00 in cents
        interval: 'month',
        features: [
          'Up to 10 equipment items',
          '100 AI compliance checks',
          'Basic reporting',
          'Email support',
          '2 team members'
        ]
      },
      {
        name: 'LabGuard Pro Professional',
        description: 'Advanced features for growing laboratories',
        price: 59900, // $599.00 in cents
        interval: 'month',
        features: [
          'Up to 50 equipment items',
          '500 AI compliance checks',
          'Advanced analytics',
          'Priority support',
          '10 team members',
          'Custom branding'
        ]
      },
      {
        name: 'LabGuard Pro Enterprise',
        description: 'Complete solution for large laboratories',
        price: 129900, // $1,299.00 in cents
        interval: 'month',
        features: [
          'Unlimited equipment',
          '2,000 AI compliance checks',
          'White-label options',
          'Dedicated support',
          'Unlimited team members',
          'API access',
          'Custom integrations'
        ]
      }
    ];

    const createdProducts = [];

    for (const product of products) {
      console.log(`Creating product: ${product.name}`);
      
      // Create the product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          features: JSON.stringify(product.features)
        }
      });

      // Create the price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
        recurring: {
          interval: product.interval
        },
        metadata: {
          features: JSON.stringify(product.features)
        }
      });

      createdProducts.push({
        name: product.name,
        productId: stripeProduct.id,
        priceId: stripePrice.id,
        price: product.price / 100,
        features: product.features
      });

      console.log(`✅ Created ${product.name}:`);
      console.log(`   Product ID: ${stripeProduct.id}`);
      console.log(`   Price ID: ${stripePrice.id}`);
      console.log(`   Price: $${product.price / 100}/month\n`);
    }

    console.log('🎉 Stripe setup complete!');
    console.log('\n📋 Add these environment variables to your .env.local file:');
    console.log('\n# Stripe Configuration');
    console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."`);
    console.log(`STRIPE_SECRET_KEY="sk_test_..."`);
    console.log(`STRIPE_WEBHOOK_SECRET="whsec_..."`);
    console.log('\n# Stripe Price IDs');
    createdProducts.forEach((product, index) => {
      const envVar = product.name.replace(/\s+/g, '_').toUpperCase();
      console.log(`${envVar}_PRICE_ID="${product.priceId}"`);
    });

    console.log('\n📝 Next steps:');
    console.log('1. Copy the environment variables above to your .env.local file');
    console.log('2. Get your Stripe publishable and secret keys from the Stripe Dashboard');
    console.log('3. Set up webhooks in your Stripe Dashboard');
    console.log('4. Test the integration with the billing pages');

    return createdProducts;

  } catch (error) {
    console.error('❌ Error setting up Stripe:', error);
    throw error;
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupStripeProducts()
    .then(() => {
      console.log('\n✅ Stripe setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Stripe setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupStripeProducts }; 