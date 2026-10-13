import { type Response } from 'express';
import { TracksService } from '../services/tracks.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export class TracksController {
  static async getTracks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const tracks = await TracksService.getTracks(req.user.id);
      res.status(200).json({
        success: true,
        data: { tracks },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Lỗi khi tải danh sách bài hát',
      });
    }
  }

  static async addTrack(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { videoId, title, curator, category, isCustom } = req.body;
      const track = await TracksService.addTrack(req.user.id, {
        videoId,
        title,
        curator,
        category,
        isCustom,
      });

      res.status(201).json({
        success: true,
        message: 'Thêm bài hát vào playlist thành công',
        data: { track },
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Lỗi khi thêm bài hát',
      });
    }
  }

  static async deleteTrack(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: 'Thiếu ID bài hát cần xóa' });
        return;
      }

      await TracksService.deleteTrack(req.user.id, id);

      res.status(200).json({
        success: true,
        message: 'Đã xóa bài hát khỏi playlist thành công',
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Lỗi khi xóa bài hát',
      });
    }
  }

  static async restoreDefaults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const tracks = await TracksService.restoreDefaults(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Đã khôi phục playlist về danh sách mặc định',
        data: { tracks },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Lỗi khi khôi phục playlist mặc định',
      });
    }
  }
}
