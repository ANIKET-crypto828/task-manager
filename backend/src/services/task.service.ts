import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto } from '../types';
import { Status } from '@prisma/client';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Creates a new task with validation
   * @param data - Task creation data
   * @param creatorId - ID of the user creating the task
   * @returns Created task object
   */
  async createTask(data: CreateTaskDto, creatorId: string) {
    const taskData = {
      ...data,
      dueDate: new Date(data.dueDate),
      status: data.status || Status.TODO,
      creatorId,
    };

    return this.taskRepository.create(taskData);
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.taskRepository.findById(id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access to this task
    if (task.creatorId !== userId && task.assignedToId !== userId) {
      throw new Error('Unauthorized access to task');
    }

    return task;
  }

  async getAllTasks(userId: string, filters?: any) {
    return this.taskRepository.findAll(filters);
  }

  async updateTask(id: string, data: UpdateTaskDto, userId: string) {
    const task = await this.getTaskById(id, userId);
    
    const updateData: any = { ...data };
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    return this.taskRepository.update(id, updateData);
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.getTaskById(id, userId);
    
    if (task.creatorId !== userId) {
      throw new Error('Only task creator can delete the task');
    }

    await this.taskRepository.delete(id);
  }

  async getAssignedTasks(userId: string) {
    return this.taskRepository.findAll({ assignedToId: userId });
  }

  async getCreatedTasks(userId: string) {
    return this.taskRepository.findAll({ creatorId: userId });
  }

  async getOverdueTasks() {
    return this.taskRepository.findOverdue();
  }
}