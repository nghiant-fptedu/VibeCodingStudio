import { useCallback } from 'react';
import type { YouTubeTrack } from '../types';
import { CURATED_PLAYLISTS } from '../data/curatedPlaylists';
import { useLocalStorage } from './useLocalStorage';
import { extractYouTubeVideoId } from '../utils/youtubeParser';
import { fetchYouTubeMetadata } from '../utils/youtubeMetadata';

export function usePlaylists(
  currentVideoId: string,
  onSelectVideo: (videoId: string) => void
) {
  const [tracks, setTracks] = useLocalStorage<YouTubeTrack[]>(
    'vibespace_playlists_v1',
    CURATED_PLAYLISTS
  );

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

      const newTrack: YouTubeTrack = {
        id: `custom-${Date.now()}-${videoId}`,
        title,
        curator,
        videoId,
        category: 'custom',
        isCustom: true,
      };

      setTracks((prev) => [newTrack, ...prev]);
      onSelectVideo(newTrack.videoId);

      return { success: true, track: newTrack };
    },
    [onSelectVideo, setTracks, tracks]
  );

  const removeTrack = useCallback(
    (id: string) => {
      setTracks((prev) => {
        const remaining = prev.filter((t) => t.id !== id);
        // Nếu bài hát đang phát bị xóa, chuyển sang bài đầu tiên còn lại
        const deletedTrack = prev.find((t) => t.id === id);
        if (deletedTrack && deletedTrack.videoId === currentVideoId && remaining.length > 0) {
          onSelectVideo(remaining[0].videoId);
        }
        return remaining;
      });
    },
    [currentVideoId, onSelectVideo, setTracks]
  );

  const restoreDefaults = useCallback(() => {
    setTracks(CURATED_PLAYLISTS);
    if (CURATED_PLAYLISTS.length > 0) {
      onSelectVideo(CURATED_PLAYLISTS[0].videoId);
    }
  }, [onSelectVideo, setTracks]);

  return {
    tracks,
    addTrack,
    removeTrack,
    restoreDefaults,
  };
}
