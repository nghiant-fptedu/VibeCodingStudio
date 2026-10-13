import { Router, type Response } from 'express';
import { SyncService } from '../services/sync.service.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/merge', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { tracks, todos, clientDate } = req.body;
    const result = await SyncService.mergeLocalData(req.user.id, {
      tracks,
      todos,
      clientDate,
    });

    res.status(200).json({
      success: true,
      message: 'Đồng bộ gộp dữ liệu thành công',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Lỗi khi đồng bộ dữ liệu',
    });
  }
});

export default router;
