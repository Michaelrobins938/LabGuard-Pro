import { z } from 'zod'

export const equipmentValidation = {
  create: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    model: z.string().min(1, 'Model is required').max(255),
    serialNumber: z.string().min(1, 'Serial number is required').max(255),
    manufacturer: z.string().min(1, 'Manufacturer is required').max(255),
    equipmentType: z.enum([
      'ANALYTICAL_BALANCE',
      'PIPETTE',
      'CENTRIFUGE',
      'INCUBATOR',
      'AUTOCLAVE',
      'SPECTROPHOTOMETER',
      'PCR_MACHINE',
      'MICROSCOPE',
      'WATER_BATH',
      'REFRIGERATOR',
      'FREEZER',
      'OTHER'
    ]),
    location: z.string().optional(),
    installDate: z.string().datetime().optional(),
    warrantyExpiry: z.string().datetime().optional(),
    specifications: z.record(z.any()).optional()
  }),
  
  update: z.object({
    name: z.string().min(1).max(255).optional(),
    model: z.string().min(1).max(255).optional(),
    serialNumber: z.string().min(1).max(255).optional(),
    manufacturer: z.string().min(1).max(255).optional(),
    equipmentType: z.enum([
      'ANALYTICAL_BALANCE',
      'PIPETTE',
      'CENTRIFUGE',
      'INCUBATOR',
      'AUTOCLAVE',
      'SPECTROPHOTOMETER',
      'PCR_MACHINE',
      'MICROSCOPE',
      'WATER_BATH',
      'REFRIGERATOR',
      'FREEZER',
      'OTHER'
    ]).optional(),
    location: z.string().optional(),
    installDate: z.string().datetime().optional(),
    warrantyExpiry: z.string().datetime().optional(),
    specifications: z.record(z.any()).optional(),
    status: z.enum([
      'ACTIVE',
      'INACTIVE',
      'MAINTENANCE',
      'CALIBRATION_DUE',
      'OUT_OF_SERVICE',
      'RETIRED'
    ]).optional()
  })
}

export const calibrationValidation = {
  create: z.object({
    equipmentId: z.string().cuid(),
    calibrationType: z.enum([
      'INITIAL',
      'PERIODIC',
      'AFTER_REPAIR',
      'VERIFICATION',
      'INTERIM_CHECK'
    ]),
    scheduledDate: z.string().datetime(),
    dueDate: z.string().datetime(),
    templateId: z.string().cuid().optional(),
    notes: z.string().optional()
  }),
  
  update: z.object({
    performedDate: z.string().datetime().optional(),
    status: z.enum([
      'SCHEDULED',
      'IN_PROGRESS',
      'COMPLETED',
      'OVERDUE',
      'CANCELLED',
      'FAILED'
    ]).optional(),
    results: z.record(z.any()).optional(),
    measurements: z.record(z.any()).optional(),
    environmentalConditions: z.record(z.any()).optional(),
    standardsUsed: z.record(z.any()).optional(),
    complianceStatus: z.enum([
      'COMPLIANT',
      'NON_COMPLIANT',
      'CONDITIONAL',
      'PENDING',
      'UNDER_REVIEW'
    ]).optional(),
    complianceScore: z.number().min(0).max(100).optional(),
    deviations: z.array(z.any()).optional(),
    correctiveActions: z.array(z.any()).optional(),
    certificate: z.string().optional(),
    notes: z.string().optional(),
    aiAnalysis: z.record(z.any()).optional()
  })
}

export const userValidation = {
  register: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required').max(255),
    role: z.enum(['ADMIN', 'SUPERVISOR', 'TECHNICIAN', 'VIEWER']).optional()
  }),
  
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
} 