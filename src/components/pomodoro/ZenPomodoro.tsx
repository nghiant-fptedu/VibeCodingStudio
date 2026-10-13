import React from 'react';
import { Play, Pause, Minimize2, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/timeFormatter';

interface ZenPomodoroProps {
  timeLeft: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onExitZen: () => void;
  audioTrackTitle?: string;
}

export const ZenPomodoro: React.FC<ZenPomodoroProps> = ({
  timeLeft,
  isRunning,
  onTogglePlay,
  onReset,
  onExitZen,
  audioTrackTitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 md:p-12 animate-in fade-in duration-700 select-none">
      {/* Top Bar: Exit Zen Pill */}
      <div className="w-full flex justify-end">
        <button
          onClick={onExitZen}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel-modal border border-white/10 hover:border-white/30 text-xs font-semibold text-slate-300 hover:text-white shadow-xl active:scale-95 transition-all"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Thoát Zen Mode</span>
        </button>
      </div>

      {/* Center: Minimalist Giant Timer */}
      <div className="flex flex-col items-center justify-center p-10 md:p-16 rounded-3xl glass-panel-subtle border border-white/10 shadow-[0_0_60px_rgba(245,158,11,0.15)] text-center backdrop-blur-3xl">
        <span className="font-mono text-7xl md:text-9xl font-light tracking-tight text-primary text-glow tabular-nums">
          {formatTime(timeLeft)}
        </span>

        {/* Minimal Controls */}
        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={onReset}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
            title="Đặt lại"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold shadow-xl shadow-amber-500/30 transition-all"
            title={isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          >
            {isRunning ? (
              <Pause className="w-7 h-7 fill-slate-950" />
            ) : (
              <Play className="w-7 h-7 fill-slate-950 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom: Subtle Floating Audio Pill */}
      <div className="flex items-center gap-3 px-5 py-2 rounded-full glass-panel-subtle text-xs text-slate-300/80 border border-white/5 shadow-lg">
        {/* Animated equalizer bars */}
        <div className="flex items-end gap-1 h-3 w-3 text-tertiary">
          <span className="w-0.5 bg-tertiary rounded-full animate-eq-1" />
          <span className="w-0.5 bg-tertiary rounded-full animate-eq-2" />
          <span className="w-0.5 bg-tertiary rounded-full animate-eq-3" />
          <span className="w-0.5 bg-tertiary rounded-full animate-eq-4" />
        </div>
        <span className="line-clamp-1">♫ {audioTrackTitle || 'VibeSpace Ambient Flow'}</span>
      </div>
    </div>
  );
};
