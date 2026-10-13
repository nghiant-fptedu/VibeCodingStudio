# VibeSpace - Technical Architecture Document (TECH_ARCHITECTURE.md)

---

## 1. Tổng quan Kiến trúc Hệ thống (System Overview)

VibeSpace được thiết kế theo mô hình **Client-Side Single Page Application (SPA)** thuần túy. Ứng dụng không cần backend hay database tập trung, toàn bộ logic nghiệp vụ, quản lý trạng thái âm thanh, hình ảnh và dữ liệu công việc được thực thi và lưu trữ trực tiếp trên trình duyệt của người dùng thông qua `localStorage` và `Web Audio API`.

```
+-----------------------------------------------------------------------------------+
|                                 USER BROWSER                                      |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             REACT 18 + VITE APP                             |  |
|  |                                                                             |  |
|  |  +---------------------+  +----------------------+  +--------------------+  |  |
|  |  |   Central Pomodoro  |  |  YouTube Music Player|  | Ambient Sound Mixer|  |  |
|  |  |   (Timer State)     |  |  (YT IFrame API)     |  | (Web Audio Engine) |  |  |
|  |  +---------------------+  +----------------------+  +--------------------+  |  |
|  |                                                                             |  |
|  |  +---------------------+  +----------------------+  +--------------------+  |  |
|  |  |   Daily Todo List   |  | Background Gallery   |  |  Zen / Focus Mode  |  |  |
|  |  | (Daily Reset Engine)|  | (4K CSS Filter Engine|  | (Full UI Toggle)   |  |  |
|  |  +---------------------+  +----------------------+  +--------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|                                         v                                         |
|               +--------------------------------------------------+                |
|               |        APP CONTEXT & LOCAL STORAGE SYNC          |                |
|               |  - User Preferences (Volume, Presets, Dark/Blur) |                |
|               |  - Daily Habits & Tasks (Last Active Date Check) |                |
|               |  - Pomodoro Custom Durations                     |                |
|               +--------------------------------------------------+                |
|                                         |                                         |
|                     +-------------------+-------------------+                     |
|                     v                                       v                     |
|        +-------------------------+             +-------------------------+        |
|        |    BROWSER AUDIO API    |             |    YOUTUBE IFRAME API   |        |
|        | Multi-track Loop Player |             | Embedded Audio Stream   |        |
|        +-------------------------+             +-------------------------+        |
+-----------------------------------------------------------------------------------+
```

---

## 2. Lựa chọn Công nghệ (Technology Stack)

| Thành phần | Công nghệ được chọn | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Framework & Bundler** | **React 18 + Vite** | Khởi động tức thì (< 300ms), Hot Module Replacement (HMR) cực nhanh, tối ưu build tĩnh nhẹ nhàng. |
| **Ngôn ngữ** | **TypeScript** | Đảm bảo tính chặt chẽ về mặt kiểu dữ liệu cho Todo items, Audio mixer channels, Pomodoro states và Settings. |
| **Styling** | **Tailwind CSS + CSS Modules** | Xây dựng giao diện Glassmorphism mờ ảo cao cấp, dễ dàng tùy biến CSS Variables cho bộ lọc hình nền và bảng màu. |
| **Icons** | **Lucide React** | Bộ icon vector tối giản, sắc nét, dung lượng nhẹ, hỗ trợ đầy đủ các biểu tượng âm thanh, thời gian, công việc. |
| **YouTube Player** | **YouTube IFrame Player API** | Không cần backend proxy, không tốn quota của YouTube Data API, hỗ trợ điều khiển Play/Pause/Volume chính thức. |
| **Audio Engine** | **HTML5 Audio / Web Audio API** | Cho phép phát đồng thời 10+ track âm thanh môi trường độc lập, loop mượt mà không bị ngắt quãng, điều chỉnh volume từng kênh qua GainNode. |
| **Lưu trữ dữ liệu** | **Browser `localStorage`** | Đảm bảo tính riêng tư 100%, không cần kết nối mạng để lưu task, khôi phục trạng thái làm việc ngay khi mở lại tab. |

---

## 3. Cấu trúc Thư mục Dự án (Project Directory Structure)

