import { createTaskSchema, updateTaskSchema } from '../../validators/task.validator';
import { Priority, Status } from '@prisma/client';

describe('Task Validators', () => {
  describe('createTaskSchema', () => {
    it('should validate correct task data', () => {
      const validTask = {
        title: 'Valid Task',
        description: 'Valid description',
        dueDate: '2025-12-31T00:00:00Z',
        priority: Priority.HIGH,
        status: Status.TODO,
      };

      const result = createTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidTask = {
        title: '',
        description: 'Description',
        dueDate: '2025-12-31T00:00:00Z',
        priority: Priority.HIGH,
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject title exceeding 100 characters', () => {
      const invalidTask = {
        title: 'a'.repeat(101),
        description: 'Description',
        dueDate: '2025-12-31T00:00:00Z',
        priority: Priority.HIGH,
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject invalid priority', () => {
      const invalidTask = {
        title: 'Task',
        description: 'Description',
        dueDate: '2025-12-31T00:00:00Z',
        priority: 'INVALID',
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should accept optional assignedToId', () => {
      const validTask = {
        title: 'Task',
        description: 'Description',
        dueDate: '2025-12-31T00:00:00Z',
        priority: Priority.MEDIUM,
        assignedToId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = createTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID for assignedToId', () => {
      const invalidTask = {
        title: 'Task',
        description: 'Description',
        dueDate: '2025-12-31T00:00:00Z',
        priority: Priority.MEDIUM,
        assignedToId: 'invalid-uuid',
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('updateTaskSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        title: 'Updated Title',
      };

      const result = updateTaskSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow updating multiple fields', () => {
      const multiUpdate = {
        title: 'Updated Title',
        status: Status.IN_PROGRESS,
        priority: Priority.URGENT,
      };

      const result = updateTaskSchema.safeParse(multiUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow null for assignedToId', () => {
      const update = {
        assignedToId: null,
      };

      const result = updateTaskSchema.safeParse(update);
      expect(result.success).toBe(true);
    });
  });
});
