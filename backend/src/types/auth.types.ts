import { Request } from 'express';

// Extend Express Request to include user information
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    // Add other user properties as needed
  };
}

// Other auth-related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}