```
vibespace/
├── public/
│   ├── audio/                     # Các file âm thanh white noise chất lượng cao (.mp3 / .ogg)
│   │   ├── rain.mp3
│   │   ├── thunder.mp3
│   │   ├── campfire.mp3
│   │   ├── wind.mp3
│   │   ├── waves.mp3
│   │   ├── stream.mp3
│   │   ├── birds.mp3
│   │   ├── cafe.mp3
│   │   ├── keyboard.mp3
│   │   └── crickets.mp3
│   ├── sounds/                    # Âm báo chuông Pomodoro
│   │   └── zen-bell.mp3
│   └── favicon.svg
├── src/
│   ├── assets/                    # Hình ảnh, logo, placeholder
│   ├── components/
│   │   ├── background/
│   │   │   ├── BackgroundContainer.tsx
│   │   │   ├── BackgroundSelector.tsx
│   │   │   └── FilterControls.tsx
│   │   ├── pomodoro/
│   │   │   ├── PomodoroTimer.tsx
│   │   │   ├── PomodoroControls.tsx
│   │   │   └── PomodoroSettingsModal.tsx
│   │   ├── music/
│   │   │   ├── YouTubePlayer.tsx
│   │   │   ├── PresetSelector.tsx
│   │   │   └── CustomUrlModal.tsx
│   │   ├── mixer/
│   │   │   ├── SoundMixerModal.tsx
│   │   │   ├── SoundChannelCard.tsx
│   │   │   └── PresetCombos.tsx
│   │   ├── todo/
│   │   │   ├── TodoDrawer.tsx
│   │   │   ├── HabitList.tsx
│   │   │   ├── DailyTaskList.tsx
│   │   │   └── TodoProgressBar.tsx
│   │   └── common/
│   │       ├── GlassCard.tsx
│   │       ├── Slider.tsx
│   │       └── Tooltip.tsx
│   ├── context/
│   │   ├── AppContext.tsx          # Context toàn cục liên kết các module
│   │   ├── AudioContext.tsx        # Quản lý phát nhạc & white noise
│   │   └── TodoContext.tsx         # Quản lý task & logic reset ngày
│   ├── hooks/
│   │   ├── useLocalStorage.ts      # Custom hook đồng bộ hóa state với localStorage
│   │   ├── usePomodoro.ts          # Custom hook logic đếm giờ Pomodoro
│   │   ├── useDailyReset.ts        # Custom hook kiểm tra và kích hoạt reset theo ngày
│   │   └── useAudioMixer.ts        # Custom hook điều khiển Web Audio mixer
│   ├── data/
│   │   ├── curatedPlaylists.ts     # Danh sách preset YouTube Lofi
│   │   ├── defaultWallpapers.ts    # Danh sách hình nền 4K tuyển chọn
│   │   └── soundTracks.ts          # Metadata các kênh âm thanh môi trường
│   ├── types/
│   │   ├── index.ts                # TypeScript Interfaces & Types
│   │   ├── audio.ts
│   │   ├── pomodoro.ts
│   │   └── todo.ts
│   ├── utils/
│   │   ├── youtubeParser.ts        # Hàm trích xuất Video ID từ YouTube URL
│   │   ├── timeFormatter.ts        # Hàm format mm:ss
│   │   └── dateHelper.ts           # Hàm kiểm tra so sánh ngày YYYY-MM-DD
│   ├── App.tsx                     # Layout tổng thể & Zen mode controller
│   ├── index.css                   # Tailwind directives & Glassmorphism styles
│   └── main.tsx                    # Entry point React
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Đặc tả Kiểu Dữ liệu & Schema Lưu trữ (Data Models & Contracts)

### 4.1 TypeScript Interfaces (`src/types/index.ts`)

```typescript
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
  icon: string;                // Tên Lucide icon
  audioSrc: string;            // Đường dẫn file âm thanh
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
  category: 'lofi' | 'ambient' | 'synthwave' | 'piano';
}

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
```

### 4.2 LocalStorage Keys Mapping

| Key Name | Type | Mục đích |
| :--- | :--- | :--- |
| `vibespace_todos_v1` | `TodoState` | Danh sách công việc, thói quen và ngày kích hoạt gần nhất |
| `vibespace_pomodoro_cfg_v1`| `PomodoroConfig` | Thời lượng cài đặt cá nhân cho các phiên Pomodoro |
| `vibespace_pomodoro_stats` | `{ date: string, count: number }` | Thống kê số phiên Pomodoro hoàn thành trong ngày |
| `vibespace_mixer_v1` | `{ [channelId: string]: { volume: number, isActive: boolean } }` | Trạng thái bật/tắt và âm lượng của 10 kênh White Noise |
| `vibespace_music_v1` | `{ videoId: string, volume: number }` | Video YouTube đang phát và mức âm lượng đã chỉnh |
| `vibespace_visual_v1`| `VisualSettings` | Hình nền đang chọn, mức làm mờ và mức làm tối nền |

---

## 5. Kiến trúc Các Module Cốt lõi (Core Engine Architectures)

### 5.1 Động cơ Quản lý Reset theo ngày (Daily Reset Engine)
Để giải quyết bài toán: **Thói quen lặp lại (Habits) tự động bỏ tích mỗi ngày mới**, và **Công việc trong ngày (One-off) đã xong tự dọn dẹp, chưa xong được giữ lại**:

```typescript
// Pseudo-code logic thực thi trong useDailyReset
export function executeDailyCheck(currentState: TodoState): TodoState {
  const today = getTodayFormatted(); // "YYYY-MM-DD"
  
  if (currentState.lastActiveDate === today) {
    return currentState; // Cùng một ngày, giữ nguyên
  }

  // Bước sang ngày mới:
  const updatedItems = currentState.items
    // 1. Loại bỏ các task one-off đã hoàn thành từ ngày cũ
    .filter(item => !(item.type === 'one_off' && item.completed))
    // 2. Reset các thói quen hàng ngày (Daily habits) về trạng thái chưa làm
    .map(item => {
      if (item.type === 'habit') {
        return { ...item, completed: false, completedAt: undefined };
      }
      return item; // Task one-off chưa làm xong được giữ nguyên
    });

  return {
    items: updatedItems,
    lastActiveDate: today,
  };
}
```
* **Thời điểm kích hoạt**:
  1. Khi ứng dụng khởi động (`componentDidMount` / `useEffect`).
  2. Khi người dùng quay lại tab trình duyệt sau một thời gian dài (lắng nghe sự kiện `document.addEventListener('visibilitychange')`).

### 5.2 Động cơ Âm thanh Môi trường (Web Audio Multi-Channel Engine)
Mỗi kênh âm thanh được khởi tạo bằng một phần tử `HTMLAudioElement` độc lập với thuộc tính `loop = true`.
* **Tránh lỗi Browser Autoplay Policy**: Trình duyệt hiện đại chặn âm thanh tự động phát khi người dùng chưa tương tác với trang. Audio Engine duy trì trạng thái `isAudioContextUnlocked`. Khi người dùng thực hiện cú click đầu tiên (như bấm Play hoặc chỉnh Volume), toàn bộ các audio element sẽ được unlock đồng loạt.
* **Volume Control**: Sử dụng đường cong âm lượng phi tuyến tính (Logarithmic Volume Curve) để trải nghiệm điều chỉnh tai người nghe mượt mà, không bị đột ngột.

### 5.3 Tích hợp Trình phát YouTube (YouTube IFrame API Bridge)
* Nhúng IFrame thông qua thư viện hỗ trợ hoặc custom component tạo phần tử `<div id="yt-audio-player">`.
* IFrame được ẩn hoặc thu nhỏ trong thanh phát nhạc tinh tế (kích thước mini hoặc ẩn hoàn toàn khung hình nếu người dùng chỉ muốn nghe nhạc, đảm bảo tuân thủ hiển thị của YouTube khi cần).
* Sử dụng API `player.setVolume(volume)` và `player.loadVideoById(videoId)` để điều khiển hai chiều.
* Regex parser thông minh hỗ trợ trích xuất video ID từ đa dạng định dạng link:
  * `https://www.youtube.com/watch?v=VIDEO_ID`
  * `https://youtu.be/VIDEO_ID`
  * `https://www.youtube.com/live/VIDEO_ID`

