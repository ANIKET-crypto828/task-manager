import { useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { mutate } from 'swr';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current?.emit('register', user.id);
    });

    // Listen for task updates
    socketRef.current.on('task:updated', (task) => {
      console.log('Task updated:', task);
      // Revalidate all task-related SWR caches
      mutate((key) => typeof key === 'string' && key.includes('task'));
    });

    // Listen for task assignments
    socketRef.current.on('task:assigned', (notification) => {
      console.log('Task assigned:', notification);
      // Show notification and revalidate
      mutate('assigned-tasks');
      mutate('notifications');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};