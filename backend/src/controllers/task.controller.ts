import { Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthenticatedRequest } from '../types';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';
import { z, ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';
import { emitTaskUpdate, emitTaskAssigned } from '../socket';

const prisma = new PrismaClient();
const taskService = new TaskService();

export class TaskController {
  /**
   * Get all tasks with optional filters
   * GET /api/v1/tasks?status=TODO&priority=HIGH
   */
  async getAllTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, priority } = req.query;

      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;

      const tasks = await taskService.getAllTasks(req.user!.userId, filters);

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Get all tasks error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get task by ID
   * GET /api/v1/tasks/:id
   */
  async getTaskById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const task = await taskService.getTaskById(id, req.user!.userId);

      return res.status(200).json(task);
    } catch (error: any) {
      console.error('Get task by ID error:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: 'Task not found' });
      }
      if (error.message === 'Unauthorized access to task') {
        return res.status(403).json({ error: 'Unauthorized access to task' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create new task
   * POST /api/v1/tasks
   */
  async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createTaskSchema.parse(req.body);

      // Convert dueDate string to Date if needed
      const taskData = {
        ...validatedData,
        dueDate: typeof validatedData.dueDate === 'string' 
          ? new Date(validatedData.dueDate) 
          : validatedData.dueDate,
      };

      const task = await taskService.createTask(
        taskData,
        req.user!.userId
      );

      // Emit real-time update
      const io = req.app.get('io');
      emitTaskUpdate(io, task);

      // If task is assigned, create notification and emit
      if (task.assignedToId) {
        const notification = await prisma.notification.create({
          data: {
            userId: task.assignedToId,
            message: `You have been assigned to task: ${task.title}`,
          },
        });

        const userSockets = req.app.get('userSockets');
        emitTaskAssigned(io, userSockets, task.assignedToId, notification);
      }

      // Create audit log
      await prisma.auditLog.create({
        data: {
          taskId: task.id,
          userId: req.user!.userId,
          action: 'CREATED',
          changes: { task },
        },
      });

      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      console.error('Create task error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update task
   * PUT /api/v1/tasks/:id
   */
  async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateTaskSchema.parse(req.body);

      // Get old task data for audit log
      const oldTask = await taskService.getTaskById(id, req.user!.userId);

      // Convert dueDate string to Date if needed
      const taskData: any = { ...validatedData };
      if (taskData.dueDate && typeof taskData.dueDate === 'string') {
        taskData.dueDate = new Date(taskData.dueDate);
      }

      const task = await taskService.updateTask(
        id,
        taskData,
        req.user!.userId
      );

      // Emit real-time update
      const io = req.app.get('io');
      emitTaskUpdate(io, task);

      // If assignee changed, create notification
      if (
        validatedData.assignedToId &&
        validatedData.assignedToId !== oldTask.assignedToId
      ) {
        const notification = await prisma.notification.create({
          data: {
            userId: validatedData.assignedToId,
            message: `You have been assigned to task: ${task.title}`,
          },
        });

        const userSockets = req.app.get('userSockets');
        emitTaskAssigned(io, userSockets, validatedData.assignedToId, notification);
      }

      // Create audit log
      await prisma.auditLog.create({
        data: {
          taskId: task.id,
          userId: req.user!.userId,
          action: 'UPDATED',
          changes: {
            old: oldTask,
            new: task,
          },
        },
      });

      return res.status(200).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      console.error('Update task error:', error);
      if ((error as any).message === 'Task not found') {
        return res.status(404).json({ error: 'Task not found' });
      }
      if ((error as any).message === 'Unauthorized access to task') {
        return res.status(403).json({ error: 'Unauthorized access to task' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete task
   * DELETE /api/v1/tasks/:id
   */
  async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      await taskService.deleteTask(id, req.user!.userId);

      // Emit real-time update
      const io = req.app.get('io');
      io.emit('task:deleted', { id });

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      console.error('Delete task error:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: 'Task not found' });
      }
      if (error.message === 'Only task creator can delete the task') {
        return res.status(403).json({ error: 'Only task creator can delete the task' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get tasks assigned to current user
   * GET /api/v1/tasks/assigned
   */
  async getAssignedTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await taskService.getAssignedTasks(req.user!.userId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Get assigned tasks error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get tasks created by current user
   * GET /api/v1/tasks/created
   */
  async getCreatedTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await taskService.getCreatedTasks(req.user!.userId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Get created tasks error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get overdue tasks
   * GET /api/v1/tasks/overdue
   */
  async getOverdueTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await taskService.getOverdueTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Get overdue tasks error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}