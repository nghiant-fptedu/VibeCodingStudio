import { prisma } from '../lib/prisma.js';
import { DEFAULT_TRACKS } from '../constants/defaultTracks.js';
import type { MusicTrack } from '@prisma/client';

export interface FormattedTrack {
  id: string;
  videoId: string;
  title: string;
  curator: string;
  category: string;
  isCustom: boolean;
  order: number;
  createdAt: Date;
}

function formatTrack(track: MusicTrack): FormattedTrack {
  return {
    id: track.id,
    videoId: track.videoId,
    title: track.title,
    curator: track.curator,
    category: track.category,
    isCustom: track.isCustom,
    order: track.order,
    createdAt: track.createdAt,
  };
}

export class TracksService {
  /**
   * Lấy danh sách playlist bài hát của user. Nếu rỗng, tự động seed 6 bài mặc định.
   */
  static async getTracks(userId: string): Promise<FormattedTrack[]> {
    let tracks = await prisma.musicTrack.findMany({
      where: { userId },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    if (tracks.length === 0) {
      await prisma.musicTrack.createMany({
        data: DEFAULT_TRACKS.map((t) => ({
          userId,
          videoId: t.videoId,
          title: t.title,
          curator: t.curator,
          category: t.category,
          isCustom: t.isCustom,
          order: t.order,
        })),
      });

      tracks = await prisma.musicTrack.findMany({
        where: { userId },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });
    }

    return tracks.map(formatTrack);
  }

  /**
   * Thêm bài hát YouTube mới vào playlist cá nhân
   */
  static async addTrack(
    userId: string,
    data: {
      videoId: string;
      title: string;
      curator?: string;
      category?: string;
      isCustom?: boolean;
    }
  ): Promise<FormattedTrack> {
    const videoId = data.videoId?.trim();
    const title = data.title?.trim();
    const curator = data.curator?.trim() || 'Người dùng thêm';
    const category = data.category?.trim() || 'custom';
    const isCustom = data.isCustom !== undefined ? data.isCustom : true;

    if (!videoId) {
      throw new Error('Video ID không được để trống.');
    }
    if (!title) {
      throw new Error('Tiêu đề bài hát không được để trống.');
    }

    // Kiểm tra trùng lặp trong playlist của chính user
    const existing = await prisma.musicTrack.findFirst({
      where: { userId, videoId },
    });
    if (existing) {
      throw new Error('Bài hát này đã có sẵn trong danh sách phát của bạn.');
    }

    const newTrack = await prisma.musicTrack.create({
      data: {
        userId,
        videoId,
        title,
        curator,
        category,
        isCustom,
        order: 0,
      },
    });

    return formatTrack(newTrack);
  }

  /**
   * Xóa một bài hát khỏi playlist cá nhân theo ID
   */
  static async deleteTrack(userId: string, trackId: string): Promise<void> {
    const track = await prisma.musicTrack.findFirst({
      where: { id: trackId, userId },
    });

    if (!track) {
      throw new Error('Bài hát không tồn tại hoặc bạn không có quyền xóa bài hát này.');
    }

    await prisma.musicTrack.delete({
      where: { id: trackId },
    });
  }

  /**
   * Khôi phục playlist cá nhân về 6 bài Lofi mặc định ban đầu
   */
  static async restoreDefaults(userId: string): Promise<FormattedTrack[]> {
    await prisma.$transaction(async (tx) => {
      await tx.musicTrack.deleteMany({
        where: { userId },
      });

      await tx.musicTrack.createMany({
        data: DEFAULT_TRACKS.map((t) => ({
          userId,
          videoId: t.videoId,
          title: t.title,
          curator: t.curator,
          category: t.category,
          isCustom: t.isCustom,
          order: t.order,
        })),
      });
    });

    return this.getTracks(userId);
  }
}
