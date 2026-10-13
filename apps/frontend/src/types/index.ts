// 1. Quản lý công việc (Todo & Routines)
export type TaskType = 'habit' | 'one_off';

export interface TodoItem {
  id: string;
  title: string;
  type: TaskType;
  completed: boolean;
  createdAt: string;       // ISO Timestamp
  completedAt?: string;    // ISO Timestamp
}

export interface TodoState {
  items: TodoItem[];
  lastActiveDate: string;  // Định dạng "YYYY-MM-DD"
}

// 2. Quản lý đồng hồ Pomodoro
export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
  focusDuration: number;       // Số phút (mặc định 25)
  shortBreakDuration: number;  // Số phút (mặc định 5)
  longBreakDuration: number;   // Số phút (mặc định 15)
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number;            // Tính theo giây
  isRunning: boolean;
  completedSessionsToday: number;
}

// 3. Quản lý White Noise Mixer
export interface SoundChannel {
  id: string;
  name: string;
  icon: string;                // Tên Lucide icon hoặc Material icon
  audioSrc: string;            // Đường dẫn file âm thanh hoặc synthesized audio
  volume: number;              // 0 -> 100
  isActive: boolean;
}

export interface SoundPreset {
  id: string;
  name: string;
  description: string;
  channels: { [channelId: string]: number }; // volume cho từng kênh
}

// 4. Quản lý YouTube Lofi Music
export interface YouTubePreset {
  id: string;
  title: string;
  curator: string;
  videoId: string;
  category?: 'lofi' | 'ambient' | 'synthwave' | 'piano' | 'custom';
  isCustom?: boolean;
}
export type YouTubeTrack = YouTubePreset;

export interface MusicPlayerState {
  currentVideoId: string;
  isPlaying: boolean;
  volume: number;              // 0 -> 100
  isMuted: boolean;
  customVideoUrl?: string;
}

// 5. Quản lý Hình nền & Visual
export interface Wallpaper {
  id: string;
  title: string;
  category: 'forest' | 'ocean' | 'mountain' | 'cafe' | 'rain' | 'night';
  imageUrl: string;            // URL ảnh 4K chất lượng cao
  thumbnailUrl: string;
}

export interface VisualSettings {
  currentWallpaperId: string;
  darknessOverlay: number;     // 0 -> 80 (%)
  blurAmount: number;          // 0 -> 10 (px)
  isZenMode: boolean;          // Bật/tắt chế độ toàn màn hình tập trung
}

// 6. Quản lý Tài khoản & Xác thực (Auth & User)
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
