import { PrismaClient, Notification } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationRepository {
  async create(data: {
    userId: string;
    message: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.notification.delete({
      where: { id },
    });
  }
}