import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

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
    ip: req.ip
  })

  // Handle different types of errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message
    })
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: error.message
    })
  }

  if (error.name === 'ForbiddenError') {
    return res.status(403).json({
      error: 'Forbidden',
      message: error.message
    })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: error.message
    })
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  })
} 