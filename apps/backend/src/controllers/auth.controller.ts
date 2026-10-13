import { type Request, type Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const result = await AuthService.register({ email, password, name });
      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Lỗi khi đăng ký tài khoản',
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: err.message || 'Đăng nhập không thành công',
      });
    }
  }

  static async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      const result = await AuthService.loginWithGoogle(credential);
      res.status(200).json({
        success: true,
        message: 'Đăng nhập Google thành công',
        data: result,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: err.message || 'Xác thực Google không thành công',
      });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            avatar: req.user.avatar,
            googleId: req.user.googleId,
            lastActiveDate: req.user.lastActiveDate,
            createdAt: req.user.createdAt,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Lỗi lấy thông tin tài khoản',
      });
    }
  }
}
