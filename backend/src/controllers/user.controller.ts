import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export class UserController {
  /**
   * Get all users (for assignment dropdown)
   * GET /api/v1/users
   */
  async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  async getUserById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}