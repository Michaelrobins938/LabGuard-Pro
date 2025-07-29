import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'
import { Prisma } from '@prisma/client'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // API Error (custom)
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    })
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Record already exists',
          field: error.meta?.target
        })
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found'
        })
      case 'P2003':
        return res.status(400).json({
          error: 'Foreign key constraint failed'
        })
      default:
        return res.status(400).json({
          error: 'Database operation failed',
          code: error.code
        })
    }
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.message
    })
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    })
  }

  // Default server error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  })
} 