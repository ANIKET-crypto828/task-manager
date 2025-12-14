import { api } from './api';
import { Task, CreateTaskDto, UpdateTaskDto, User } from '../types';

export const taskService = {
  async getTasks(filters?: { status?: string; priority?: string }): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks', { params: filters });
    return data;
  },

  async getTaskById(id: string): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  async createTask(task: CreateTaskDto): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', task);
    return data;
  },

  async updateTask(id: string, updates: UpdateTaskDto): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, updates);
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getAssignedTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks/assigned');
    return data;
  },

  async getCreatedTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks/created');
    return data;
  },

  async getOverdueTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks/overdue');
    return data;
  }
};

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  }
};