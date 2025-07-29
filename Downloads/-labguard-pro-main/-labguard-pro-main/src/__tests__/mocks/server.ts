import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      },
      token: 'test-token',
    }, { status: 200 })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    return HttpResponse.json({
      user: {
        id: 'new-user-id',
        email: 'new@example.com',
        name: 'New User',
        role: 'USER',
      },
      token: 'new-token',
    }, { status: 201 })
  }),

  // AI endpoints
  http.post('/api/ai/chat', async ({ request }) => {
    return HttpResponse.json({
      id: 'chat-response-id',
      role: 'assistant',
      content: 'This is a test AI response.',
      timestamp: Date.now(),
    }, { status: 200 })
  }),

  http.get('/api/ai/memory', async ({ request }) => {
    return HttpResponse.json({
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
    }, { status: 200 })
  }),

  // Equipment endpoints
  http.get('/api/equipment', async ({ request }) => {
    return HttpResponse.json({
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
    }, { status: 200 })
  }),

  http.get('/api/equipment/:id', async ({ request, params }) => {
    const { id } = params
    return HttpResponse.json({
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
    }, { status: 200 })
  }),

  http.post('/api/equipment', async ({ request }) => {
    return HttpResponse.json({
      id: 'new-equipment-id',
      name: 'New Equipment',
      serialNumber: 'NEW001',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { status: 201 })
  }),

  // Calibration endpoints
  http.get('/api/calibrations', async ({ request }) => {
    return HttpResponse.json({
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
    }, { status: 200 })
  }),

  // Analytics endpoints
  http.get('/api/analytics/dashboard', async ({ request }) => {
    return HttpResponse.json({
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
    }, { status: 200 })
  }),

  // Compliance endpoints
  http.get('/api/compliance/status', async ({ request }) => {
    return HttpResponse.json({
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
    }, { status: 200 })
  }),

  // User endpoints
  http.get('/api/users/profile', async ({ request }) => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      company: 'Test Company',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { status: 200 })
  }),

  // Error handlers
  http.all('*', async ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`)
    return HttpResponse.json({
      error: 'Not found',
      message: `No handler found for ${request.method} ${request.url}`,
    }, { status: 404 })
  }),
]

// Setup MSW server
export const server = setupServer(...handlers) 