import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { type User, type LoginCredentials, type RegisterCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Global singleton to prevent multiple auth checks across hot reloads
const globalAuthCheck = {
  inProgress: false,
  lastCheck: 0,
  cachedUser: null as User | null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(globalAuthCheck.cachedUser);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    // Only run once when component first mounts
    if (mounted.current) return;
    mounted.current = true;

    const checkAuth = async () => {
      const now = Date.now();
      
      // If checked within last 10 seconds, use cached result
      if (now - globalAuthCheck.lastCheck < 10000 && globalAuthCheck.cachedUser !== undefined) {
        setUser(globalAuthCheck.cachedUser);
        setLoading(false);
        return;
      }

      // Prevent concurrent checks
      if (globalAuthCheck.inProgress) {
        // Wait for ongoing check to complete
        const checkInterval = setInterval(() => {
          if (!globalAuthCheck.inProgress) {
            clearInterval(checkInterval);
            setUser(globalAuthCheck.cachedUser);
            setLoading(false);
          }
        }, 100);
        return;
      }

      globalAuthCheck.inProgress = true;
      
      try {
        const currentUser = await authService.getCurrentUser();
        globalAuthCheck.cachedUser = currentUser;
        globalAuthCheck.lastCheck = Date.now();
        setUser(currentUser);
      } catch (error) {
        globalAuthCheck.cachedUser = null;
        globalAuthCheck.lastCheck = Date.now();
        setUser(null);
      } finally {
        setLoading(false);
        globalAuthCheck.inProgress = false;
      }
    };

    checkAuth();
  }, []); // Empty dependency array - run only once

  const login = async (credentials: LoginCredentials) => {
    const { user } = await authService.login(credentials);
    globalAuthCheck.cachedUser = user;
    globalAuthCheck.lastCheck = Date.now();
    setUser(user);
  };

  const register = async (credentials: RegisterCredentials) => {
    const { user } = await authService.register(credentials);
    globalAuthCheck.cachedUser = user;
    globalAuthCheck.lastCheck = Date.now();
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    globalAuthCheck.cachedUser = null;
    globalAuthCheck.lastCheck = 0;
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    const updatedUser = await authService.updateProfile(updates);
    globalAuthCheck.cachedUser = updatedUser;
    globalAuthCheck.lastCheck = Date.now();
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
