import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class EquipmentController {
  static async getEquipment(req: Request, res: Response) {
    const prisma = new PrismaClient(); // Create instance inside method
    try {
      const { laboratoryId } = req.user!;
      
      const equipment = await prisma.equipment.findMany({
        where: { laboratoryId },
        include: {
          calibrationRecords: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });
      
      res.json(equipment);
      
    } catch (error: any) {
      console.error('Error getting equipment:', error);
      res.status(500).json({ error: 'Failed to get equipment' });
    } finally {
      await prisma.$disconnect(); // Always disconnect
    }
  }
  
  static async createEquipment(req: Request, res: Response) {
    const prisma = new PrismaClient(); // Create instance inside method
    try {
      const { laboratoryId } = req.user!;
      const { name, model, manufacturer, serialNumber, location, specifications } = req.body;
      
      const equipment = await prisma.equipment.create({
        data: {
          name,
          model,
          manufacturer,
          serialNumber,
          location,
          specifications: JSON.stringify(specifications || {}),
          laboratoryId
        }
      });
      
      res.status(201).json(equipment);
      
    } catch (error: any) {
      console.error('Error creating equipment:', error);
      res.status(500).json({ error: 'Failed to create equipment' });
    } finally {
      await prisma.$disconnect(); // Always disconnect
    }
  }
} 