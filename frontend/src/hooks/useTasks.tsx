import useSWR from 'swr';
import { taskService } from '../services/task.service';
import { type Task, type CreateTaskDto, type UpdateTaskDto } from '../types';

export const useTasks = (filters?: { status?: string; priority?: string }) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['tasks', filters],
    () => taskService.getTasks(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data,
    isLoading,
    error,
    mutate,
  };
};

export const useTask = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `task-${id}` : null,
    () => taskService.getTaskById(id)
  );

  return {
    task: data,
    isLoading,
    error,
    mutate,
  };
};

export const useTaskMutations = () => {
  const createTask = async (task: CreateTaskDto) => {
    return await taskService.createTask(task);
  };

  const updateTask = async (id: string, updates: UpdateTaskDto) => {
    return await taskService.updateTask(id, updates);
  };

  const deleteTask = async (id: string) => {
    await taskService.deleteTask(id);
  };

  return {
    createTask,
    updateTask,
    deleteTask,
  };
};

export const useAssignedTasks = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'assigned-tasks',
    taskService.getAssignedTasks
  );

  return { tasks: data, isLoading, error, mutate };
};

export const useCreatedTasks = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'created-tasks',
    taskService.getCreatedTasks
  );

  return { tasks: data, isLoading, error, mutate };
};

export const useOverdueTasks = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'overdue-tasks',
    taskService.getOverdueTasks
  );

  return { tasks: data, isLoading, error, mutate };
};