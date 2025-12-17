import { taskService } from '../../services/task.service';
import { Task, CreateTaskDto, UpdateTaskDto, Priority, Status } from '../../types';

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-12-31T23:59:59Z',
    priority: Priority.HIGH,
    status: Status.TODO,
    creatorId: 'user1',
    assignedToId: 'user2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    creator: {
      id: 'user1',
      name: 'Creator User',
      email: 'creator@example.com',
    },
    assignedTo: {
      id: 'user2',
      name: 'Assigned User',
      email: 'assigned@example.com',
    },
  };

  describe('getTasks', () => {
    it('should fetch all tasks without filters', async () => {
      const mockTasks = [mockTask];
      mockApi.get.mockResolvedValue({ data: mockTasks });

      const result = await taskService.getTasks();

      expect(mockApi.get).toHaveBeenCalledWith('/tasks', { params: undefined });
      expect(result).toEqual(mockTasks);
      expect(result).toHaveLength(1);
    });

    it('should fetch tasks with status filter', async () => {
      const mockTasks = [mockTask];
      const filters = { status: 'TODO' };
      
      mockApi.get.mockResolvedValue({ data: mockTasks });

      const result = await taskService.getTasks(filters);

      expect(mockApi.get).toHaveBeenCalledWith('/tasks', { params: filters });
      expect(result).toEqual(mockTasks);
    });

    it('should fetch tasks with priority filter', async () => {
      const mockTasks = [mockTask];
      const filters = { priority: 'HIGH' };
      
      mockApi.get.mockResolvedValue({ data: mockTasks });

      const result = await taskService.getTasks(filters);

      expect(mockApi.get).toHaveBeenCalledWith('/tasks', { params: filters });
      expect(result).toEqual(mockTasks);
    });

    it('should return empty array when no tasks found', async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      const result = await taskService.getTasks();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getTaskById', () => {
    it('should fetch a single task by id', async () => {
      mockApi.get.mockResolvedValue({ data: mockTask });

      const result = await taskService.getTaskById('1');

      expect(mockApi.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTask);
      expect(result.id).toBe('1');
    });

    it('should throw error for non-existent task', async () => {
      mockApi.get.mockRejectedValue({
        response: { status: 404, data: { error: 'Task not found' } },
      });

      await expect(taskService.getTaskById('999')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const newTask: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2024-12-31T23:59:59Z',
        priority: Priority.MEDIUM,
        status: Status.TODO,
        assignedToId: 'user2',
      };

      mockApi.post.mockResolvedValue({ data: mockTask });

      const result = await taskService.createTask(newTask);

      expect(mockApi.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(result).toEqual(mockTask);
    });

    it('should create task without optional fields', async () => {
      const newTask: CreateTaskDto = {
        title: 'Minimal Task',
        description: 'Minimal Description',
        dueDate: '2024-12-31T23:59:59Z',
        priority: Priority.LOW,
      };

      mockApi.post.mockResolvedValue({ data: { ...mockTask, assignedTo: undefined } });

      const result = await taskService.createTask(newTask);

      expect(mockApi.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(result.assignedTo).toBeUndefined();
    });

    it('should validate required fields', async () => {
      const invalidTask = {
        title: '',
        description: 'Description',
        dueDate: '2024-12-31T23:59:59Z',
        priority: Priority.LOW,
      } as CreateTaskDto;

      mockApi.post.mockRejectedValue({
        response: { status: 400, data: { error: 'Title is required' } },
      });

      await expect(taskService.createTask(invalidTask)).rejects.toMatchObject({
        response: { status: 400 },
      });
    });
  });

  describe('updateTask', () => {
    it('should update task status', async () => {
      const updates: UpdateTaskDto = { status: Status.COMPLETED };
      const updatedTask = { ...mockTask, status: Status.COMPLETED };

      mockApi.put.mockResolvedValue({ data: updatedTask });

      const result = await taskService.updateTask('1', updates);

      expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', updates);
      expect(result.status).toBe(Status.COMPLETED);
    });

    it('should update multiple fields', async () => {
      const updates: UpdateTaskDto = {
        title: 'Updated Title',
        priority: Priority.URGENT,
        status: Status.IN_PROGRESS,
      };
      const updatedTask = { ...mockTask, ...updates };

      mockApi.put.mockResolvedValue({ data: updatedTask });

      const result = await taskService.updateTask('1', updates);

      expect(result.title).toBe('Updated Title');
      expect(result.priority).toBe(Priority.URGENT);
      expect(result.status).toBe(Status.IN_PROGRESS);
    });

    it('should handle update errors', async () => {
      const updates: UpdateTaskDto = { status: Status.COMPLETED };

      mockApi.put.mockRejectedValue({
        response: { status: 403, data: { error: 'Unauthorized' } },
      });

      await expect(taskService.updateTask('1', updates)).rejects.toMatchObject({
        response: { status: 403 },
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockApi.delete.mockResolvedValue({ data: {} });

      await taskService.deleteTask('1');

      expect(mockApi.delete).toHaveBeenCalledWith('/tasks/1');
    });

    it('should handle delete errors', async () => {
      mockApi.delete.mockRejectedValue({
        response: { status: 404, data: { error: 'Task not found' } },
      });

      await expect(taskService.deleteTask('999')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('getAssignedTasks', () => {
    it('should fetch tasks assigned to current user', async () => {
      const assignedTasks = [mockTask];
      mockApi.get.mockResolvedValue({ data: assignedTasks });

      const result = await taskService.getAssignedTasks();

      expect(mockApi.get).toHaveBeenCalledWith('/tasks/assigned');
      expect(result).toEqual(assignedTasks);
    });
  });

  describe('getOverdueTasks', () => {
    it('should fetch overdue tasks', async () => {
      const overdueTask = {
        ...mockTask,
        dueDate: '2023-01-01T00:00:00Z',
      };
      mockApi.get.mockResolvedValue({ data: [overdueTask] });

      const result = await taskService.getOverdueTasks();

      expect(mockApi.get).toHaveBeenCalledWith('/tasks/overdue');
      expect(result).toHaveLength(1);
    });
  });
});
