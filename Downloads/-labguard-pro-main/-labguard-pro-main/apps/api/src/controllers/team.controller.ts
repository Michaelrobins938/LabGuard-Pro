import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']).default('USER')
});

export class TeamController {
  static async getTeamMembers(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
      const { laboratoryId } = req.user!;
      
      const members = await prisma.user.findMany({
        where: { laboratoryId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true
        }
      });
      
      res.json(members);
    } catch (error: any) {
      console.error('Error getting team members:', error);
      res.status(500).json({ error: 'Failed to get team members' });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  static async inviteUser(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
      const { laboratoryId, userId } = req.user!;
      const { email, role } = inviteUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // For now, create invitation record (in real app, send email)
      const invitation = {
        id: Date.now().toString(),
        email,
        role,
        laboratoryId,
        invitedBy: userId,
        status: 'PENDING',
        createdAt: new Date()
      };
      
      // TODO: Send invitation email
      console.log('Invitation created:', invitation);
      
      res.status(201).json({ 
        message: 'Invitation sent successfully',
        invitation 
      });
    } catch (error: any) {
      console.error('Error inviting user:', error);
      res.status(500).json({ error: 'Failed to send invitation' });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  static async updateUserRole(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
      const { laboratoryId } = req.user!;
      const { userId } = req.params;
      const { role } = req.body;
      
      const user = await prisma.user.findFirst({
        where: { 
          id: userId,
          laboratoryId 
        }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true
        }
      });
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    } finally {
      await prisma.$disconnect();
    }
  }
} 