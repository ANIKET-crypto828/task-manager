import { Status } from '../types';

export const getStatusColor = (status: Status): string => {
  const colors = {
    [Status.TODO]: 'bg-gray-100 text-gray-800',
    [Status.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [Status.REVIEW]: 'bg-purple-100 text-purple-800',
    [Status.COMPLETED]: 'bg-green-100 text-green-800',
  };
  return colors[status];
};

export const getStatusLabel = (status: Status): string => {
  const labels = {
    [Status.TODO]: 'To Do',
    [Status.IN_PROGRESS]: 'In Progress',
    [Status.REVIEW]: 'Review',
    [Status.COMPLETED]: 'Completed',
  };
  return labels[status];
};