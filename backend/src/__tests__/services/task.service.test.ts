import { TaskService } from '../../services/task.service';
import { TaskRepository } from '../../repositories/task.repository';
import { Status, Priority } from '@prisma/client';
import { CreateTaskDto } from '../../types';

jest.mock('../../repositories/task.repository');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
    taskService = new TaskService();
    (taskService as any).taskRepository = mockTaskRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2025-12-31'),
        priority: Priority.HIGH,
        status: Status.TODO,
      };

      const creatorId = 'user-123';
      const expectedTask = {
        id: 'task-123',
        ...createTaskDto,
        creatorId,
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(expectedTask as any);

      const result = await taskService.createTask(createTaskDto, creatorId);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createTaskDto.title,
          description: createTaskDto.description,
          priority: createTaskDto.priority,
          creatorId,
        })
      );
      expect(result).toEqual(expectedTask);
    });

    it('should set default status to TODO if not provided', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2025-12-31'),
        priority: Priority.MEDIUM,
      };

      mockTaskRepository.create.mockResolvedValue({} as any);

      await taskService.createTask(createTaskDto, 'user-123');

      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: Status.TODO,
        })
      );
    });
  });

  describe('getTaskById', () => {
    it('should return task when user is the creator', async () => {
      const userId = 'user-123';
      const task = {
        id: 'task-123',
        title: 'Test Task',
        creatorId: userId,
        assignedToId: null,
      };

      mockTaskRepository.findById.mockResolvedValue(task as any);

      const result = await taskService.getTaskById('task-123', userId);

      expect(result).toEqual(task);
    });

    it('should return task when user is assigned', async () => {
      const userId = 'user-123';
      const task = {
        id: 'task-123',
        title: 'Test Task',
        creatorId: 'user-456',
        assignedToId: userId,
      };

      mockTaskRepository.findById.mockResolvedValue(task as any);

      const result = await taskService.getTaskById('task-123', userId);

      expect(result).toEqual(task);
    });

    it('should throw error when task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(
        taskService.getTaskById('task-123', 'user-123')
      ).rejects.toThrow('Task not found');
    });

    it('should throw error when user has no access', async () => {
      const task = {
        id: 'task-123',
        title: 'Test Task',
        creatorId: 'user-456',
        assignedToId: 'user-789',
      };

      mockTaskRepository.findById.mockResolvedValue(task as any);

      await expect(
        taskService.getTaskById('task-123', 'user-999')
      ).rejects.toThrow('Unauthorized access to task');
    });
  });

  describe('updateTask', () => {
    it('should update task with valid data', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const updateDto = {
        title: 'Updated Task',
        status: Status.IN_PROGRESS,
      };

      const existingTask = {
        id: taskId,
        creatorId: userId,
        assignedToId: null,
      };

      const updatedTask = {
        ...existingTask,
        ...updateDto,
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask as any);
      mockTaskRepository.update.mockResolvedValue(updatedTask as any);

      const result = await taskService.updateTask(taskId, updateDto, userId);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        taskId,
        expect.objectContaining(updateDto)
      );
      expect(result).toEqual(updatedTask);
    });

    it('should convert dueDate string to Date object', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const dueDateString = '2025-12-31';

      mockTaskRepository.findById.mockResolvedValue({
        id: taskId,
        creatorId: userId,
      } as any);
      mockTaskRepository.update.mockResolvedValue({} as any);

      await taskService.updateTask(
        taskId,
        { dueDate: dueDateString as any },
        userId
      );

      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        taskId,
        expect.objectContaining({
          dueDate: new Date(dueDateString),
        })
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete task when user is creator', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const task = {
        id: taskId,
        creatorId: userId,
      };

      mockTaskRepository.findById.mockResolvedValue(task as any);
      mockTaskRepository.delete.mockResolvedValue();

      await taskService.deleteTask(taskId, userId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw error when user is not creator (unauthorized user)', async () => {
      const taskId = 'task-123';
      const task = {
        id: taskId,
        creatorId: 'user-456',
        assignedToId: null,
      };

      mockTaskRepository.findById.mockResolvedValue(task as any);

      await expect(
        taskService.deleteTask(taskId, 'user-123')
      ).rejects.toThrow('Unauthorized access to task');

      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw error when task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(
        taskService.deleteTask('task-123', 'user-123')
      ).rejects.toThrow('Task not found');

      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw error when assignee tries to delete task', async () => {
      const taskId = 'task-123';
      const assigneeId = 'user-123';
      const task = {
        id: taskId,
        creatorId: 'user-456',
        assignedToId: assigneeId,
      };

      mockTaskRepository.findById.mockResolvedValue(task as any);

      await expect(
        taskService.deleteTask(taskId, assigneeId)
      ).rejects.toThrow('Only task creator can delete the task');

      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getAssignedTasks', () => {
    it('should return tasks assigned to user', async () => {
      const userId = 'user-123';
      const tasks = [
        { id: 'task-1', assignedToId: userId },
        { id: 'task-2', assignedToId: userId },
      ];

      mockTaskRepository.findAll.mockResolvedValue(tasks as any);

      const result = await taskService.getAssignedTasks(userId);

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
        assignedToId: userId,
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('getOverdueTasks', () => {
    it('should return overdue tasks', async () => {
      const overdueTasks = [
        { id: 'task-1', dueDate: new Date('2025-01-01') },
        { id: 'task-2', dueDate: new Date('2025-02-01') },
      ];

      mockTaskRepository.findOverdue.mockResolvedValue(overdueTasks as any);

      const result = await taskService.getOverdueTasks();

      expect(mockTaskRepository.findOverdue).toHaveBeenCalled();
      expect(result).toEqual(overdueTasks);
    });
  });
});