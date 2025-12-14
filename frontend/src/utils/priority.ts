import { Priority } from '../types';

export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    [Priority.LOW]: 'bg-gray-100 text-gray-800',
    [Priority.MEDIUM]: 'bg-blue-100 text-blue-800',
    [Priority.HIGH]: 'bg-orange-100 text-orange-800',
    [Priority.URGENT]: 'bg-red-100 text-red-800',
  };
  return colors[priority];
};

export const getPriorityBadge = (priority: Priority): string => {
  const badges = {
    [Priority.LOW]: 'bg-gray-200 text-gray-700',
    [Priority.MEDIUM]: 'bg-blue-200 text-blue-700',
    [Priority.HIGH]: 'bg-orange-200 text-orange-700',
    [Priority.URGENT]: 'bg-red-200 text-red-700',
  };
  return badges[priority];
};