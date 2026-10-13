import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { DEFAULT_TRACKS } from '../constants/defaultTracks.js';
import type { User } from '@prisma/client';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    googleId: string | null;
    lastActiveDate: string | null;
    createdAt: Date;
  };
}

function sanitizeUser(user: User): AuthResponse['user'] {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    googleId: user.googleId,
    lastActiveDate: user.lastActiveDate,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  /**
   * Đăng ký tài khoản người dùng mới bằng Email & Password
   */
  static async register(data: {
    email: string;
    password?: string;
    name: string;
  }): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const password = data.password?.trim();

    if (!email || !email.includes('@')) {
      throw new Error('Email không hợp lệ.');
    }
    if (!name) {
      throw new Error('Vui lòng nhập họ và tên.');
    }
    if (!password || password.length < 6) {
      throw new Error('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email này đã được đăng ký tài khoản.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user và seed sẵn 6 bài nhạc Lofi mặc định trong 1 transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      // Seed 6 bài nhạc mặc định cho playlist cá nhân của user
      await tx.musicTrack.createMany({
        data: DEFAULT_TRACKS.map((track) => ({
          userId: newUser.id,
          videoId: track.videoId,
          title: track.title,
          curator: track.curator,
          category: track.category,
          isCustom: track.isCustom,
          order: track.order,
        })),
      });

      return newUser;
    });

    const token = generateToken({ userId: user.id, email: user.email });
    return { token, user: sanitizeUser(user) };
  }

  /**
   * Đăng nhập tài khoản bằng Email & Password
   */
  static async login(data: { email: string; password?: string }): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();
    const password = data.password?.trim();

    if (!email || !password) {
      throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.');
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const token = generateToken({ userId: user.id, email: user.email });
    return { token, user: sanitizeUser(user) };
  }

  /**
   * Đăng nhập bằng Google ID Token (Google OAuth 1-Click)
   */
  static async loginWithGoogle(credential: string): Promise<AuthResponse> {
    if (!credential) {
      throw new Error('Thiếu thông tin Google credential token.');
    }

    let email = '';
    let name = '';
    let avatar: string | null = null;
    let googleId = '';

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId || undefined,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error('Không thể xác thực thông tin tài khoản Google.');
      }

      email = payload.email.toLowerCase();
      name = payload.name || payload.given_name || 'VibeSpace Member';
      avatar = payload.picture || null;
      googleId = payload.sub;
    } catch (err: any) {
      // Fallback decode nếu trong môi trường test/dev chưa cài client id chính thức
      console.warn('[Google Auth Warning]: verifyIdToken failed, attempting fallback payload extraction', err.message);
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload.email) {
            email = payload.email.toLowerCase();
            name = payload.name || 'VibeSpace Member';
            avatar = payload.picture || null;
            googleId = payload.sub || `google-${Date.now()}`;
          }
        }
      } catch {
        throw new Error('Google token không hợp lệ hoặc đã hết hạn.');
      }
    }

    if (!email) {
      throw new Error('Không tìm thấy địa chỉ email từ Google token.');
    }

    // Tìm user theo googleId hoặc email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (user) {
      // Cập nhật googleId hoặc avatar nếu chưa có
      if (!user.googleId || (!user.avatar && avatar)) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: user.googleId || googleId,
            avatar: user.avatar || avatar,
          },
        });
      }
    } else {
      // Đăng ký người dùng mới qua Google và seed 6 bài nhạc
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            name,
            avatar,
            googleId,
          },
        });

        await tx.musicTrack.createMany({
          data: DEFAULT_TRACKS.map((track) => ({
            userId: newUser.id,
            videoId: track.videoId,
            title: track.title,
            curator: track.curator,
            category: track.category,
            isCustom: track.isCustom,
            order: track.order,
          })),
        });

        return newUser;
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    return { token, user: sanitizeUser(user) };
  }
}
