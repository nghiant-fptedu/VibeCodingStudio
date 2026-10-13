import { Router } from 'express';
import { TracksController } from '../controllers/tracks.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Toàn bộ các endpoint tracks yêu cầu xác thực đăng nhập
router.use(authMiddleware);

router.get('/', TracksController.getTracks);
router.post('/', TracksController.addTrack);
router.delete('/:id', TracksController.deleteTrack);
router.post('/restore-defaults', TracksController.restoreDefaults);

export default router;
