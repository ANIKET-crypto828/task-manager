import { Priority, Status } from '@prisma/client';
import { Request } from 'express';

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status?: Status;
  assignedToId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  status?: Status;
  assignedToId?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

// Fixed: extend from express.Request instead of Express.Request
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}