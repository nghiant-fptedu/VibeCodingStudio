import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ListMusic,
  Plus,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { YouTubeTrack } from '../../types';

interface YouTubePlayerProps {
  currentVideoId: string;
  isPlaying: boolean;
  volume: number;
  tracks: YouTubeTrack[];
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onSelectVideo: (videoId: string) => void;
  onOpenPlaylistModal: () => void;
  onAddTrack: (
    input: string
  ) => Promise<{ success: boolean; track?: YouTubeTrack; error?: string }>;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
  }
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  currentVideoId,
  isPlaying,
  volume,
  tracks,
  onTogglePlay,
  onVolumeChange,
  onSelectVideo,
  onOpenPlaylistModal,
  onAddTrack,
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const isApiLoadedRef = useRef(false);

  // Load YouTube IFrame Player API Script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      isApiLoadedRef.current = true;
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      isApiLoadedRef.current = true;
      initPlayer();
    };
  }, []);

  const handleNextTrack = () => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.videoId === currentVideoId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    onSelectVideo(tracks[nextIndex].videoId);
  };

  const handlePrevTrack = () => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.videoId === currentVideoId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    onSelectVideo(tracks[prevIndex].videoId);
  };

  const initPlayer = () => {
    if (!window.YT || !window.YT.Player) return;
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player('yt-hidden-player', {
      height: '10',
      width: '10',
      videoId: currentVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReady: (event: any) => {
          event.target.setVolume(volume);
          if (isPlaying) {
            event.target.playVideo();
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (event: any) => {
          console.warn('YouTube Player error code:', event.data);
          // Mã lỗi 100/101/150: Video riêng tư hoặc chặn phát nhúng -> tự động chuyển bài tiếp theo
          setStatusMessage({
            type: 'error',
            text: 'Bài hát bị giới hạn bản quyền nhúng, đang chuyển bài kế tiếp...',
          });
          setTimeout(() => {
            setStatusMessage(null);
            handleNextTrack();
          }, 2000);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onStateChange: (event: any) => {
          // Video kết thúc (State 0) -> tự động chuyển bài tiếp theo
          if (event.data === 0) {
            handleNextTrack();
          }
        },
      },
    });
  };

  // Đồng bộ Play / Pause
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo && playerRef.current.pauseVideo) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // Đồng bộ Video ID
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(currentVideoId);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentVideoId]);

  // Đồng bộ Volume
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsLoadingMetadata(true);
    setStatusMessage(null);

    const res = await onAddTrack(customInput.trim());
    setIsLoadingMetadata(false);

    if (res.success) {
      setCustomInput('');
      setStatusMessage({
        type: 'success',
        text: `Đã thêm: "${res.track?.title}"`,
      });
      setTimeout(() => {
        setStatusMessage(null);
        setShowQuickAdd(false);
      }, 2500);
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Không tìm thấy video hợp lệ.',
      });
    }
  };

  const currentTrack = tracks.find((p) => p.videoId === currentVideoId);
  const trackTitle = currentTrack?.title || 'YouTube Lofi Focus Track';
  const curatorName = currentTrack?.curator || 'Lofi Beats';

  return (
    <>
      {/* Hidden YouTube IFrame Container */}
      <div className="fixed -bottom-96 -left-96 opacity-0 pointer-events-none">
        <div id="yt-hidden-player" />
      </div>

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[96vw] max-w-4xl px-3 md:px-6 py-2.5 md:py-3.5 rounded-full glass-panel shadow-2xl border border-white/10 flex items-center justify-between gap-2.5 md:gap-5 backdrop-blur-2xl">
        {/* Playback Controls & Track Info */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 max-w-[280px] md:max-w-sm">
          {/* Previous Track */}
          <button
            onClick={handlePrevTrack}
            className="w-7 h-7 hidden sm:flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            title="Bài trước"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold shadow-lg shadow-amber-500/25 transition-all"
            aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc Lofi'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={handleNextTrack}
            className="w-7 h-7 hidden sm:flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            title="Bài tiếp theo"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Track Details */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3 w-3 shrink-0 text-primary">
                  <span className="w-0.5 bg-primary rounded-full animate-eq-1" />
                  <span className="w-0.5 bg-primary rounded-full animate-eq-2" />
                  <span className="w-0.5 bg-primary rounded-full animate-eq-3" />
                  <span className="w-0.5 bg-primary rounded-full animate-eq-4" />
                </div>
              )}
              <span
                onClick={onOpenPlaylistModal}
                className="text-xs md:text-sm font-semibold text-white truncate drop-shadow cursor-pointer hover:text-primary transition-colors"
                title={trackTitle}
              >
                {trackTitle}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate">{curatorName}</span>
          </div>
        </div>

        {/* Curated Preset Pills (Desktop & Tablet) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-sm">
          {tracks.slice(0, 4).map((preset) => {
            const isActive = preset.videoId === currentVideoId;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectVideo(preset.videoId)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all truncate max-w-[140px] ${
                  isActive
                    ? 'bg-primary/20 border border-primary/50 text-primary shadow-glow-amber'
                    : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title={preset.title}
              >
                {preset.title.split('·')[0].split('[')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Playlist Modal Trigger, Quick Add, Volume */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Playlist Manager Button */}
          <button
            onClick={onOpenPlaylistModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
            title="Mở danh sách bài hát (Xem & Quản lý)"
          >
            <ListMusic className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline font-mono text-[11px]">{tracks.length}</span>
          </button>

          {/* Quick Add Song Button */}
          <button
            onClick={() => setShowQuickAdd((prev) => !prev)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              showQuickAdd
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Thêm bài hát mới bằng link YouTube"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Volume Slider */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 50 : 0)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 md:w-20 accent-primary"
              aria-label="Âm lượng nhạc Lofi"
            />
          </div>
        </div>
      </div>

      {/* Quick Add Popover */}
      {showQuickAdd && (
        <div className="fixed bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md p-4 rounded-3xl glass-panel-modal border border-white/10 shadow-2xl animate-in fade-in duration-200">
          <form onSubmit={handleQuickAddSubmit} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-primary" /> Thêm bài hát vào danh sách phát
              </span>
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Dán link YouTube (hệ thống sẽ tự động lấy tên video chuẩn trên YouTube)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={customInput}
                disabled={isLoadingMetadata}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/60 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoadingMetadata || !customInput.trim()}
                className="px-4 py-2 rounded-xl bg-primary text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 transition-all"
              >
                {isLoadingMetadata ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Thêm</span>
                )}
              </button>
            </div>

            {statusMessage && (
              <div
                className={`text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  statusMessage.type === 'success'
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {statusMessage.type === 'error' && <AlertCircle className="w-3 h-3" />}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};
