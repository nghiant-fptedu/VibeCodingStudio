import React, { useEffect } from 'react';
import { Play, Pause, Minimize2, RotateCcw, SkipForward } from 'lucide-react';
import type { PomodoroMode } from '../../types';
import { formatTime } from '../../utils/timeFormatter';
import { useI18n } from '../../context/I18nContext';

interface ZenPomodoroProps {
  timeLeft: number;
  mode?: PomodoroMode;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onSkip?: () => void;
  onExitZen: () => void;
  audioTrackTitle?: string;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
}

export const ZenPomodoro: React.FC<ZenPomodoroProps> = ({
  timeLeft,
  mode = 'focus',
  isRunning,
  onTogglePlay,
  onReset,
  onSkip,
  onExitZen,
  audioTrackTitle,
  isPlayingMusic = false,
  onToggleMusic,
}) => {
  const { t } = useI18n();

  // Phím tắt Escape để thoát Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitZen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitZen]);

  const modeLabel =
    mode === 'focus'
      ? t.pomodoro.focus
      : mode === 'shortBreak'
      ? t.pomodoro.shortBreak
      : t.pomodoro.longBreak;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 md:p-12 animate-in fade-in duration-700 select-none">
      {/* Top Bar: Exit Zen Pill */}
      <div className="w-full flex justify-end">
        <button
          onClick={onExitZen}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel-modal border border-white/10 hover:border-white/30 text-xs font-semibold text-slate-300 hover:text-white shadow-xl active:scale-95 transition-all"
          title={`${t.zen.exitZen} (ESC)`}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>{t.zen.exitZen}</span>
          <span className="hidden sm:inline text-[10px] text-slate-400 font-mono bg-white/10 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </button>
      </div>

      {/* Center: Minimalist Giant Timer */}
      <div className="flex flex-col items-center justify-center p-10 md:p-16 rounded-3xl glass-panel-subtle border border-white/10 shadow-[0_0_60px_rgba(245,158,11,0.15)] text-center backdrop-blur-3xl">
        {/* Mode Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-xs font-medium text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
          </span>
          <span className="tracking-wide uppercase text-[11px] font-semibold text-tertiary">
            {modeLabel}
          </span>
        </div>

        {/* Big Digits */}
        <span className="font-mono text-7xl md:text-9xl font-light tracking-tight text-primary text-glow tabular-nums">
          {formatTime(timeLeft)}
        </span>

        {/* Minimal Controls */}
        <div className="flex items-center gap-5 mt-8">
          <button
            onClick={onReset}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
            title={t.pomodoro.reset}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold shadow-xl shadow-amber-500/30 transition-all"
            title={isRunning ? t.pomodoro.pause : t.pomodoro.start}
          >
            {isRunning ? (
              <Pause className="w-7 h-7 fill-slate-950" />
            ) : (
              <Play className="w-7 h-7 fill-slate-950 ml-1" />
            )}
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
              title={t.pomodoro.skip}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom: Subtle Floating Audio Pill */}
      <div
        onClick={onToggleMusic}
        role="button"
        tabIndex={0}
        className={`flex items-center gap-3 px-5 py-2 rounded-full glass-panel-subtle text-xs text-slate-300/80 border border-white/5 shadow-lg transition-all ${
          onToggleMusic
            ? 'cursor-pointer hover:border-white/20 hover:text-white active:scale-95'
            : ''
        }`}
      >
        {/* Animated equalizer bars */}
        <div className="flex items-end gap-1 h-3 w-3 text-tertiary">
          <span
            className={`w-0.5 bg-tertiary rounded-full transition-all ${
              isPlayingMusic ? 'animate-eq-1' : 'h-1'
            }`}
          />
          <span
            className={`w-0.5 bg-tertiary rounded-full transition-all ${
              isPlayingMusic ? 'animate-eq-2' : 'h-2'
            }`}
          />
          <span
            className={`w-0.5 bg-tertiary rounded-full transition-all ${
              isPlayingMusic ? 'animate-eq-3' : 'h-1.5'
            }`}
          />
          <span
            className={`w-0.5 bg-tertiary rounded-full transition-all ${
              isPlayingMusic ? 'animate-eq-4' : 'h-1'
            }`}
          />
        </div>
        <span className="line-clamp-1">♫ {audioTrackTitle || 'VibeSpace Ambient Flow'}</span>
      </div>
    </div>
  );
};
