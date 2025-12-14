import { format, isAfter, isBefore, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const isOverdue = (dueDate: string): boolean => {
  return isBefore(parseISO(dueDate), new Date());
};

export const getDateInputValue = (date: string | Date): string => {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
};