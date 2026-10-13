import { prisma } from '../lib/prisma.js';
import { TracksService } from './tracks.service.js';
import { TodosService } from './todos.service.js';

export interface LocalSyncPayload {
  tracks?: Array<{
    videoId: string;
    title: string;
    curator?: string;
    category?: string;
    isCustom?: boolean;
  }>;
  todos?: Array<{
    title: string;
    type?: 'habit' | 'one_off';
    completed?: boolean;
    completedAt?: string;
  }>;
  visualSettings?: {
    wallpaperId?: string;
    darknessOverlay?: number;
    blurAmount?: number;
  };
  clientDate?: string;
}

export class SyncService {
  /**
   * Đồng bộ gộp (Merge) dữ liệu từ localStorage lên tài khoản database sau khi user đăng nhập
   */
  static async mergeLocalData(userId: string, payload: LocalSyncPayload) {
    const { tracks = [], todos = [], clientDate } = payload;

    // 1. Merge tracks: chỉ thêm các bài hát chưa có trong DB của user
    if (tracks.length > 0) {
      const existingTracks = await prisma.musicTrack.findMany({
        where: { userId },
        select: { videoId: true },
      });
      const existingVideoIds = new Set(existingTracks.map((t) => t.videoId));

      const newTracksToInsert = tracks
        .filter((t) => t.videoId && !existingVideoIds.has(t.videoId))
        .map((t, idx) => ({
          userId,
          videoId: t.videoId.trim(),
          title: t.title?.trim() || 'Track',
          curator: t.curator?.trim() || 'Người dùng thêm',
          category: t.category?.trim() || 'custom',
          isCustom: t.isCustom !== undefined ? t.isCustom : true,
          order: idx,
        }));

      if (newTracksToInsert.length > 0) {
        await prisma.musicTrack.createMany({
          data: newTracksToInsert,
        });
      }
    }

    // 2. Merge todos: thêm các todo local vào DB nếu chưa có
    if (todos.length > 0) {
      const existingTodos = await prisma.todoItem.findMany({
        where: { userId },
        select: { title: true, type: true },
      });
      const existingKeys = new Set(existingTodos.map((t) => `${t.type}:${t.title.toLowerCase()}`));

      const newTodosToInsert = todos
        .filter((t) => t.title && !existingKeys.has(`${t.type || 'one_off'}:${t.title.trim().toLowerCase()}`))
        .map((t) => ({
          userId,
          title: t.title.trim(),
          type: t.type === 'habit' ? 'habit' : 'one_off',
          completed: Boolean(t.completed),
          completedAt: t.completedAt ? new Date(t.completedAt) : null,
        }));

      if (newTodosToInsert.length > 0) {
        await prisma.todoItem.createMany({
          data: newTodosToInsert,
        });
      }
    }

    // 3. Merge visualSettings nếu user trên DB đang ở mặc định 'pine-forest' và local có cài đặt khác
    if (payload.visualSettings) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { wallpaperId: true },
      });

      if (
        user &&
        user.wallpaperId === 'pine-forest' &&
        payload.visualSettings.wallpaperId &&
        payload.visualSettings.wallpaperId !== 'pine-forest'
      ) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            wallpaperId: payload.visualSettings.wallpaperId.trim(),
            darknessOverlay:
              typeof payload.visualSettings.darknessOverlay === 'number'
                ? Math.round(payload.visualSettings.darknessOverlay)
                : undefined,
            blurAmount:
              typeof payload.visualSettings.blurAmount === 'number'
                ? Math.round(payload.visualSettings.blurAmount)
                : undefined,
          },
        });
      }
    }

    // 4. Trả về state hoàn chỉnh mới nhất sau khi merge
    const mergedTracks = await TracksService.getTracks(userId);
    const mergedTodos = await TodosService.getTodos(userId, clientDate);
    const latestUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        wallpaperId: true,
        darknessOverlay: true,
        blurAmount: true,
      },
    });

    return {
      tracks: mergedTracks,
      todos: mergedTodos,
      visualSettings: latestUser
        ? {
            wallpaperId: latestUser.wallpaperId,
            darknessOverlay: latestUser.darknessOverlay,
            blurAmount: latestUser.blurAmount,
          }
        : undefined,
    };
  }
}
