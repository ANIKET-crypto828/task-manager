import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthController } from '../../controllers/auth.controller';
import { prismaMock } from '../setup';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseCookie: jest.Mock;
  let responseClearCookie: jest.Mock;

  beforeEach(() => {
    authController = new AuthController();
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    responseCookie = jest.fn().mockReturnThis();
    responseClearCookie = jest.fn().mockReturnThis();

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      cookie: responseCookie,
      clearCookie: responseClearCookie,
    };

    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockRequest = { body: userData };

      const hashedPassword = 'hashed_password';
      const createdUser = {
        id: 'user-123',
        email: userData.email,
        name: userData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = 'jwt_token';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(createdUser as any);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(responseCookie).toHaveBeenCalledWith(
        'token',
        token,
        expect.any(Object)
      );
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        user: createdUser,
        token,
      });
    });

    it('should return error if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockRequest = { body: userData };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: userData.email,
      } as any);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Email already registered',
      });
    });

    it('should return validation error for invalid data', async () => {
      mockRequest = {
        body: {
          email: 'invalid-email',
          name: 'T',
          password: '123',
        },
      };

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockRequest = { body: loginData };

      const user = {
        id: 'user-123',
        email: loginData.email,
        name: 'Test User',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = 'jwt_token';

      prismaMock.user.findUnique.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        user.password
      );
      expect(responseCookie).toHaveBeenCalledWith(
        'token',
        token,
        expect.any(Object)
      );
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        user: expect.not.objectContaining({ password: expect.anything() }),
        token,
      });
    });

    it('should return error for non-existent user', async () => {
      mockRequest = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });

    it('should return error for invalid password', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-123',
        password: 'hashed_password',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'newemail@example.com',
      };

      mockRequest = {
        body: updateData,
        user: { userId: 'user-123', email: 'old@example.com' },
      } as any;

      const updatedUser = {
        id: 'user-123',
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.update.mockResolvedValue(updatedUser as any);

      await authController.updateProfile(
        mockRequest as any,
        mockResponse as Response
      );

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining(updateData),
        select: expect.any(Object),
      });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(updatedUser);
    });

    it('should reject email already in use by another user', async () => {
      const updateData = {
        email: 'taken@example.com',
      };

      mockRequest = {
        body: updateData,
        user: { userId: 'user-123' },
      } as any;

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-456',
        email: updateData.email,
      } as any);

      await authController.updateProfile(
        mockRequest as any,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Email already in use',
      });
      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
  });
});