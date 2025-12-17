import { authService } from '../../services/auth.service';
import { api } from '../../services/api';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../../types';

jest.mock('../../services/api');

const mockApi = api as jest.Mocked<typeof api>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    token: 'mock-jwt-token',
  };

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockApi.post.mockResolvedValue({ data: mockAuthResponse });

      const result = await authService.login(credentials);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockAuthResponse);
      expect(result.user.email).toBe(credentials.email);
    });

    it('should throw error with invalid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpass',
      };

      mockApi.post.mockRejectedValue({
        response: { status: 401, data: { error: 'Invalid credentials' } },
      });

      await expect(authService.login(credentials)).rejects.toMatchObject({
        response: { status: 401 },
      });
    });

    it('should handle network errors', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockApi.post.mockRejectedValue(new Error('Network error'));

      await expect(authService.login(credentials)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const credentials: RegisterCredentials = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      };

      mockApi.post.mockResolvedValue({ data: mockAuthResponse });

      const result = await authService.register(credentials);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', credentials);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should reject duplicate email registration', async () => {
      const credentials: RegisterCredentials = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      mockApi.post.mockRejectedValue({
        response: { status: 409, data: { error: 'Email already exists' } },
      });

      await expect(authService.register(credentials)).rejects.toMatchObject({
        response: { status: 409 },
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current authenticated user', async () => {
      mockApi.get.mockResolvedValue({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when not authenticated', async () => {
      mockApi.get.mockRejectedValue({
        response: { status: 401, data: { error: 'Not authenticated' } },
      });

      await expect(authService.getCurrentUser()).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      mockApi.put.mockResolvedValue({ data: updatedUser });

      const result = await authService.updateProfile(updates);

      expect(mockApi.put).toHaveBeenCalledWith('/auth/profile', updates);
      expect(result.name).toBe('Updated Name');
    });

    it('should reject invalid profile updates', async () => {
      const updates = { name: '' };

      mockApi.put.mockRejectedValue({
        response: { status: 400, data: { error: 'Name cannot be empty' } },
      });

      await expect(authService.updateProfile(updates)).rejects.toMatchObject({
        response: { status: 400 },
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockApi.post.mockResolvedValue({ data: {} });

      await authService.logout();

      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
    });
  });
});
