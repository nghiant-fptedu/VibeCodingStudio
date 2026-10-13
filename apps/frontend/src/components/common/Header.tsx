import React from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Image as ImageIcon,
  Sliders,
  CheckSquare,
} from 'lucide-react';

interface HeaderProps {
  onOpenWallpaperModal: () => void;
  onOpenMixerModal: () => void;
  onOpenTodoDrawer: () => void;
  onToggleZenMode: () => void;
  isMuted: boolean;
  onToggleMasterMute: () => void;
  todoProgressPercent: number;
  mixerActiveCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWallpaperModal,
  onOpenMixerModal,
  onOpenTodoDrawer,
  onToggleZenMode,
  isMuted,
  onToggleMasterMute,
  todoProgressPercent,
  mixerActiveCount,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Brand & Quote */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-glow-amber">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-primary-light bg-clip-text text-transparent">
            VibeSpace
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-xs text-slate-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          <span>Find your flow</span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* White Noise Mixer Button */}
        <button
          onClick={onOpenMixerModal}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            mixerActiveCount > 0
              ? 'glass-panel border-tertiary/50 text-tertiary shadow-glow-teal'
              : 'glass-panel-subtle border-white/10 text-slate-300 hover:text-white hover:border-white/20'
          }`}
          title="Bộ trộn âm thanh thiên nhiên"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Âm thanh</span>
          {mixerActiveCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-tertiary text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {mixerActiveCount}
            </span>
          )}
        </button>

        {/* Todo Drawer Button */}
        <button
          onClick={onOpenTodoDrawer}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-white/25 text-xs font-medium transition-all"
          title="Danh sách việc và thói quen"
        >
          <CheckSquare className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Việc cần làm</span>
          <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-light text-[10px] font-bold">
            {todoProgressPercent}%
          </span>
        </button>

        {/* Wallpaper Selector Button */}
        <button
          onClick={onOpenWallpaperModal}
          className="w-9 h-9 rounded-full flex items-center justify-center glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-white/25 transition-all"
          title="Đổi hình nền 4K"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Master Mute Button */}
        <button
          onClick={onToggleMasterMute}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'glass-panel border-white/10 text-slate-300 hover:text-white hover:border-white/25'
          }`}
          title={isMuted ? 'Bật lại âm thanh' : 'Tắt tiếng toàn bộ'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Zen Mode Button */}
        <button
          onClick={onToggleZenMode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          title="Chế độ tập trung Zen Mode"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Zen Mode</span>
        </button>
      </div>
    </header>
  );
};
