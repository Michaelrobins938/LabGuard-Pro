import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Mock API handlers
export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER',
        },
        token: 'test-token',
      })
    )
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        user: {
          id: 'new-user-id',
          email: 'new@example.com',
          name: 'New User',
          role: 'USER',
        },
        token: 'new-token',
      })
    )
  }),

  // AI endpoints
  rest.post('/api/ai/chat', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'chat-response-id',
        role: 'assistant',
        content: 'This is a test AI response.',
        timestamp: Date.now(),
      })
    )
  }),

  rest.get('/api/ai/memory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: Date.now() - 1000,
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Hi there!',
            timestamp: Date.now(),
          },
        ],
      })
    )
  }),

  // Equipment endpoints
  rest.get('/api/equipment', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        equipment: [
          {
            id: 'equipment-1',
            name: 'Test Equipment 1',
            serialNumber: 'TEST001',
            status: 'ACTIVE',
            lastCalibration: new Date().toISOString(),
            nextCalibration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'equipment-2',
            name: 'Test Equipment 2',
            serialNumber: 'TEST002',
            status: 'MAINTENANCE',
            lastCalibration: new Date().toISOString(),
            nextCalibration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      })
    )
  }),

  rest.get('/api/equipment/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: `Test Equipment ${id}`,
        serialNumber: `TEST${id}`,
        model: 'Test Model',
        manufacturer: 'Test Manufacturer',
        location: 'Test Location',
        status: 'ACTIVE',
        lastCalibration: new Date().toISOString(),
        nextCalibration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    )
  }),

  rest.post('/api/equipment', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-equipment-id',
        name: 'New Equipment',
        serialNumber: 'NEW001',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    )
  }),

  // Calibration endpoints
  rest.get('/api/calibrations', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        calibrations: [
          {
            id: 'calibration-1',
            equipmentId: 'equipment-1',
            type: 'ROUTINE',
            status: 'COMPLETED',
            performedBy: 'test-user-id',
            performedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'calibration-2',
            equipmentId: 'equipment-2',
            type: 'EMERGENCY',
            status: 'PENDING',
            performedBy: 'test-user-id',
            performedAt: null,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      })
    )
  }),

  // Analytics endpoints
  rest.get('/api/analytics/dashboard', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalEquipment: 145,
        activeEquipment: 142,
        pendingCalibrations: 8,
        completedCalibrations: 137,
        complianceRate: 98.5,
        recentActivity: [
          {
            id: 'activity-1',
            type: 'CALIBRATION_COMPLETED',
            equipmentName: 'Test Equipment',
            timestamp: new Date().toISOString(),
            user: 'Test User',
          },
        ],
      })
    )
  }),

  // Compliance endpoints
  rest.get('/api/compliance/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        overallCompliance: 98.5,
        regulatoryStandards: [
          {
            name: 'ISO 17025',
            compliance: 100,
            lastAudit: new Date().toISOString(),
            nextAudit: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            name: 'FDA 21 CFR Part 11',
            compliance: 97,
            lastAudit: new Date().toISOString(),
            nextAudit: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        auditHistory: [
          {
            id: 'audit-1',
            type: 'INTERNAL',
            status: 'PASSED',
            date: new Date().toISOString(),
            score: 98.5,
          },
        ],
      })
    )
  }),

  // User endpoints
  rest.get('/api/users/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        company: 'Test Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    )
  }),

  // Error handlers
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`)
    return res(
      ctx.status(404),
      ctx.json({
        error: 'Not found',
        message: `No handler found for ${req.method} ${req.url}`,
      })
    )
  }),
]

// Setup MSW server
export const server = setupServer(...handlers) 