---

## 6. Chiến lược Hiệu năng & Tối ưu Giao diện (Performance & UI Guidelines)

1. **Lazy Loading 4K Wallpapers**: Sử dụng hiệu ứng mờ (Progressive Blur-up): hiển thị một ảnh kích thước siêu nhẹ (~10KB blurred preview) trước khi ảnh 4K hoàn tất tải về, tránh hiện tượng màn hình trắng hoặc chớp nháy.
2. **GPU Acceleration**: Các hiệu ứng mờ (backdrop-blur) và chuyển đổi nền (fade transition) sử dụng thuộc tính CSS `will-change: transform, opacity` và tăng tốc phần cứng thông qua GPU.
3. **Audio Preload Strategy**: Chỉ preload metadata của các file âm thanh (`preload="metadata"`), chỉ tải toàn bộ dữ liệu âm thanh khi người dùng kích hoạt kênh đó hoặc áp dụng Sound Preset, tiết kiệm băng thông tối đa.
4. **Clean DOM in Zen Mode**: Khi người dùng bật Zen Mode, các widget xung quanh sử dụng CSS `opacity: 0` và `pointer-events: none` thay vì unmount hoàn toàn khỏi DOM, giúp các tiến trình (nhạc đang phát, timer đang chạy) tiếp tục chạy ngầm ổn định mà không bị reload lại.
