import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  const userSockets = new Map<string, string>();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return { io, userSockets };
};

export const emitTaskUpdate = (
  io: SocketServer,
  task: any
) => {
  io.emit('task:updated', task);
};

export const emitTaskAssigned = (
  io: SocketServer,
  userSockets: Map<string, string>,
  userId: string,
  notification: any
) => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit('task:assigned', notification);
  }
};