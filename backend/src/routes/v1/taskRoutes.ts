import { Router } from 'express';
import { createTask, getTask, getTasks, updateTask, deleteTask, assignTask } from '../../controllers/taskController';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.use(requireAuth);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.patch('/:id/assign', assignTask);
router.delete('/:id', deleteTask);

export default router;
