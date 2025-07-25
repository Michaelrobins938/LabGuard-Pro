const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up LabGuard Pro database...')

  // Create a default laboratory
  const laboratory = await prisma.laboratory.upsert({
    where: { id: 'lab_demo_123' },
    update: {},
    create: {
      id: 'lab_demo_123',
      name: 'Demo Laboratory',
      email: 'demo@labguard.com',
      phone: '+1-555-0123',
      address: '123 Science Ave, Research City, RC 12345',
      website: 'https://demo.labguard.com',
      licenseNumber: 'LAB-2024-001',
      isActive: true,
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en'
      }
    }
  })

  console.log('✅ Laboratory created:', laboratory.name)

  // Create a default user
  const user = await prisma.user.upsert({
    where: { id: 'user_demo_123' },
    update: {},
    create: {
      id: 'user_demo_123',
      email: 'demo@labguard.com',
      hashedPassword: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: password123
      firstName: 'Michael',
      lastName: 'Robinson',
      name: 'Michael Robinson',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      laboratoryId: laboratory.id
    }
  })

  console.log('✅ User created:', user.email)

  // Create a default subscription plan
  const plan = await prisma.subscriptionPlan.upsert({
    where: { id: 'plan_starter' },
    update: {},
    create: {
      id: 'plan_starter',
      name: 'Starter',
      description: 'Perfect for small laboratories',
      price: 29.99,
      currency: 'USD',
      interval: 'month',
      equipmentLimit: 10,
      aiChecksLimit: 100,
      teamMembersLimit: 5,
      storageLimit: 10,
      features: ['Equipment Management', 'Basic Calibration', 'AI Assistant', 'Email Support'],
      isActive: true
    }
  })

  console.log('✅ Subscription plan created:', plan.name)

  // Create a subscription for the laboratory
  const subscription = await prisma.subscription.upsert({
    where: { laboratoryId: laboratory.id },
    update: {},
    create: {
      laboratoryId: laboratory.id,
      planId: plan.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      trialStart: new Date(),
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 day trial
    }
  })

  console.log('✅ Subscription created for laboratory')

  // Create some sample equipment
  const equipment = await prisma.equipment.upsert({
    where: { id: 'equip_001' },
    update: {},
    create: {
      id: 'equip_001',
      name: 'Analytical Balance',
      model: 'AB-2000',
      serialNumber: 'AB-2024-001',
      manufacturer: 'Precision Instruments',
      location: 'Lab A - Bench 1',
      status: 'ACTIVE',
      lastCalibrated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextCalibration: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
      notes: 'Primary analytical balance for sample weighing',
      laboratoryId: laboratory.id
    }
  })

  console.log('✅ Sample equipment created:', equipment.name)

  console.log('🎉 Database setup completed successfully!')
  console.log('📧 Login with: demo@labguard.com')
  console.log('🔑 Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Database setup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 