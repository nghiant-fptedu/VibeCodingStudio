# VibeSpace - Đặc tả Chuyển đổi React Component (COMPONENT_SPECS.md)

Tài liệu này đặc tả chi tiết cấu trúc các Component React được bóc tách từ thiết kế Google Stitch (`Lofi Nightfall Workspace`), phục vụ trực tiếp cho Giai đoạn 4 (Implementation).

---

## 1. Cấu trúc Tổng thể & Phân rã Component Hierarchy

```
App
├── BackgroundContainer (ảnh nền 4K + filter overlay)
├── ZenModeToggle (nút chuyển đổi Zen Mode góc phải)
│
├── [Standard View Mode]
│   ├── Header (Top navigation, logo, quote, clock, quick action pills)
│   ├── PomodoroTimer (Hero central card, 25:00 readout, progress ring, control buttons)
│   ├── YouTubePlayer (Dock mini bar đáy màn hình, playback, volume, preset switchers)
│   ├── SoundMixerTrigger (Nút nổi bên trái)
│   ├── TodoDrawerTrigger (Nút nổi bên phải với progress badge)
│   │
│   ├── SoundMixerModal (Overlay modal hòa âm 10 kênh)
│   │   ├── PresetCombos (1-click preset pills: Stormy Night, Fireplace, etc.)
│   │   └── SoundChannelCard (Danh sách 10 thẻ âm thanh với slider độc lập)
│   │
│   ├── TodoDrawer (Drawer trượt bên phải)
│   │   ├── TodoProgressBar (Thanh tiến độ % hoàn thành)
│   │   ├── HabitList (Thói quen lặp lại hàng ngày - auto uncheck sau 00:00)
│   │   ├── DailyTaskList (Danh sách việc trong ngày)
│   │   └── AddTaskInput (Thanh nhập việc mới nhanh)
│   │
│   └── BackgroundSelectorModal (Lưới chọn hình nền + thanh trượt Darkness & Blur)
│
└── [Minimalist Zen View Mode]
    └── ZenPomodoro (Đồng hồ đếm ngược tối giản toàn màn hình, mờ ảo)
```

---

## 2. Chi tiết Đặc tả Từng Component

### 2.1 `BackgroundContainer.tsx`
* **Vị trí**: Bao phủ toàn bộ viewport (`fixed inset-0 z-0`).
* **Nguồn Stitch**: Screen 1 (`screen-1-main-dashboard.html:L166-L172`).
* **Props**:
  ```typescript
  interface BackgroundContainerProps {
    imageUrl: string;
    darknessOverlay: number; // 0 - 80 (%)
    blurAmount: number;      // 0 - 10 (px)
    children?: React.ReactNode;
  }
  ```
* **Tailwind & CSS Trích xuất**:
  * Hình nền: `absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out`.
  * Lớp phủ tối (Overlay): `absolute inset-0 bg-background/55 backdrop-blur-[2px]`.
  * Lớp gradient chiều sâu: `bg-gradient-to-t from-background via-background/25 to-surface-container-lowest/40`.

---

### 2.2 `Header.tsx`
* **Vị trí**: Cố định đỉnh màn hình (`fixed top-0 left-0 w-full z-40`).
* **Nguồn Stitch**: Screen 1 & Screen 2 (`screen-2-modals-drawers.html:L174-L220`).
* **Props**:
  ```typescript
  interface HeaderProps {
    onOpenWallpaperModal: () => void;
    onToggleZenMode: () => void;
    isMuted: boolean;
    onToggleMasterMute: () => void;
  }
  ```
* **Chi tiết Thành phần**:
  * **Logo**: Icon sóng âm (`graphic_eq` hoặc Lucide `Activity`), chữ `VibeSpace` màu `text-primary font-bold tracking-tight text-xl`.
  * **Quote Badge**: `"Find your flow"` với `px-3 py-0.5 rounded-full bg-surface-container-high/40 border border-white/10 text-xs text-on-surface-variant`.
  * **Digital Clock**: Hiển thị thời gian thực với chấm tròn phát sáng: `<span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>`.
  * **Zen Mode Button**: `px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-container to-amber-600 text-slate-950 font-semibold shadow-lg hover:shadow-amber-500/20 active:scale-95`.

---

### 2.3 `PomodoroTimer.tsx`
* **Vị trí**: Đặt tại vị trí trung tâm Hero của màn hình (`center hero widget`).
* **Nguồn Stitch**: Screen 1 (`screen-1-main-dashboard.html:L225-L310`).
* **Props**:
  ```typescript
  interface PomodoroTimerProps {
    timeLeft: number;           // tính bằng giây
    mode: 'focus' | 'shortBreak' | 'longBreak';
    isRunning: boolean;
    completedSessions: number;
    targetSessions: number;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onSkip: () => void;
    onChangeMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
    onToggleZen: () => void;
  }
  ```
