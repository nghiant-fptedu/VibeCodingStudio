# VibeSpace - Technical Architecture Document (TECH_ARCHITECTURE.md)

---

## 1. Tổng quan Kiến trúc Hệ thống (System Overview - Monorepo V2)

VibeSpace phát triển theo mô hình **Monorepo Client-Server Fullstack**:
* **Frontend**: Single Page Application (React 18 + Vite + Tailwind CSS) hoạt động theo cơ chế **Hybrid Mode**: Người dùng chưa đăng nhập sử dụng mượt mà qua `localStorage` (Zero-Friction); khi đăng nhập thì tự động đồng bộ (Merge) lên đám mây.
* **Backend**: RESTful API service viết bằng **Express.js + TypeScript**, quản lý xác thực tài khoản (JWT/bcrypt & Google OAuth) và cung cấp API đồng bộ dữ liệu.
* **Database**: **PostgreSQL** lưu trữ trên nền tảng **Supabase**, được truy vấn và ánh xạ kiểu an toàn thông qua **Prisma ORM**.
* **Deployment**: Backend triển khai trên dịch vụ web **Render** thông qua Render MCP; Database quản lý qua Supabase MCP.

```
+-------------------------------------------------------------------------------------------------------+
|                                              CLIENT TIER                                              |
|                                                                                                       |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                            VIBESPACE WEB APP (REACT 18 + VITE)                                  |  |
|  |                                                                                                 |  |
|  |  +------------------+  +------------------+  +-------------------+  +------------------------+  |  |
|  |  | Pomodoro Timer   |  | Lofi Player (YT) |  | Sound Mixer (Web) |  | Daily Todo & Reset     |  |  |
|  |  +------------------+  +------------------+  +-------------------+  +------------------------+  |  |
|  |           |                     |                     |                         |               |  |
|  |           +---------------------+---------------------+-------------------------+               |  |
|  |                                                 |                                               |  |
|  |                      +--------------------------+--------------------------+                    |  |
|  |                      v                                                     v                    |  |
|  |         +--------------------------+                         +--------------------------+       |  |
|  |         |  GUEST MODE: LOCALSTORAGE|                         |   AUTH MODAL & API CLIENT|       |  |
|  |         |  Offline-first cache     |                         |   JWT Bearer / Google ID |       |  |
|  |         +--------------------------+                         +--------------------------+       |  |
|  +----------------------------------------------------------------------------|--------------------+  |
+-------------------------------------------------------------------------------|-----------------------+
                                                                                | HTTPS / REST
                                                                                v
+-------------------------------------------------------------------------------------------------------+
|                                              SERVER TIER                                              |
|                                                                                                       |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                     EXPRESS.JS BACKEND SERVICE (DEPLOYED ON RENDER)                             |  |
|  |                                                                                                 |  |
|  |   +-----------------------+   +-----------------------+   +----------------------------------+  |  |
|  |   | Auth Controller       |   | Tracks Controller     |   | Todos Controller                 |  |  |
|  |   | (bcrypt, JWT, Google) |   | (User Custom Playlist)|   | (Daily Reset Engine on Server)   |  |  |
|  |   +-----------------------+   +-----------------------+   +----------------------------------+  |  |
|  |                                                 |                                               |  |
|  |                                                 v                                               |  |
|  |                              +------------------------------------+                             |  |
|  |                              |        PRISMA ORM CLIENT           |                             |  |
|  |                              +------------------------------------+                             |  |
|  +-------------------------------------------------|-----------------------------------------------+  |
+---------------------------------------------------|---------------------------------------------------+
                                                    | Connection Pooling / SSL
                                                    v
+-------------------------------------------------------------------------------------------------------+
|                                             DATABASE TIER                                             |
|                                                                                                       |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                               SUPABASE MANAGED POSTGRESQL (v17)                                 |  |
|  |                                                                                                 |  |
|  |           [User Table]              [MusicTrack Table]                 [TodoItem Table]         |  |
|  |        - id, email, password     - id, userId, videoId              - id, userId, title         |  |
|  |        - name, googleId, avatar  - title, curator, category         - type (habit / one_off)    |  |
|  |        - lastActiveDate          - isCustom, createdAt              - completed, completedAt    |  |
|  +-------------------------------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------------------------------+
```

---

## 2. Lựa chọn Công nghệ (Technology Stack)

