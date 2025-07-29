import { PrismaClient, UserRole, EquipmentType, EquipmentStatus, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create laboratories
  const lab1 = await prisma.laboratory.create({
    data: {
      name: 'Advanced Diagnostics Lab',
      address: '123 Medical Center Dr, Health City, HC 12345',
      phone: '+1-555-0123',
      email: 'admin@advanceddiagnostics.com',
      licenseNumber: 'LIC-2024-001',
      capNumber: 'CAP-12345',
      cliaNumber: 'CLIA-67890',
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en'
      }
    }
  })

  const lab2 = await prisma.laboratory.create({
    data: {
      name: 'Regional Medical Laboratory',
      address: '456 Research Blvd, Science Park, SP 54321',
      phone: '+1-555-0456',
      email: 'contact@regionalmedlab.com',
      licenseNumber: 'LIC-2024-002',
      capNumber: 'CAP-54321',
      cliaNumber: 'CLIA-09876',
      settings: {
        timezone: 'America/Chicago',
        currency: 'USD',
        language: 'en'
      }
    }
  })

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@advanceddiagnostics.com',
      name: 'Sarah Johnson',
      role: UserRole.ADMIN,
      laboratoryId: lab1.id,
      hashedPassword: '$2a$12$LQv3c1yqBTVHCHYLtk.6bOLQv3c1yqBTVHCHYLtk.6bOLQv3c1yq' // password: admin123
    }
  })

  const supervisorUser = await prisma.user.create({
    data: {
      email: 'supervisor@advanceddiagnostics.com',
      name: 'Michael Chen',
      role: UserRole.SUPERVISOR,
      laboratoryId: lab1.id,
      hashedPassword: '$2a$12$LQv3c1yqBTVHCHYLtk.6bOLQv3c1yqBTVHCHYLtk.6bOLQv3c1yq' // password: supervisor123
    }
  })

  const technicianUser = await prisma.user.create({
    data: {
      email: 'technician@advanceddiagnostics.com',
      name: 'Emily Rodriguez',
      role: UserRole.TECHNICIAN,
      laboratoryId: lab1.id,
      hashedPassword: '$2a$12$LQv3c1yqBTVHCHYLtk.6bOLQv3c1yqBTVHCHYLtk.6bOLQv3c1yq' // password: tech123
    }
  })

  // Create equipment
  const analyticalBalance = await prisma.equipment.create({
    data: {
      name: 'Precision Balance PB-220',
      model: 'PB-220',
      serialNumber: 'PB220-2024-001',
      manufacturer: 'Mettler Toledo',
      equipmentType: EquipmentType.ANALYTICAL_BALANCE,
      location: 'Chemistry Lab - Bench 1',
      installDate: new Date('2024-01-15'),
      warrantyExpiry: new Date('2027-01-15'),
      status: EquipmentStatus.ACTIVE,
      laboratoryId: lab1.id,
      createdById: adminUser.id,
      specifications: {
        capacity: '220g',
        readability: '0.1mg',
        linearity: '±0.2mg',
        repeatability: '0.1mg',
        operatingTemperature: '18-25°C',
        humidity: '45-75%'
      },
      maintenanceSchedule: {
        frequency: 'monthly',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-02-15'
      }
    }
  })

  const centrifuge = await prisma.equipment.create({
    data: {
      name: 'High-Speed Centrifuge CF-16',
      model: 'CF-16',
      serialNumber: 'CF16-2024-002',
      manufacturer: 'Eppendorf',
      equipmentType: EquipmentType.CENTRIFUGE,
      location: 'Processing Room - Station 2',
      installDate: new Date('2024-01-20'),
      warrantyExpiry: new Date('2027-01-20'),
      status: EquipmentStatus.ACTIVE,
      laboratoryId: lab1.id,
      createdById: adminUser.id,
      specifications: {
        maxSpeed: '16000 RPM',
        maxRCF: '25000 x g',
        capacity: '24 x 1.5ml tubes',
        operatingTemperature: '15-35°C',
        powerRequirement: '120V/60Hz'
      },
      maintenanceSchedule: {
        frequency: 'quarterly',
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-04-20'
      }
    }
  })

  const incubator = await prisma.equipment.create({
    data: {
      name: 'CO2 Incubator IC-200',
      model: 'IC-200',
      serialNumber: 'IC200-2024-003',
      manufacturer: 'Thermo Fisher',
      equipmentType: EquipmentType.INCUBATOR,
      location: 'Microbiology Lab - Corner Unit',
      installDate: new Date('2024-01-25'),
      warrantyExpiry: new Date('2027-01-25'),
      status: EquipmentStatus.ACTIVE,
      laboratoryId: lab1.id,
      createdById: adminUser.id,
      specifications: {
        temperatureRange: '5-60°C',
        co2Range: '0-20%',
        capacity: '200L',
        uniformity: '±0.2°C',
        recovery: '<10 minutes'
      },
      maintenanceSchedule: {
        frequency: 'monthly',
        lastMaintenance: '2024-01-25',
        nextMaintenance: '2024-02-25'
      }
    }
  })

  // Create compliance templates
  const balanceCalibrationTemplate = await prisma.complianceTemplate.create({
    data: {
      name: 'Analytical Balance Calibration Verification',
      description: 'Pre-use calibration check for analytical balances in quantitative testing',
      category: 'Equipment Calibration',
      laboratoryId: lab1.id,
      promptTemplate: `You are a precision measurement compliance agent for analytical equipment validation.

BALANCE CALIBRATION CHECK:
Equipment ID: {EQUIPMENT_ID}
Model/Serial: {MODEL_SERIAL}
Last Calibration: {LAST_CAL_DATE}
Calibration Due: {NEXT_CAL_DATE}
Operator: {OPERATOR_NAME}
Test Weights Used: {REFERENCE_WEIGHTS}

PERFORMANCE VERIFICATION:
- Linearity Check Results: {LINEARITY_DATA}
- Repeatability (10 measurements): {REPEATABILITY_VALUES}
- Accuracy vs. Reference: {ACCURACY_DEVIATION}
- Environmental Conditions: {TEMP_HUMIDITY}
- Vibration Level: {VIBRATION_STATUS}

ACCEPTANCE CRITERIA:
□ Accuracy within ±0.1mg for Class I balances
□ Repeatability SD <0.1mg
□ Linearity R² >0.9999
□ Environmental conditions stable
□ No overdue calibrations

VALIDATION ACTIONS:
1. Compare performance against manufacturer specifications
2. Verify calibration certificate validity
3. Check environmental compliance (temperature ±2°C, humidity 45-75%)
4. Confirm operator training current
5. Generate performance qualification report

OUTPUT:
- CALIBRATION STATUS: [PASS/FAIL/CONDITIONAL]
- PERFORMANCE SUMMARY: [Key metrics vs. acceptance criteria]
- CORRECTIVE ACTIONS: [If deficiencies found]
- NEXT VERIFICATION DUE: [Schedule next check]`,
      variables: [
        'EQUIPMENT_ID',
        'MODEL_SERIAL',
        'LAST_CAL_DATE',
        'NEXT_CAL_DATE',
        'OPERATOR_NAME',
        'REFERENCE_WEIGHTS',
        'LINEARITY_DATA',
        'REPEATABILITY_VALUES',
        'ACCURACY_DEVIATION',
        'TEMP_HUMIDITY',
        'VIBRATION_STATUS'
      ],
      safetyChecks: [
        'Accuracy limits verification',
        'Environmental conditions monitoring',
        'Certification validity check',
        'Operator qualification verification'
      ],
      acceptanceCriteria: {
        accuracy: '±0.1mg',
        repeatability: '<0.1mg SD',
        linearity: '>0.9999 R²',
        temperature: '±2°C',
        humidity: '45-75%'
      }
    }
  })

  // Create subscriptions
  await prisma.subscription.create({
    data: {
      stripeCustomerId: 'cus_test_123456',
      plan: SubscriptionPlan.PROFESSIONAL,
      status: SubscriptionStatus.ACTIVE,
      usageLimit: 500,
      currentUsage: 45,
      stripePriceId: 'price_professional_monthly',
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      laboratoryId: lab1.id
    }
  })

  await prisma.subscription.create({
    data: {
      stripeCustomerId: 'cus_test_789012',
      plan: SubscriptionPlan.STARTER,
      status: SubscriptionStatus.TRIALING,
      usageLimit: 100,
      currentUsage: 12,
      stripePriceId: 'price_starter_monthly',
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      laboratoryId: lab2.id
    }
  })

  console.log('✅ Seed completed successfully!')
  console.log(`Created:
  - 2 laboratories
  - 3 users
  - 3 equipment items
  - 1 compliance template
  - 2 subscriptions`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 