export class ApiError extends Error {
  public statusCode: number
  public code?: string

  constructor(statusCode: number, message: string, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'ApiError'

    Error.captureStackTrace(this, this.constructor)
  }
}

export const createApiError = {
  badRequest: (message: string, code?: string) => new ApiError(400, message, code),
  unauthorized: (message: string = 'Unauthorized', code?: string) => new ApiError(401, message, code),
  forbidden: (message: string = 'Forbidden', code?: string) => new ApiError(403, message, code),
  notFound: (message: string = 'Not found', code?: string) => new ApiError(404, message, code),
  conflict: (message: string, code?: string) => new ApiError(409, message, code),
  internal: (message: string = 'Internal server error', code?: string) => new ApiError(500, message, code)
} 