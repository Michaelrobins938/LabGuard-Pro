import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class BiomniController {
  static async executeQuery(req: Request, res: Response) {
    const prisma = new PrismaClient(); // Create instance inside method
    try {
      const { userId } = req.user!;
      const { query } = req.body;
      
      // Create query record
      const biomniQuery = await prisma.biomniQuery.create({
        data: {
          userId,
          query,
          status: 'EXECUTING'
        }
      });
      
      // Simulate AI processing
      const response = `AI response to: ${query}`;
      
      // Update query with response
      const updatedQuery = await prisma.biomniQuery.update({
        where: { id: biomniQuery.id },
        data: {
          response,
          status: 'COMPLETED'
        }
      });
      
      res.json(updatedQuery);
      
    } catch (error: any) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Failed to execute query' });
    } finally {
      await prisma.$disconnect(); // Always disconnect
    }
  }
  
  static async generateProtocol(req: Request, res: Response) {
    const prisma = new PrismaClient(); // Create instance inside method
    try {
      const { userId } = req.user!;
      const { equipmentType, requirements } = req.body;
      
      const query = `Generate calibration protocol for ${equipmentType} with requirements: ${requirements}`;
      
      // Create query record
      const biomniQuery = await prisma.biomniQuery.create({
        data: {
          userId,
          query,
          status: 'EXECUTING'
        }
      });
      
      // Simulate protocol generation
      const response = `Generated protocol for ${equipmentType}:\n1. Safety checks\n2. Calibration steps\n3. Verification process`;
      
      // Update query with response
      const updatedQuery = await prisma.biomniQuery.update({
        where: { id: biomniQuery.id },
        data: {
          response,
          status: 'COMPLETED'
        }
      });
      
      res.json(updatedQuery);
      
    } catch (error: any) {
      console.error('Error generating protocol:', error);
      res.status(500).json({ error: 'Failed to generate protocol' });
    } finally {
      await prisma.$disconnect(); // Always disconnect
    }
  }
} 