| Thành phần | Công nghệ được chọn | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Monorepo Manager** | **npm workspaces** | Quản lý độc lập `apps/frontend` và `apps/backend` không cần cài đặt thêm công cụ phức tạp. |
| **Frontend Framework** | **React 18 + Vite + TS** | Khởi động tức thì (< 300ms), Hot Module Replacement (HMR) cực nhanh, tối ưu build tĩnh nhẹ nhàng. |
| **Styling** | **Tailwind CSS + CSS Modules** | Giao diện Glassmorphism mờ ảo cao cấp, dễ dàng tùy biến CSS Variables cho bộ lọc hình nền. |
| **Backend Framework** | **Express.js + TypeScript** | Hệ sinh thái Node.js phong phú, linh hoạt, cấu trúc rõ ràng, kiểm soát hoàn toàn API và middleware. |
| **ORM & Schema** | **Prisma ORM** | Type-safe 100% với TypeScript, hỗ trợ schema tập trung và migration tự động lên Supabase PostgreSQL. |
| **Database** | **PostgreSQL (Supabase)** | Cơ sở dữ liệu quan hệ ACID mạnh mẽ, tin cậy, quản lý qua Supabase MCP (project `ynqwfjqiiqjtizagokdt`). |
| **Authentication** | **JWT + bcrypt + Google Identity** | Hash mật khẩu an toàn với bcrypt, token JWT không trạng thái; đăng nhập Google 1-click mượt mà qua Google ID token. |
| **Deployment** | **Render Web Service** | Triển khai nhanh chóng, hỗ trợ auto-deploy từ repository và quản lý biến môi trường qua Render MCP. |
| **YouTube & Audio** | **YouTube IFrame + Web Audio API** | Không cần backend proxy, âm thanh thiên nhiên 10 kênh đa tầng loopable mượt mà. |
| **Internationalization (i18n)** | **Custom React Context (`I18nContext`)** | Zero-dependency, type-safe 100%, tải tức thì không giật lag, lưu cache `localStorage`. |
| **Offline Cache** | **Browser `localStorage`** | Đảm bảo tính riêng tư 100% cho chế độ Guest, tự động đồng bộ khi chuyển sang tài khoản đã đăng nhập. |

---

## 3. Cấu trúc Thư mục Dự án (Project Directory Structure - Monorepo)

Dự án được tổ chức theo kiến trúc **Monorepo** sử dụng **npm workspaces**, phân tách rõ ràng giữa ứng dụng Client (`apps/frontend`) và dịch vụ Backend (`apps/backend`):

```
vibespace/ (Monorepo Root)
├── apps/
│   ├── frontend/                  # Ứng dụng Web VibeSpace Client (React 18 + Vite)
│   │   ├── public/                # File âm thanh, wallpapers, icons tĩnh
│   │   │   ├── wallpapers/
│   │   │   ├── favicon.svg
│   │   │   └── icons.svg
│   │   ├── src/
│   │   │   ├── assets/            # Hình ảnh, logo
│   │   │   ├── components/        # React components
│   │   │   │   ├── background/
│   │   │   │   │   ├── BackgroundContainer.tsx
│   │   │   │   │   └── BackgroundSelector.tsx
│   │   │   │   ├── pomodoro/
│   │   │   │   │   ├── PomodoroTimer.tsx
│   │   │   │   │   └── ZenPomodoro.tsx
│   │   │   │   ├── music/
│   │   │   │   │   ├── YouTubePlayer.tsx
│   │   │   │   │   └── PlaylistModal.tsx
│   │   │   │   ├── mixer/
│   │   │   │   │   ├── SoundMixerModal.tsx
│   │   │   │   │   └── SoundChannelCard.tsx
│   │   │   │   ├── todo/
│   │   │   │   │   └── TodoDrawer.tsx
│   │   │   │   └── common/
│   │   │   │       ├── Header.tsx
│   │   │   │       └── RealtimeClock.tsx
│   │   │   ├── hooks/             # Custom hooks (usePomodoro, useDailyReset, useAudioMixer, etc.)
│   │   │   ├── data/              # Curated playlists, wallpapers, soundTracks
│   │   │   ├── types/             # TypeScript types & interfaces
│   │   │   ├── utils/             # Helpers (youtubeParser, timeFormatter, etc.)
│   │   │   ├── App.tsx            # Root component & Zen mode controller
│   │   │   ├── index.css          # Tailwind directives & Glassmorphism styles
│   │   │   └── main.tsx           # Entry point React
│   │   ├── index.html
│   │   ├── package.json           # @vibespace/frontend scripts & dependencies
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   │
│   └── backend/                   # Thư mục mã nguồn backend (sẵn sàng mở rộng API/Service)
│       ├── .gitkeep
│       └── README.md
│
├── docs/                          # Bộ tài liệu dự án
│   ├── PRD.md
│   ├── TECH_ARCHITECTURE.md
│   ├── PLAN.md
│   └── COMPONENT_SPECS.md
├── stitch-designs/                # File thiết kế & Design tokens từ Google Stitch
├── .agents/                       # Agent rules, workflows & skills
├── package.json                   # Cấu hình Monorepo Root với npm workspaces
├── package-lock.json
└── README.md
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

### 4.3 Cấu trúc Schema Cơ sở Dữ liệu PostgreSQL (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  password       String?      // Nullable nếu đăng nhập hoàn toàn qua Google
  name           String
  avatar         String?
  googleId       String?      @unique
  lastActiveDate String?      // Định dạng "YYYY-MM-DD" phục vụ Daily Reset
  wallpaperId    String       @default("pine-forest") @map("wallpaper_id")
  darknessOverlay Int         @default(35) @map("darkness_overlay")
  blurAmount     Int          @default(0) @map("blur_amount")
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  tracks         MusicTrack[]
  todos          TodoItem[]

  @@map("users")
}

model MusicTrack {
  id        String   @id @default(uuid())
  userId    String
  videoId   String
  title     String
  curator   String
  category  String   @default("custom") // lofi, ambient, custom...
  isCustom  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("music_tracks")
}

model TodoItem {
  id          String    @id @default(uuid())
  userId      String
  title       String
  type        String    @default("one_off") // habit hoặc one_off
  completed   Boolean   @default(false)
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("todo_items")
}
```

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

