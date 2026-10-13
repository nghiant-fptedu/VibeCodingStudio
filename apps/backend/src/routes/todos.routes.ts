import { Router } from 'express';
import { TodosController } from '../controllers/todos.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Toàn bộ các endpoint todo yêu cầu xác thực đăng nhập
router.use(authMiddleware);

router.get('/', TodosController.getTodos);
router.post('/', TodosController.createTodo);
router.patch('/:id', TodosController.updateTodo);
router.delete('/:id', TodosController.deleteTodo);

export default router;