* **Tailwind & CSS Trích xuất**:
  * Khung Card: `p-8 rounded-3xl bg-surface-container-low/65 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-md w-full text-center relative`.
  * Vòng SVG Circular Progress: `w-64 h-64 mx-auto relative flex items-center justify-center`.
  * Số đếm giờ: `font-mono text-6xl text-primary font-light tracking-tight tabular-nums select-none drop-shadow-[0_0_15px_rgba(255,193,116,0.35)]`.
  * Nút Start chính: `px-8 py-3 rounded-full bg-gradient-to-r from-primary to-amber-500 text-slate-950 font-bold text-lg shadow-lg hover:shadow-amber-500/30 active:scale-95 transition-all`.

---

### 2.4 `YouTubePlayer.tsx` (Lofi Music Dock)
* **Vị trí**: Thanh nổi neo cố định dưới đáy màn hình (`fixed bottom-6 left-1/2 -translate-x-1/2 z-40`).
* **Nguồn Stitch**: Screen 1 (`screen-1-main-dashboard.html:L330-L420`).
* **Props**:
  ```typescript
  interface YouTubePlayerProps {
    currentTrackTitle: string;
    isPlaying: boolean;
    volume: number;
    presets: Array<{ id: string; title: string; videoId: string }>;
    activePresetId: string;
    onPlayPause: () => void;
    onVolumeChange: (vol: number) => void;
    onSelectPreset: (id: string) => void;
    onCustomUrlSubmit: (url: string) => void;
  }
  ```
* **Tailwind & CSS Trích xuất**:
  * Khung Dock: `px-6 py-3.5 rounded-full bg-slate-950/75 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-6 max-w-4xl w-[90vw]`.
  * Animated Sound Bar (khi phát nhạc): 4 cột nhỏ nhấp nháy theo nhịp điệu (keyframe `barPulse`).
  * Preset Pills: `px-3 py-1 rounded-full text-xs font-medium transition-all` (pill active có viền `border-primary/60 bg-primary/20 text-primary`).
  * Custom Link Trigger: Nút icon dán link với input popup nhỏ.

---

### 2.5 `SoundMixerModal.tsx` & `SoundChannelCard.tsx`
* **Vị trí**: Modal nổi hoặc Slide-over Panel xuất hiện khi người dùng bấm vào biểu tượng Sound Mixer.
* **Nguồn Stitch**: Screen 2 (`screen-2-modals-drawers.html:L225-L410`).
* **Props (`SoundChannelCard`)**:
  ```typescript
  interface SoundChannelCardProps {
    id: string;
    title: string;
    icon: string;
    volume: number;
    isActive: boolean;
    onToggle: (id: string) => void;
    onVolumeChange: (id: string, vol: number) => void;
  }
  ```
* **Tailwind & CSS Trích xuất**:
  * Khung Modal: `rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 p-7 shadow-2xl max-w-2xl w-full`.
  * Thẻ âm thanh độc lập: `p-3.5 rounded-2xl bg-surface-container-high/30 border border-white/5 flex flex-col gap-2 hover:border-white/15 transition-all`.
  * Active Indicator: Chấm đèn xanh `w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#57e1ce]`.
  * Volume Slider: `input[type=range]` với custom thumb amber glow.

---

### 2.6 `TodoDrawer.tsx`
* **Vị trí**: Drawer trượt từ cạnh phải màn hình (`fixed top-0 right-0 h-full w-96 z-50 transform transition-transform duration-300`).
* **Nguồn Stitch**: Screen 2 (`screen-2-modals-drawers.html:L420-L580`).
* **Props**:
  ```typescript
  interface TodoDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    habits: TodoItem[];
    tasks: TodoItem[];
    onToggleItem: (id: string) => void;
    onAddItem: (title: string, type: 'habit' | 'one_off') => void;
    onDeleteItem: (id: string) => void;
  }
  ```
* **Tailwind & CSS Trích xuất**:
  * Khung Drawer: `bg-slate-950/85 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col h-full shadow-2xl`.
  * Progress Bar: Gradient từ `bg-gradient-to-r from-tertiary to-primary h-2 rounded-full`.
  * Habit Item Checked: `line-through text-slate-500 opacity-70` với checkbox tròn màu `bg-tertiary text-slate-950`.

---

### 2.7 `ZenPomodoro.tsx`
* **Vị trí**: Toàn màn hình khi kích hoạt Zen Mode.
* **Nguồn Stitch**: Screen 3 (`screen-3-zen-mode.html:L150-L240`).
* **Props**:
  ```typescript
  interface ZenPomodoroProps {
    timeLeft: number;
    isRunning: boolean;
    onTogglePlay: () => void;
    onExitZen: () => void;
    audioTrackTitle?: string;
  }
  ```
* **Tailwind & CSS Trích xuất**:
  * Khung mờ tối giản: `p-10 rounded-2xl bg-surface-container-low/40 backdrop-blur-2xl border border-white/10 text-center shadow-[0_0_45px_rgba(245,158,11,0.15)]`.
  * Timer Display: `font-mono text-7xl text-primary font-light tracking-tight select-none drop-shadow-[0_0_20px_rgba(255,193,116,0.4)]`.
  * Exit Zen Pill: `absolute top-8 right-8 px-4 py-2 rounded-full bg-slate-950/40 hover:bg-slate-900/60 border border-white/10 text-xs backdrop-blur-xl transition-all`.
