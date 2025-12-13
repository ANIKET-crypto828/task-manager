import { PrismaClient, Task, Priority, Status } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId?: string;
  }): Promise<Task> {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll(filters?: {
    status?: Status;
    priority?: Priority;
    creatorId?: string;
    assignedToId?: string;
  }) {
    return prisma.task.findMany({
      where: filters,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }

  async findOverdue(): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: Status.COMPLETED },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }
}