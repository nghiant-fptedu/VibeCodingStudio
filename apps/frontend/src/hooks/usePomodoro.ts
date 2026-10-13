import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { PomodoroMode, PomodoroConfig } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { getTodayFormatted } from '../utils/dateHelper';

const DEFAULT_CONFIG: PomodoroConfig = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

// Hàm phát chuông thiền Solfeggio 528Hz qua Web Audio API
function playZenBellSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tần số chuông chính 528 Hz (Transformative / Healing frequency)
    const fundamental = 528;
    const harmonics = [1, 2.01, 3.02, 4.05];
    const gains = [0.4, 0.2, 0.1, 0.05];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * h, ctx.currentTime);

      gainNode.gain.setValueAtTime(gains[i], ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.5);
    });
  } catch (err) {
    console.warn('Cannot play audio bell:', err);
  }
}

export function usePomodoro() {
  const [config, setConfig] = useLocalStorage<PomodoroConfig>(
    'vibespace_pomodoro_cfg_v1',
    DEFAULT_CONFIG
  );

  const [stats, setStats] = useLocalStorage<{ date: string; count: number }>(
    'vibespace_pomodoro_stats',
    { date: getTodayFormatted(), count: 0 }
  );

  // Đảm bảo stats luôn đúng với ngày hiện tại
  const today = getTodayFormatted();
  const completedToday = stats.date === today ? stats.count : 0;

  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [isRunning, setIsRunning] = useState(false);

  const getDurationForMode = useCallback(
    (m: PomodoroMode) => {
      switch (m) {
        case 'focus':
          return config.focusDuration * 60;
        case 'shortBreak':
          return config.shortBreakDuration * 60;
        case 'longBreak':
          return config.longBreakDuration * 60;
      }
    },
    [config]
  );

  const [timeLeft, setTimeLeft] = useState(() => getDurationForMode('focus'));
  const intervalRef = useRef<number | null>(null);

  // Chuyển chế độ
  const changeMode = useCallback(
    (newMode: PomodoroMode) => {
      setMode(newMode);
      setIsRunning(false);
      setTimeLeft(getDurationForMode(newMode));
    },
    [getDurationForMode]
  );

  // Xử lý khi hoàn tất 1 phiên
  const handleSessionComplete = useCallback(() => {
    if (config.soundEnabled) {
      playZenBellSound();
    }

    if (mode === 'focus') {
      // Hiệu ứng pháo hoa ăn mừng khi hoàn thành phiên tập trung
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#ffc174', '#57e1ce', '#c0c1ff'],
        });
      } catch {
        // Fallback im lặng nếu canvas không sẵn sàng
      }

      setStats((prev) => {
        const currentDate = getTodayFormatted();
        const prevCount = prev.date === currentDate ? prev.count : 0;
        return { date: currentDate, count: prevCount + 1 };
      });

      // Kiểm tra chu kỳ để chuyển sang Break
      const nextCount = completedToday + 1;
      const nextMode = nextCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      changeMode(nextMode);
      if (config.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Kết thúc break -> chuyển về focus
      changeMode('focus');
      if (config.autoStartFocus) {
        setIsRunning(true);
      }
    }
  }, [changeMode, completedToday, config, mode, setStats]);

  // Bộ đếm đếm ngược
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleSessionComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };
  const skip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      changeMode('shortBreak');
    } else {
      changeMode('focus');
    }
  };

  const totalDuration = getDurationForMode(mode);
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

  return {
    mode,
    timeLeft,
    totalDuration,
    progressRatio,
    isRunning,
    completedToday,
    config,
    setConfig,
    start,
    pause,
    reset,
    skip,
    changeMode,
  };
}
