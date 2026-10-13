import { type Response } from 'express';
import { TodosService } from '../services/todos.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export class TodosController {
  static async getTodos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const clientDate = typeof req.query.today === 'string' ? req.query.today : undefined;
      const result = await TodosService.getTodos(req.user.id, clientDate);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Lỗi khi tải danh sách công việc',
      });
    }
  }

  static async createTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { title, type } = req.body;
      const todo = await TodosService.createTodo(req.user.id, { title, type });

      res.status(201).json({
        success: true,
        message: 'Thêm công việc thành công',
        data: { todo },
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Lỗi khi tạo công việc',
      });
    }
  }

  static async updateTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: 'Thiếu ID công việc' });
        return;
      }

      const { title, completed } = req.body;
      const updated = await TodosService.updateTodo(req.user.id, id, { title, completed });

      res.status(200).json({
        success: true,
        message: 'Cập nhật công việc thành công',
        data: { todo: updated },
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Lỗi khi cập nhật công việc',
      });
    }
  }

  static async deleteTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: 'Thiếu ID công việc cần xóa' });
        return;
      }

      await TodosService.deleteTodo(req.user.id, id);

      res.status(200).json({
        success: true,
        message: 'Đã xóa công việc thành công',
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Lỗi khi xóa công việc',
      });
    }
  }
}
