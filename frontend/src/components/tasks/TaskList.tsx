import React, { useState } from 'react';
import { useTasks, useTaskMutations } from '../../hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskSkeleton } from './TaskSkeleton';
import { Priority, Status, type CreateTaskDto, type Task } from '../../types';
import { Plus } from 'lucide-react';
import { mutate } from 'swr';

export const TaskList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, isLoading, error } = useTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const { createTask, updateTask } = useTaskMutations();

  const handleCreateTask = async (data: CreateTaskDto) => {
    await createTask(data);
    await mutate(['tasks', { status: statusFilter, priority: priorityFilter }]);
    setShowForm(false);
  };

  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      await mutate(['tasks', { status: statusFilter, priority: priorityFilter }]);
      setEditingTask(null);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={Status.TODO}>To Do</option>
              <option value={Status.IN_PROGRESS}>In Progress</option>
              <option value={Status.REVIEW}>Review</option>
              <option value={Status.COMPLETED}>Completed</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
              <option value={Priority.URGENT}>Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setEditingTask(task)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}

      {showForm && (
        <TaskForm
          mode="create"
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          mode="edit"
          initialData={{
            title: editingTask.title,
            description: editingTask.description,
            dueDate: editingTask.dueDate,
            priority: editingTask.priority,
            status: editingTask.status,
            assignedToId: editingTask.assignedToId,
          }}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};