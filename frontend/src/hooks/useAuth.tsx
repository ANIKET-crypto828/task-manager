import { useState, useEffect, createContext, useContext } from 'react';
import { type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { type User, type LoginCredentials, type RegisterCredentials } from '../types';
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    // Skip auth check on public routes
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    // Prevent duplicate checks
    if (globalAuthCheck.inProgress) {
      console.log('[Auth] Check already in progress');
      return;
    }

    const checkAuth = async () => {
      // Use cached user if available and recent (within 5 minutes)
      const cacheAge = Date.now() - globalAuthCheck.lastCheck;
      if (globalAuthCheck.cachedUser && cacheAge < 300000) {
        console.log('[Auth] Using cached user');
        setUser(globalAuthCheck.cachedUser);
        setLoading(false);
        return;
      }

      try {
        globalAuthCheck.inProgress = true;
        console.log('[Auth] Checking authentication...');
        
        const currentUser = await authService.getCurrentUser();
        console.log('[Auth] User authenticated:', currentUser.email);
        
        globalAuthCheck.cachedUser = currentUser;
        globalAuthCheck.lastCheck = Date.now();
        setUser(currentUser);
      } catch (error: any) {
        console.error('[Auth] Authentication failed:', error.response?.status || error.message);
        
        globalAuthCheck.cachedUser = null;
        globalAuthCheck.lastCheck = 0;
        setUser(null);
        
        // Only redirect to login if we're on a protected route
        if (!isPublicRoute) {
          console.log('[Auth] Redirecting to login...');
          navigate('/login', { replace: true });
        }
      } finally {
        globalAuthCheck.inProgress = false;
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  const login = async (credentials: LoginCredentials) => {
    console.log('[Auth] Logging in...');
    const { user } = await authService.login(credentials);
    globalAuthCheck.cachedUser = user;
    globalAuthCheck.lastCheck = Date.now();
    setUser(user);
    console.log('[Auth] Login successful:', user.email);
  };

  const register = async (credentials: RegisterCredentials) => {
    console.log('[Auth] Registering...');
    const { user } = await authService.register(credentials);
    globalAuthCheck.cachedUser = user;
    globalAuthCheck.lastCheck = Date.now();
    setUser(user);
    console.log('[Auth] Registration successful:', user.email);
  };

  const logout = async () => {
    console.log('[Auth] Logging out...');
    await authService.logout();
    globalAuthCheck.cachedUser = null;
    globalAuthCheck.lastCheck = 0;
    setUser(null);
    navigate('/login', { replace: true });
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