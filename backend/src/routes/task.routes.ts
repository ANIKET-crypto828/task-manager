import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

// All routes are protected
router.use(authenticate);

// Special routes (must come before :id route)
router.get('/assigned', (req, res) => taskController.getAssignedTasks(req, res));
router.get('/created', (req, res) => taskController.getCreatedTasks(req, res));
router.get('/overdue', (req, res) => taskController.getOverdueTasks(req, res));

// Standard CRUD routes
router.get('/', (req, res) => taskController.getAllTasks(req, res));
router.post('/', (req, res) => taskController.createTask(req, res));
router.get('/:id', (req, res) => taskController.getTaskById(req, res));
router.put('/:id', (req, res) => taskController.updateTask(req, res));
router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

export default router;