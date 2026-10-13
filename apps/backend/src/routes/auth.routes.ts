import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleLogin);
router.get('/me', authMiddleware, AuthController.getMe);
router.patch('/visual-settings', authMiddleware, AuthController.updateVisualSettings);

export default router;
