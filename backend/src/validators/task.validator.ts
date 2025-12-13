import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string().datetime().or(z.date()),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status).optional(),
  assignedToId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.string().datetime().or(z.date()).optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  assignedToId: z.string().uuid().optional().nullable(),
});