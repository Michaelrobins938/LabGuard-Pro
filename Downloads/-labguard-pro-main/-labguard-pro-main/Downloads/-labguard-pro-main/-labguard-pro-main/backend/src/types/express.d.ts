import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
        laboratoryId: string
      }
    }
  }
}

export {} 