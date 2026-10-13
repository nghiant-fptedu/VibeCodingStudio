import { useState, useEffect, useCallback, useRef } from 'react';
import type { YouTubeTrack } from '../types';
import { CURATED_PLAYLISTS } from '../data/curatedPlaylists';
import { extractYouTubeVideoId } from '../utils/youtubeParser';
import { fetchYouTubeMetadata } from '../utils/youtubeMetadata';
import { useAuth } from '../context/AuthContext';
import { tracksApi } from '../services/api';

const LOCAL_STORAGE_KEY = 'vibespace_playlists_v1';

const getStoredTracks = (): YouTubeTrack[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : CURATED_PLAYLISTS;
  } catch {
    return CURATED_PLAYLISTS;
  }
};

const saveStoredTracks = (tracks: YouTubeTrack[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tracks));
  } catch (err) {
    console.warn('Lưu playlist vào localStorage thất bại:', err);
  }
};

export function usePlaylists(
  currentVideoId: string,
  onSelectVideo: (videoId: string) => void
) {
  const { isAuthenticated, user } = useAuth();
  const [tracks, setTracks] = useState<YouTubeTrack[]>(getStoredTracks);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialLoadDoneRef = useRef(false);

  // Đồng bộ danh sách bài hát từ Cloud khi người dùng đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      // Khi là Guest hoặc Đăng xuất: nạp lại từ localStorage
      setTracks(getStoredTracks());
      initialLoadDoneRef.current = false;
      return;
    }

    const fetchCloudTracks = async () => {
      setIsLoading(true);
      try {
        const cloudTracks = await tracksApi.getTracks();
        if (cloudTracks && cloudTracks.length > 0) {
          setTracks(cloudTracks);
        } else {
          // Nếu user mới chưa có track trên cloud, khởi tạo với danh sách mặc định
          setTracks(CURATED_PLAYLISTS);
        }
      } catch (err) {
        console.warn('Lấy tracks từ cloud thất bại, sử dụng cache:', err);
      } finally {
        setIsLoading(false);
        initialLoadDoneRef.current = true;
      }
    };

    fetchCloudTracks();
  }, [isAuthenticated, user?.id]);

  const addTrack = useCallback(
    async (
      input: string
    ): Promise<{ success: boolean; track?: YouTubeTrack; error?: string }> => {
      const videoId = extractYouTubeVideoId(input);
      if (!videoId) {
        return { success: false, error: 'Đường link hoặc Video ID không hợp lệ.' };
      }

      // Kiểm tra trùng lặp
      const existing = tracks.find((t) => t.videoId === videoId);
      if (existing) {
        onSelectVideo(existing.videoId);
        return {
          success: true,
          track: existing,
          error: 'Bài hát đã có sẵn trong danh sách phát.',
        };
      }

      // Lấy tiêu đề chính xác từ YouTube oEmbed
      const meta = await fetchYouTubeMetadata(videoId);
      const title = meta?.title || `YouTube Track (${videoId})`;
      const curator = meta?.curator || 'Người dùng thêm';

      const tempId = `custom-${Date.now()}-${videoId}`;
      const newTrack: YouTubeTrack = {
        id: tempId,
        title,
        curator,
        videoId,
        category: 'custom',
        isCustom: true,
      };

      // Cập nhật Optimistic UI ngay lập tức
      setTracks((prev) => [newTrack, ...prev]);
      onSelectVideo(newTrack.videoId);

      if (isAuthenticated) {
        try {
          const savedTrack = await tracksApi.addTrack({
            title,
            curator,
            videoId,
            category: 'custom',
          });
          // Cập nhật lại ID thật từ database
          setTracks((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: savedTrack.id } : t))
          );
        } catch (err) {
          console.error('Lỗi khi lưu bài hát lên cloud:', err);
        }
      } else {
        // Lưu offline
        const updated = [newTrack, ...tracks];
        saveStoredTracks(updated);
      }

      return { success: true, track: newTrack };
    },
    [isAuthenticated, onSelectVideo, tracks]
  );

  const removeTrack = useCallback(
    async (id: string) => {
      // Optimistic UI update
      setTracks((prev) => {
        const remaining = prev.filter((t) => t.id !== id);
        // Nếu bài hát đang phát bị xóa, chuyển sang bài đầu tiên còn lại
        const deletedTrack = prev.find((t) => t.id === id);
        if (deletedTrack && deletedTrack.videoId === currentVideoId && remaining.length > 0) {
          onSelectVideo(remaining[0].videoId);
        }
        if (!isAuthenticated) {
          saveStoredTracks(remaining);
        }
        return remaining;
      });

      if (isAuthenticated) {
        try {
          await tracksApi.deleteTrack(id);
        } catch (err) {
          console.error('Lỗi khi xóa bài hát trên cloud:', err);
        }
      }
    },
    [currentVideoId, isAuthenticated, onSelectVideo]
  );

  const restoreDefaults = useCallback(async () => {
    // Optimistic UI update
    setTracks(CURATED_PLAYLISTS);
    if (CURATED_PLAYLISTS.length > 0) {
      onSelectVideo(CURATED_PLAYLISTS[0].videoId);
    }

    if (isAuthenticated) {
      try {
        const resetTracks = await tracksApi.restoreDefaults();
        setTracks(resetTracks);
      } catch (err) {
        console.error('Lỗi khi khôi phục playlist trên cloud:', err);
      }
    } else {
      saveStoredTracks(CURATED_PLAYLISTS);
    }
  }, [isAuthenticated, onSelectVideo]);

  const resetToGuestDefaults = useCallback(() => {
    setTracks(CURATED_PLAYLISTS);
    saveStoredTracks(CURATED_PLAYLISTS);
  }, []);

  return {
    tracks,
    isLoading,
    addTrack,
    removeTrack,
    restoreDefaults,
    resetToGuestDefaults,
  };
}
