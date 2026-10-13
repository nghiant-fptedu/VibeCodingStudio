import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Link as LinkIcon, Radio } from 'lucide-react';
import type { YouTubePreset } from '../../types';
import { CURATED_PLAYLISTS } from '../../data/curatedPlaylists';
import { extractYouTubeVideoId } from '../../utils/youtubeParser';

interface YouTubePlayerProps {
  currentVideoId: string;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onSelectVideo: (videoId: string) => void;
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
  onTogglePlay,
  onVolumeChange,
  onSelectVideo,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [inputError, setInputError] = useState('');
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
      },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReady: (event: any) => {
          event.target.setVolume(volume);
          if (isPlaying) {
            event.target.playVideo();
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

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeVideoId(customUrl);
    if (id) {
      onSelectVideo(id);
      setShowCustomInput(false);
      setCustomUrl('');
      setInputError('');
    } else {
      setInputError('Đường link hoặc ID YouTube không hợp lệ');
    }
  };

  const currentPreset = CURATED_PLAYLISTS.find((p) => p.videoId === currentVideoId);
  const trackTitle = currentPreset ? currentPreset.title : 'Custom YouTube Lofi Track';

  return (
    <>
      {/* Hidden YouTube IFrame Container */}
      <div className="fixed -bottom-96 -left-96 opacity-0 pointer-events-none">
        <div id="yt-hidden-player" />
      </div>

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-4xl px-4 md:px-6 py-3 rounded-full glass-panel shadow-2xl border border-white/10 flex items-center justify-between gap-3 md:gap-5 backdrop-blur-2xl">
        {/* Play/Pause & Track Title */}
        <div className="flex items-center gap-3 min-w-0 max-w-[280px] md:max-w-xs">
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
              <span className="text-xs md:text-sm font-semibold text-white truncate drop-shadow">
                {trackTitle}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              {currentPreset?.curator || 'YouTube Player'}
            </span>
          </div>
        </div>

        {/* Curated Preset Pills (Desktop & Tablet) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CURATED_PLAYLISTS.slice(0, 4).map((preset: YouTubePreset) => {
            const isActive = preset.videoId === currentVideoId;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectVideo(preset.videoId)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary/20 border border-primary/50 text-primary shadow-glow-amber'
                    : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {preset.title.split('·')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Volume & Custom Link */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Custom Link Button */}
          <button
            onClick={() => setShowCustomInput((prev) => !prev)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              showCustomInput
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Dán link YouTube tùy chỉnh"
          >
            <LinkIcon className="w-3.5 h-3.5" />
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

      {/* Custom URL Input Popover */}
      {showCustomInput && (
        <div className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-md p-4 rounded-3xl glass-panel-modal border border-white/10 shadow-2xl animate-in fade-in duration-200">
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Radio className="w-3.5 h-3.5 text-primary" />
              <span>Dán link YouTube hoặc Video ID</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/60"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
              >
                Phát
              </button>
            </div>
            {inputError && <span className="text-[11px] text-rose-400">{inputError}</span>}
          </form>
        </div>
      )}
    </>
  );
};
