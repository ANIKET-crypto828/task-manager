import React from 'react';
import { type Task } from '../../types';
import { formatDate, isOverdue } from '../../utils/date';
import { getPriorityBadge } from '../../utils/priority';
import { getStatusColor, getStatusLabel } from '../../utils/status';
import { Calendar, User, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const overdue = isOverdue(task.dueDate) && task.status !== 'COMPLETED';

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg shadow-sm border-2 p-5 cursor-pointer transition-all hover:shadow-md',
        overdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-300'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
          {task.title}
        </h3>
        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', getPriorityBadge(task.priority))}>
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        
        {task.assignedTo && (
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            <span>{task.assignedTo.name}</span>
          </div>
        )}

        {overdue && (
          <div className="flex items-center text-sm text-red-600 font-medium">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Overdue</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', getStatusColor(task.status))}>
          {getStatusLabel(task.status)}
        </span>
        <span className="text-xs text-gray-400">
          Created by {task.creator.name}
        </span>
      </div>
    </div>
  );
};