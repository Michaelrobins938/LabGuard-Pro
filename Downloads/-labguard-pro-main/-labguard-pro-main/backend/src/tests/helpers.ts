import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function createTestLaboratory() {
  return await prisma.laboratory.create({
    data: {
      name: 'Test Laboratory',
      description: 'Test laboratory for unit tests',
      email: 'test@labguard.com',
      phone: '+1234567890',
      isActive: true,
      planType: 'STARTER'
    }
  })
}

export async function createTestUser(laboratoryId: string) {
  const hashedPassword = await bcrypt.hash('testpassword123', 12)
  
  return await prisma.user.create({
    data: {
      email: 'test@labguard.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      laboratoryId: laboratoryId
    }
  })
}

export async function createTestEquipment(laboratoryId: string) {
  return await prisma.equipment.create({
    data: {
      name: 'Test Analytical Balance',
      model: 'Test Model',
      serialNumber: 'TEST123',
      manufacturer: 'Test Manufacturer',
      equipmentType: 'BALANCE',
      location: 'Test Lab',
      status: 'ACTIVE',
      calibrationIntervalDays: 365,
      accuracy: 0.1,
      precision: 0.01,
      laboratoryId: laboratoryId
    }
  })
}

export async function cleanupTestData() {
  await prisma.calibrationRecord.deleteMany({
    where: {
      equipment: {
        laboratory: {
          name: 'Test Laboratory'
        }
      }
    }
  })
  
  await prisma.equipment.deleteMany({
    where: {
      laboratory: {
        name: 'Test Laboratory'
      }
    }
  })
  
  await prisma.user.deleteMany({
    where: {
      laboratory: {
        name: 'Test Laboratory'
      }
    }
  })
  
  await prisma.laboratory.deleteMany({
    where: {
      name: 'Test Laboratory'
    }
  })
} 