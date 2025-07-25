import { z } from 'zod'

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(254, 'Email is too long')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number is too short')
  .max(20, 'Phone number is too long')

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL is too long')

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255) // Limit length
}

// Input validation with sanitization
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  options?: { sanitize?: boolean }
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    let processedInput = input

    // Sanitize string inputs if requested
    if (options?.sanitize && typeof input === 'string') {
      processedInput = sanitizeString(input)
    }

    const result = schema.safeParse(processedInput)
    
    if (result.success) {
      return { success: true, data: result.data }
    } else {
      return { 
        success: false, 
        errors: result.error.errors.map(err => err.message) 
      }
    }
  } catch (error) {
    return { 
      success: false, 
      errors: ['Validation failed'] 
    }
  }
}

// API request validation
export const apiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  headers: z.record(z.string()).optional(),
  body: z.unknown().optional(),
  query: z.record(z.string()).optional(),
})

export function validateApiRequest(input: unknown) {
  return validateAndSanitize(apiRequestSchema, input)
}

// User input validation
export const userInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema.optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  company: z.string().max(200).optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPERVISOR']).optional(),
})

export function validateUserInput(input: unknown) {
  return validateAndSanitize(userInputSchema, input, { sanitize: true })
}

// Equipment validation
export const equipmentSchema = z.object({
  name: z.string().min(1).max(200),
  serialNumber: z.string().min(1).max(100),
  model: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED']),
  lastCalibration: z.string().datetime().optional(),
  nextCalibration: z.string().datetime().optional(),
})

export function validateEquipmentInput(input: unknown) {
  return validateAndSanitize(equipmentSchema, input, { sanitize: true })
}

// AI chat validation
export const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000),
    timestamp: z.number().optional(),
  })),
  stream: z.boolean().optional(),
  tools: z.array(z.unknown()).optional(),
})

export function validateChatInput(input: unknown) {
  return validateAndSanitize(chatMessageSchema, input, { sanitize: true })
}

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimetype: z.string().regex(/^[a-zA-Z0-9]+\/[a-zA-Z0-9.-]+$/),
  size: z.number().min(1).max(10 * 1024 * 1024), // 10MB max
})

export function validateFileUpload(input: unknown) {
  return validateAndSanitize(fileUploadSchema, input)
}

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(500),
  page: z.number().min(1).max(1000).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort: z.string().max(50).optional(),
  filter: z.record(z.unknown()).optional(),
})

export function validateSearchQuery(input: unknown) {
  return validateAndSanitize(searchQuerySchema, input, { sanitize: true })
}

// Rate limiting validation
export const rateLimitSchema = z.object({
  ip: z.string().ip().optional(),
  userId: z.string().uuid().optional(),
  endpoint: z.string().min(1).max(200),
  timestamp: z.number(),
})

export function validateRateLimitInput(input: unknown) {
  return validateAndSanitize(rateLimitSchema, input)
}

// XSS prevention
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// SQL injection prevention (basic)
export function escapeSql(text: string): string {
  return text
    .replace(/'/g, "''")
    .replace(/--/g, '')
    .replace(/;/, '')
    .replace(/\/\*/, '')
    .replace(/\*\//, '')
}

// CSRF token validation
export function validateCsrfToken(token: string, sessionToken?: string): boolean {
  if (!token || !sessionToken) return false
  return token === sessionToken
}

// Input length validation
export function validateInputLength(input: string, min: number, max: number): boolean {
  const length = input.trim().length
  return length >= min && length <= max
}

// File type validation
export const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

export function validateFileType(mimetype: string): boolean {
  return allowedFileTypes.includes(mimetype)
}

// Export all schemas for use in API routes
export const schemas = {
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  url: urlSchema,
  user: userInputSchema,
  equipment: equipmentSchema,
  chat: chatMessageSchema,
  file: fileUploadSchema,
  search: searchQuerySchema,
  rateLimit: rateLimitSchema,
} 