### 5.4 Đặc tả Hợp đồng REST API Backend (`/api`)

Tất cả các endpoint yêu cầu xác thực (`Protected`) sử dụng Header: `Authorization: Bearer <JWT_TOKEN>`.

| Phương thức | Endpoint | Auth | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Đăng ký tài khoản (email, password, name) -> trả về token & user info |
| `POST` | `/api/auth/login` | Public | Đăng nhập bằng email & password -> trả về token & user info |
| `POST` | `/api/auth/google` | Public | Xác thực Google ID Token từ client -> tìm/tạo user -> trả về token |
| `GET` | `/api/auth/me` | Protected | Lấy thông tin tài khoản hiện tại |
| `GET` | `/api/tracks` | Protected | Lấy danh sách playlist bài hát của user (nếu rỗng tự động seed 6 bài mặc định) |
| `POST` | `/api/tracks` | Protected | Thêm bài hát mới vào playlist cá nhân (videoId, title, curator, category) |
| `DELETE` | `/api/tracks/:id` | Protected | Xóa bài hát khỏi playlist cá nhân theo ID |
| `POST` | `/api/tracks/restore-defaults` | Protected | Khôi phục playlist về 6 bài mặc định ban đầu |
| `GET` | `/api/todos` | Protected | Lấy danh sách todos (tự động kích hoạt Backend Daily Reset nếu sang ngày mới) |
| `POST` | `/api/todos` | Protected | Thêm task hoặc habit mới |
| `PATCH` | `/api/todos/:id` | Protected | Cập nhật trạng thái completed hoặc đổi tiêu đề |
| `DELETE` | `/api/todos/:id` | Protected | Xóa task/habit theo ID |
| `POST` | `/api/sync/merge` | Protected | Đồng bộ gộp (merge) dữ liệu từ localStorage lên tài khoản sau khi login |
| `PATCH` | `/api/auth/visual-settings` | Protected | Cập nhật hình nền và độ tối/mờ lên tài khoản (wallpaperId, darknessOverlay, blurAmount) |

---

## 6. Chiến lược Hiệu năng & Tối ưu Giao diện (Performance & UI Guidelines)

