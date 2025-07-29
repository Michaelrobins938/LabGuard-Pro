import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../app'
import { createTestUser, createTestLaboratory, createTestEquipment } from './helpers'

const prisma = new PrismaClient()

describe('Calibration API', () => {
  let testUser: any
  let testLaboratory: any
  let testEquipment: any
  let authToken: string

  beforeAll(async () => {
    // Create test data
    testLaboratory = await createTestLaboratory()
    testUser = await createTestUser(testLaboratory.id)
    testEquipment = await createTestEquipment(testLaboratory.id)
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'testpassword123'
      })
    
    authToken = loginResponse.body.token
  })

  afterAll(async () => {
    // Cleanup test data
    await prisma.calibrationRecord.deleteMany({
      where: { equipmentId: testEquipment.id }
    })
    await prisma.equipment.delete({ where: { id: testEquipment.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    await prisma.laboratory.delete({ where: { id: testLaboratory.id } })
    await prisma.$disconnect()
  })

  describe('POST /api/calibration', () => {
    it('should create a new calibration record', async () => {
      const calibrationData = {
        equipmentId: testEquipment.id,
        calibrationType: 'PERIODIC',
        scheduledDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Test calibration'
      }

      const response = await request(app)
        .post('/api/calibration')
        .set('Authorization', `Bearer ${authToken}`)
        .send(calibrationData)

      expect(response.status).toBe(201)
      expect(response.body.calibration).toMatchObject({
        equipmentId: testEquipment.id,
        calibrationType: 'PERIODIC',
        status: 'SCHEDULED'
      })
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/calibration')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })

    it('should reject invalid equipment ID', async () => {
      const calibrationData = {
        equipmentId: 'invalid-id',
        calibrationType: 'PERIODIC',
        scheduledDate: new Date().toISOString(),
        dueDate: new Date().toISOString()
      }

      const response = await request(app)
        .post('/api/calibration')
        .set('Authorization', `Bearer ${authToken}`)
        .send(calibrationData)

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/calibration', () => {
    it('should return calibrations for laboratory', async () => {
      const response = await request(app)
        .get('/api/calibration')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.calibrations)).toBe(true)
    })

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/calibration?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.pagination).toBeDefined()
      expect(response.body.pagination.page).toBe(1)
      expect(response.body.pagination.limit).toBe(10)
    })

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/calibration?status=SCHEDULED')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      response.body.calibrations.forEach((calibration: any) => {
        expect(calibration.status).toBe('SCHEDULED')
      })
    })
  })

  describe('POST /api/calibration/:id/validate', () => {
    let calibrationId: string

    beforeEach(async () => {
      // Create a calibration for testing
      const calibration = await prisma.calibrationRecord.create({
        data: {
          equipmentId: testEquipment.id,
          performedById: testUser.id,
          calibrationDate: new Date(),
          nextCalibrationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          method: 'Standard Calibration',
          isCompliant: false
        }
      })
      calibrationId = calibration.id
    })

    afterEach(async () => {
      await prisma.calibrationRecord.delete({
        where: { id: calibrationId }
      })
    })

    it('should validate calibration with AI', async () => {
      const validationData = {
        measurements: {
          accuracy: 0.05,
          precision: 0.02,
          linearity: 0.9999,
          repeatability: 0.01
        },
        environmentalConditions: {
          temperature: 23.5,
          humidity: 45,
          pressure: 1013.25
        },
        standardsUsed: {
          standard1: 'NIST Traceable Weight Set',
          standard2: 'Calibration Certificate #12345'
        },
        templateId: 'template-123'
      }

      const response = await request(app)
        .post(`/api/calibration/${calibrationId}/validate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(validationData)

      expect(response.status).toBe(200)
      expect(response.body.validationResult).toBeDefined()
      expect(response.body.complianceStatus).toBeDefined()
    })

    it('should handle AI validation errors gracefully', async () => {
      // Mock AI service failure
      jest.spyOn(require('../utils/ai.service'), 'validateCalibration')
        .mockRejectedValue(new Error('AI service unavailable'))

      const validationData = {
        measurements: {},
        environmentalConditions: {},
        standardsUsed: {},
        templateId: 'template-123'
      }

      const response = await request(app)
        .post(`/api/calibration/${calibrationId}/validate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(validationData)

      expect(response.status).toBe(500)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('GET /api/calibration/due', () => {
    it('should return due calibrations', async () => {
      const response = await request(app)
        .get('/api/calibration/due')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.calibrations)).toBe(true)
    })
  })

  describe('GET /api/calibration/overdue', () => {
    it('should return overdue calibrations', async () => {
      const response = await request(app)
        .get('/api/calibration/overdue')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.calibrations)).toBe(true)
    })
  })

  describe('PUT /api/calibration/:id', () => {
    let calibrationId: string

    beforeEach(async () => {
      const calibration = await prisma.calibrationRecord.create({
        data: {
          equipmentId: testEquipment.id,
          performedById: testUser.id,
          calibrationDate: new Date(),
          nextCalibrationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          method: 'Standard Calibration',
          isCompliant: false
        }
      })
      calibrationId = calibration.id
    })

    afterEach(async () => {
      await prisma.calibrationRecord.delete({
        where: { id: calibrationId }
      })
    })

    it('should update calibration compliance', async () => {
      const updateData = {
        isCompliant: true,
        complianceScore: 95.5,
        accuracy: 0.05,
        precision: 0.02
      }

      const response = await request(app)
        .put(`/api/calibration/${calibrationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body.calibration.isCompliant).toBe(true)
      expect(response.body.calibration.complianceScore).toBe(95.5)
    })

    it('should validate compliance score range', async () => {
      const updateData = {
        complianceScore: 150 // Invalid score > 100
      }

      const response = await request(app)
        .put(`/api/calibration/${calibrationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/calibration/:id', () => {
    let calibrationId: string

    beforeEach(async () => {
      const calibration = await prisma.calibrationRecord.create({
        data: {
          equipmentId: testEquipment.id,
          performedById: testUser.id,
          calibrationDate: new Date(),
          nextCalibrationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          method: 'Standard Calibration',
          isCompliant: false
        }
      })
      calibrationId = calibration.id
    })

    it('should soft delete calibration', async () => {
      const response = await request(app)
        .delete(`/api/calibration/${calibrationId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)

      // Verify soft delete
      const deletedCalibration = await prisma.calibrationRecord.findUnique({
        where: { id: calibrationId }
      })
      expect(deletedCalibration?.deletedAt).toBeDefined()
    })
  })
}) 