// services/notification.service.ts
import { api } from './api';
import { type Notification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications');
    return data;
  },

  async getUnreadNotifications(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications/unread');
    return data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const { data } = await api.put<Notification>(`/notifications/${id}/read`);
    return data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }
};