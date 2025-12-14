import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

// All routes are protected
router.use(authenticate);

router.get('/unread', (req, res) => notificationController.getUnreadNotifications(req, res));
router.put('/read-all', (req, res) => notificationController.markAllAsRead(req, res));
router.get('/', (req, res) => notificationController.getNotifications(req, res));
router.put('/:id/read', (req, res) => notificationController.markAsRead(req, res));
router.delete('/:id', (req, res) => notificationController.deleteNotification(req, res));

export default router;