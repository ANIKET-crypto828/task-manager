import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/auth.middleware';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      cookies: {},
    };
    mockResponse = {
      status: responseStatus,
    };
    nextFunction = jest.fn();

    process.env.JWT_SECRET = 'test-secret';
  });

  it('should authenticate user with valid token', () => {
    const token = 'valid_token';
    const decoded = { userId: 'user-123', email: 'test@example.com' };

    mockRequest.cookies = { token };
    (jwt.verify as jest.Mock).mockReturnValue(decoded);

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect((mockRequest as any).user).toEqual(decoded);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should reject request without token', () => {
    mockRequest.cookies = {};

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Authentication required',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token', () => {
    mockRequest.cookies = { token: 'invalid_token' };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});