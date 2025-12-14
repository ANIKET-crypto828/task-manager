import { Response } from 'express';
import { NotificationRepository } from '../repositories/notification.repository';
import { AuthenticatedRequest } from '../types';

const notificationRepo = new NotificationRepository();

export class NotificationController {
  /**
   * Get all notifications for current user
   * GET /api/v1/notifications
   */
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await notificationRepo.findByUserId(
        req.user!.userId
      );
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get unread notifications
   * GET /api/v1/notifications/unread
   */
  async getUnreadNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await notificationRepo.findUnreadByUserId(
        req.user!.userId
      );
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Get unread notifications error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Mark notification as read
   * PUT /api/v1/notifications/:id/read
   */
  async markAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const notification = await notificationRepo.markAsRead(id);
      return res.status(200).json(notification);
    } catch (error) {
      console.error('Mark as read error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/read-all
   */
  async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      await notificationRepo.markAllAsRead(req.user!.userId);
      return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Mark all as read error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete notification
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await notificationRepo.delete(id);
      return res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
      console.error('Delete notification error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}