1. **Lazy Loading 4K Wallpapers**: Sử dụng hiệu ứng mờ (Progressive Blur-up): hiển thị một ảnh kích thước siêu nhẹ (~10KB blurred preview) trước khi ảnh 4K hoàn tất tải về, tránh hiện tượng màn hình trắng hoặc chớp nháy.
2. **GPU Acceleration**: Các hiệu ứng mờ (backdrop-blur) và chuyển đổi nền (fade transition) sử dụng thuộc tính CSS `will-change: transform, opacity` và tăng tốc phần cứng thông qua GPU.
3. **Audio Preload Strategy**: Chỉ preload metadata của các file âm thanh (`preload="metadata"`), chỉ tải toàn bộ dữ liệu âm thanh khi người dùng kích hoạt kênh đó hoặc áp dụng Sound Preset, tiết kiệm băng thông tối đa.
4. **Clean DOM in Zen Mode**: Khi người dùng bật Zen Mode, các widget xung quanh sử dụng CSS `opacity: 0` và `pointer-events: none` thay vì unmount hoàn toàn khỏi DOM, giúp các tiến trình (nhạc đang phát, timer đang chạy) tiếp tục chạy ngầm ổn định mà không bị reload lại.
5. **Sign Out & SPA Clean Reset Lifecycle (FR-12)**:
   * **Cơ chế**: Không reload trang (`window.location.reload()`) nhằm giữ vững trải nghiệm mượt mà, không chớp nháy màn hình.
   * **Quy trình Reset Nguyên khối (Atomic SPA Reset)**:
     1. `setIsPlayingMusic(false)` & nạp lại bài hát đầu tiên trong playlist mặc định.
     2. `mixer.muteAll()`: Tắt toàn bộ 10 kênh âm thanh thiên nhiên White Noise.
     3. `pomodoro.changeMode('focus')`: Dừng đếm ngược và đặt lại thời gian về 25:00.
     4. `setVisualSettings`: Thoát Zen Mode (`isZenMode: false`) nhưng bảo lưu hình nền và độ tối/mờ hiện tại tại máy cục bộ để duy trì không gian thị giác người dùng yêu thích.
     5. Đóng toàn bộ Modals/Drawers (`isWallpaperModalOpen`, `isMixerModalOpen`, `isTodoDrawerOpen`, `isPlaylistModalOpen`, `isUserMenuOpen`).
     6. `playlist.resetToGuestDefaults()`: Gán lại 6 bài hát Lofi gốc và cập nhật `localStorage`.
     7. `todo.resetToGuestDefaults()`: Gán lại 5 việc/thói quen mẫu ban đầu và cập nhật `localStorage`.
     8. Giữ nguyên cài đặt ngôn ngữ hiện tại (`vibespace_language`).
   * **Cơ chế kích hoạt kép (Double-layer Trigger)**:
     * Kích hoạt trực tiếp qua hàm `handleSignOutReset()` khi người dùng click vào nút Đăng xuất trên `Header`.
     * Kích hoạt tự động qua `useEffect` theo dõi biến đổi `isAuthenticated` từ `true` sang `false` để xử lý các tình huống phiên hết hạn (Session expired / 401 Unauthorized).

6. **Kiến trúc Điều Hướng Di Động Đa Tầng (Mobile Responsive Navigation Architecture - FR-14)**:
   * **Phân định Breakpoint**: Sử dụng chuẩn Tailwind CSS `md:` (768px) làm mốc phân tách:
     * `Screen >= 768px (Desktop/Tablet)`: Duy trì nguyên vẹn thanh điều hướng ngang với đầy đủ 7 nút công cụ trực quan.
     * `Screen < 768px (Mobile Viewport)`: Tự động kích hoạt bố cục Header tối giản kết hợp Slide-in Menu Drawer.
   * **Bố cục Top Header trên Mobile**:
     * Trái: Logo VibeSpace (Sparkles icon + Gradient Brand text).
     * Phải: Nút Zen Mode (kích hoạt nhanh 1 chạm) + Nút Hamburger Menu ☰ (icon `Menu` của Lucide).
   * **Slide-in Mobile Menu Drawer**:
     * Trượt mượt mà từ cạnh phải (`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] glass-panel border-l border-white/15 shadow-2xl`).
     * Lớp phủ nền mờ đục (`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity`).
     * **Hộp thoại người dùng & Công cụ**:
       1. Header Drawer: Tiêu đề "Menu" và nút đóng "X".
       2. User Profile Card: Hiển thị avatar, tên, email, trạng thái đồng bộ cloud, nút Đăng xuất (hoặc nút Đăng nhập / Đăng ký nếu là Guest).
       3. Quick Tools List: Danh sách các công cụ (Mixer có badge số lượng âm đang mở, Todo List có badge % hoàn thành, Wallpaper Selector, Master Mute toggle).
       4. Language Switcher: Bộ chuyển đổi Tiếng Việt / Tiếng Anh dạng Pill trực quan.
   * **Trải nghiệm tương tác đơn tầng (Single-level Focus)**: Khi người dùng chạm chọn một công cụ (Mixer, Todo, Wallpaper, Đăng nhập), Menu Drawer tự động trượt đóng lại và mở ngay modal/drawer của tính năng đó, tránh tình trạng nhiều lớp popup chồng đè lên nhau gây rối mắt trên điện thoại.
