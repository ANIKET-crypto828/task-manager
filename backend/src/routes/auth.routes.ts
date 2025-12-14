import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types/index';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req: Request, res: Response) => authController.register(req, res));
router.post('/login', (req: Request, res: Response) => authController.login(req, res));
router.post('/logout', (req: Request, res: Response) => authController.logout(req, res));

// Protected routes - cast to AuthenticatedRequest after authenticate middleware
router.get('/me', authenticate, (req, res) => authController.getCurrentUser(req as AuthenticatedRequest, res));
router.put('/profile', authenticate, (req, res) => authController.updateProfile(req as AuthenticatedRequest, res));

export default router;