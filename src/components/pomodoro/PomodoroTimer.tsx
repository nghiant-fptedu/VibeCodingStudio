import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import type { PomodoroMode } from '../../types';
import { formatTime } from '../../utils/timeFormatter';

interface PomodoroTimerProps {
  timeLeft: number;
  totalDuration: number;
  progressRatio: number;
  mode: PomodoroMode;
  isRunning: boolean;
  completedToday: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onChangeMode: (mode: PomodoroMode) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  timeLeft,
  progressRatio,
  mode,
  isRunning,
  completedToday,
  onStart,
  onPause,
  onReset,
  onSkip,
  onChangeMode,
}) => {
  // Chu vi vòng tròn SVG radius = 105: C = 2 * PI * 105 = 659.73
  const circumference = 2 * Math.PI * 105;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="relative flex flex-col items-center justify-center max-w-md w-full mx-auto p-7 md:p-9 rounded-3xl glass-panel shadow-2xl border border-white/10 text-center select-none backdrop-blur-2xl">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950/40 border border-white/5 mb-6">
        <button
          onClick={() => onChangeMode('focus')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'focus'
              ? 'bg-gradient-to-r from-primary to-amber-600 text-slate-950 shadow-md shadow-primary/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tập trung
        </button>
        <button
          onClick={() => onChangeMode('shortBreak')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'shortBreak'
              ? 'bg-gradient-to-r from-tertiary to-teal-600 text-slate-950 shadow-md shadow-tertiary/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Nghỉ ngắn
        </button>
        <button
          onClick={() => onChangeMode('longBreak')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'longBreak'
              ? 'bg-gradient-to-r from-secondary to-indigo-600 text-white shadow-md shadow-secondary/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Nghỉ dài
        </button>
      </div>

      {/* Circular SVG Ring & Time Readout */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
          <defs>
            <linearGradient id="pomoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc174" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#57e1ce" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="6"
          />

          {/* Glowing Animated Progress Circle */}
          <circle
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="url(#pomoGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#softGlow)"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Digital Time Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl md:text-7xl font-light tracking-tight text-primary text-glow tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mt-2">
            {mode === 'focus' ? 'Phiên tập trung' : 'Thời gian nghỉ'}
          </span>
        </div>
      </div>

      {/* Controls: Reset, Play/Pause, Skip */}
      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          onClick={onReset}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/5 active:scale-95 transition-all"
          title="Đặt lại đồng hồ"
          aria-label="Đặt lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={isRunning ? onPause : onStart}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold shadow-xl shadow-amber-500/30 transition-all"
          title={isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          aria-label={isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        >
          {isRunning ? (
            <Pause className="w-7 h-7 fill-slate-950" />
          ) : (
            <Play className="w-7 h-7 fill-slate-950 ml-1" />
          )}
        </button>

        <button
          onClick={onSkip}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/5 active:scale-95 transition-all"
          title="Bỏ qua phiên"
          aria-label="Bỏ qua"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Session Streak Counter */}
      <div className="flex items-center gap-2 mt-6 px-3.5 py-1 rounded-full bg-slate-950/40 border border-white/5 text-xs text-slate-400">
        <span>🍅 Đã hoàn thành:</span>
        <span className="font-bold text-primary font-mono">{completedToday}</span>
        <span>phiên hôm nay</span>
      </div>
    </div>
  );
};
