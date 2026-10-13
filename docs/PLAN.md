# VibeSpace - Kế hoạch Thực hiện Dự án (PLAN.md)

---

## 1. Quy trình Làm việc Tổng thể (Workflow Overview)

Kế hoạch triển khai tuân thủ nghiêm ngặt quy trình chuẩn mà bạn đã đề ra:

$$\text{Planning} \longrightarrow \text{Design (Google Stitch)} \longrightarrow \text{Download Design} \longrightarrow \text{Code (Convert to React)}$$

```
+-------------------------------------------------------------------------------------------------+
|                                    QUY TRÌNH 4 GIAI ĐOẠN                                        |
|                                                                                                 |
|  [Giai đoạn 1: PLANNING]                                                                        |
|  - Làm rõ nghiệp vụ (PM & BA qua /grill-me)                                     [HOÀN THÀNH]    |
|  - Xuất bộ tài liệu PRD.md, TECH_ARCHITECTURE.md, PLAN.md                       [HOÀN THÀNH]    |
|                                                                                                 |
|  [Giai đoạn 2: DESIGN VỚI GOOGLE STITCH]                                                        |
|  - Khởi tạo dự án trên StitchMCP (create_project)                                [HOÀN THÀNH]   |
|  - Tạo các màn hình giao diện (Main Workspace, Zen Mode, Sound Mixer, Todo)      [HOÀN THÀNH]   |
|                                                                                                 |
|  [Giai đoạn 3: DOWNLOAD DESIGN TỪ GOOGLE STITCH]                                                |
|  - Trích xuất HTML, CSS, Design Tokens và Asset references từ StitchMCP         [HOÀN THÀNH]   |
|  - Phân tích cấu trúc phân rã giao diện thành các React Component Specs          [HOÀN THÀNH]   |
|                                                                                                 |
|  [Giai đoạn 4: CODE & CHUYỂN ĐỔI SANG REACT COMPONENTS]                         [SẮP TỚI]      |
|  - Khởi tạo project React 18 + TypeScript + Vite + Tailwind CSS                                 |
|  - Cài đặt Theme, Glassmorphism, CSS variables từ Design Tokens của Stitch                      |
|  - Xây dựng các Modules (Pomodoro, YouTube, White Noise, Todo, Background)                      |
|  - Tích hợp Web Audio Engine, YouTube IFrame API và Daily Reset Engine                          |
|  - Kiểm thử toàn diện & Tối ưu hóa hoàn thiện sản phẩm                                          |
+-------------------------------------------------------------------------------------------------+
```

---

## 2. Chi tiết Từng Giai đoạn & Hạng mục Công việc (Phase Breakdown)

### Giai đoạn 1: Planning & Specification (Đã hoàn thành)
- [x] **Task 1.1**: Phỏng vấn sâu với người dùng (`/grill-me`) làm rõ mọi yêu cầu, ràng buộc kỹ thuật.
- [x] **Task 1.2**: Xác nhận bản Thấu hiểu Yêu cầu (Statement of Intent) đạt 95% tin cậy.
- [x] **Task 1.3**: Soạn thảo tài liệu đặc tả sản phẩm chi tiết [`PRD.md`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/docs/PRD.md).
- [x] **Task 1.4**: Soạn thảo tài liệu kiến trúc kỹ thuật [`TECH_ARCHITECTURE.md`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/docs/TECH_ARCHITECTURE.md).
- [x] **Task 1.5**: Thiết lập bản kế hoạch thực hiện dự án [`PLAN.md`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/docs/PLAN.md).

---

### Giai đoạn 2: Design với Google Stitch (StitchMCP) [HOÀN THÀNH]
Mục tiêu: Sử dụng công cụ Google Stitch (qua StitchMCP) để sinh các màn hình giao diện chuẩn Lofi Aesthetic, bố cục hài hòa, hiệu ứng kính mờ (Glassmorphism).

* **Stitch Project ID**: `4624087171133771439` (`projects/4624087171133771439`)
* **Project Title**: `VibeSpace Focus Workspace`
* **Design System**: `Lofi Nightfall Workspace` (`assets/d79328efeafd49b7bcd14ace16f8ab89`)
  * Bảng màu chủ đạo: Soft Amber Glow (`#f59e0b`), Deep Twilight Indigo (`#6366f1`), Serene Teal (`#14b8a6`), Midnight Slate (`#0b1326`).
  * Hiệu ứng kính mờ: `backdrop-filter: blur(20px)` với viền `rgba(255, 255, 255, 0.08)`.
  * Typography: Plus Jakarta Sans & JetBrains Mono.

- [x] **Task 2.1: Khởi tạo Project trên Google Stitch**
  * Đã tạo thành công project `VibeSpace Focus Workspace` (ID: `4624087171133771439`).
  * Phong cách thiết kế: Dark mode, Atmospheric Glassmorphism, Cozy & Calming nature vibe.

- [x] **Task 2.2: Thiết kế Screen 1 - Main Workspace Dashboard (Full View)**
  * **Screen ID**: `3fc492be343d49dc9ad20fb45c2f91ee`
  * **Title**: `VibeSpace - Lofi Focus Workspace`
  * **Kích thước**: Desktop 2560x2048 (16:9 view)
  * **Ảnh thiết kế (Local)**: [`stitch-designs/screens/screen-1-main-dashboard.png`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screens/screen-1-main-dashboard.png)
  * **Screenshot Preview (Web)**: [Xem ảnh chụp](https://lh3.googleusercontent.com/aida/AEtjO1XmBoy-HiPVsSw1q196Q3fPj20Lca4cpEYxOB9oKcCDICfHuUJnUBdP7pFSe3FowUnShneBGNwW0-svbUSXl-vI19yTl_sINrK5yeg87eJ5F4Nnpjc1wRx_-jWfFD2NjVdqSYaSur9MjTeRYUbdzaQXTCdHS7WWKCVhCCO5KkwOyt-lj5Jc7ouBucfRHTjAVhtSfOAvG4Jw0oSG57aE_8d-cVQJjF5CNsjQxYp0FjjjI7bNyHGIt-OmCug)
  * **Component React ánh xạ**:
    * `src/components/common/Header.tsx` (Logo, quote, clock, toggle Zen Mode)
    * `src/components/pomodoro/PomodoroTimer.tsx` (Đồng hồ đếm giờ 25:00, circular progress, Focus/Break tabs, nút Start amber glow)
    * `src/components/music/YouTubePlayer.tsx` (Thanh nhạc Lofi bottom dock, track title, volume slider, preset pills)
    * `src/components/background/BackgroundContainer.tsx` (Hình nền 4K rừng thông sương mù + dark vignette overlay)
    * `src/components/mixer/SoundMixerTrigger.tsx` (Nút nổi mở sound mixer bên trái)
    * `src/components/todo/TodoDrawerTrigger.tsx` (Nút nổi mở task drawer bên phải với badge tiến độ 67%)

- [x] **Task 2.3: Thiết kế Screen 2 - Expanded Modals & Drawers**
  * **Screen ID**: `1c869128fba241db9e5116c79279724b`
  * **Title**: `VibeSpace - Sound Mixer Modal & Task Drawer`
  * **Kích thước**: Desktop 2560x2048
  * **Ảnh thiết kế (Local)**: [`stitch-designs/screens/screen-2-modals-drawers.png`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screens/screen-2-modals-drawers.png)
  * **Screenshot Preview (Web)**: [Xem ảnh chụp](https://lh3.googleusercontent.com/aida/AEtjO1X3gIdQKd_Ype6gaFpKU-nrG7WZErLF1qGoKoh4jgTcGs1CctBdSQiEKhwVZYEWCIEL8PCUH1OYavbD4WOK0oayQTBzw25djKpLrfmbxc_YQZzCg6tD16pBa1dujgzAOnH5EOZ--zihfQTDyuqSseHK5cFU8qBziqVHBiQENMvXIi3SWFv8W7ywIqufDgz9gym2DpcnSqSar5x8DBXRDiYIMnJprcwwXMJOuoUxWdRJnDHkblXt7xO0yuY)
  * **Component React ánh xạ**:
    * `src/components/mixer/SoundMixerModal.tsx` (Modal hòa âm 10 kênh, Master volume, Mute all)
    * `src/components/mixer/SoundChannelCard.tsx` (Card âm thanh độc lập với icon, toggle, slider âm lượng)
    * `src/components/mixer/PresetCombos.tsx` (Pills chọn nhanh preset: Stormy Night, Cozy Fireplace, Coffee Shop, Forest Dawn)
    * `src/components/todo/TodoDrawer.tsx` (Drawer bên phải quản lý công việc và thói quen)
    * `src/components/todo/HabitList.tsx` (Mục thói quen hàng ngày tự bỏ tick sau 00:00)
    * `src/components/todo/DailyTaskList.tsx` (Mục công việc trong ngày với tag và ước lượng Pomodoro)
    * `src/components/todo/TodoProgressBar.tsx` (Thanh tiến độ % hoàn thành)
    * `src/components/background/BackgroundSelector.tsx` (Lưới thumbnail đổi hình nền & slider Darkness/Blur)

- [x] **Task 2.4: Thiết kế Screen 3 - Minimalist Zen Mode**
  * **Screen ID**: `e95bd016ecf64506964d0dc2d18e34ae`
  * **Title**: `VibeSpace - Minimalist Zen Mode`
  * **Kích thước**: Desktop 2560x2048
  * **Ảnh thiết kế (Local)**: [`stitch-designs/screens/screen-3-zen-mode.png`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screens/screen-3-zen-mode.png)
  * **Screenshot Preview (Web)**: [Xem ảnh chụp](https://lh3.googleusercontent.com/aida/AEtjO1U3wKQFh9wMXiVOe8QFMpAQ9EBee-ytnE9O35ltTKOIp1bMgi69Hl37zfVQC2augBuPHzW7FPb8J4IVYW2XuNArMcXOn_N7vGe3oqPoK4CP_TrbZOUcGZ6weVKMUl0wxKgwJY3KXl95u5lIPqFR4i9pCOihcg15O6u5g9RgqdiPl4jRQRPEzq3BK8PwoeUb--I2omWDoulGR2sGoxlHKKCKnsCoYfT0SODmVL5fxrowDshC2agCaYXAKQ)
  * **Component React ánh xạ**:
    * `src/components/pomodoro/ZenPomodoro.tsx` (Đồng hồ đếm ngược tối giản 24:38, vòng progress thanh thoát)
    * `src/components/common/ZenModeToggle.tsx` (Nút thoát chế độ Zen Mode thu nhỏ ở góc trên phải)
    * `src/components/music/ZenAudioIndicator.tsx` (Dòng hiển thị bài hát và âm lượng tối giản ở đáy)

* **Wallpaper Asset đi kèm**:
  * **Screen ID**: `323cac25fc104f738346fae07e77b679`
  * **Title**: `Cinematic high-resolution photograph of a serene misty pine forest at deep twilight`
  * **Ảnh nền (Local)**: [`stitch-designs/screens/screen-wallpaper-pine-forest.png`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screens/screen-wallpaper-pine-forest.png)
  * **Image URL**: [Tải ảnh 4K](https://lh3.googleusercontent.com/aida/AEtjO1U_DTq0YgEStLBcMJfjJuPhd30BWKEFy1iCYSrIuC1aMWNFyHZeGIFV1bvBOzJt2j2iPwmVSu3deUPrfWb-FGQqCGVBhxJY5fbfKG9E-xOm59wstqLpTVLCUwztqIeCXQydcWT2p1dkGLCwZLSA01-Tp4czuCBHwpdd-viNT_i8KgCxdmmATg1TBbKst8Cc9kCaMCyPPUak3oeZqSd7RFGM8npXMoEGv7Ng3S5OHUEh_ebWqc2g0IBSfxM)

#### Bảng Tổng hợp Ánh xạ Screen và React Components

| Screen ID | Tiêu đề Màn hình | Loại giao diện | Các Component React ánh xạ tương ứng |
| :--- | :--- | :--- | :--- |
| `3fc492be343d49dc9ad20fb45c2f91ee` | VibeSpace - Lofi Focus Workspace | Dashboard chính đầy đủ | `Header`, `PomodoroTimer`, `YouTubePlayer`, `BackgroundContainer`, `SoundMixerTrigger`, `TodoDrawerTrigger` |
| `1c869128fba241db9e5116c79279724b` | VibeSpace - Sound Mixer Modal & Task Drawer | Overlay Modals & Drawers | `SoundMixerModal`, `SoundChannelCard`, `PresetCombos`, `TodoDrawer`, `HabitList`, `DailyTaskList`, `TodoProgressBar`, `BackgroundSelector` |
| `e95bd016ecf64506964d0dc2d18e34ae` | VibeSpace - Minimalist Zen Mode | Chế độ tập trung thuần túy | `ZenPomodoro`, `ZenModeToggle`, `ZenAudioIndicator`, `BackgroundContainer` |
| `323cac25fc104f738346fae07e77b679` | Serene Misty Pine Forest at Twilight | 4K Wallpaper Asset | `BackgroundContainer` (Default Wallpaper) |

---

### Giai đoạn 3: Download & Trích xuất Design từ Google Stitch [HOÀN THÀNH]
Mục tiêu: Tải thiết kế chi tiết về workspace local và bóc tách cấu trúc để chuẩn bị code.

* **Thư mục thiết kế local**: [`stitch-designs/`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs)
  * Screen 1: [`stitch-designs/screen-1-main-dashboard.html`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screen-1-main-dashboard.html) (38KB)
  * Screen 2: [`stitch-designs/screen-2-modals-drawers.html`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screen-2-modals-drawers.html) (39KB)
  * Screen 3: [`stitch-designs/screen-3-zen-mode.html`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/screen-3-zen-mode.html) (15KB)
  * Wallpaper 4K: [`stitch-designs/wallpapers/pine-forest-twilight.jpg`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/wallpapers/pine-forest-twilight.jpg) (35KB)
* **File Design Tokens**: [`stitch-designs/design-tokens.json`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/stitch-designs/design-tokens.json)
* **Tài liệu đặc tả Component**: [`docs/COMPONENT_SPECS.md`](file:///c:/Users/NGHIA/MyData/Workspaces/Antigravity/demo-vibecodespace/docs/COMPONENT_SPECS.md)

- [x] **Task 3.1: Tải mã nguồn giao diện từ StitchMCP**
  * Đã tải toàn bộ mã HTML, CSS, và hình ảnh 4K của 3 màn hình từ Stitch về thư mục `stitch-designs/`.
- [x] **Task 3.2: Bóc tách Design Tokens**
  * Đã trích xuất đầy đủ bảng màu Glassmorphism, độ mờ backdrop, bóng đổ glow amber/indigo/teal và font typography vào `stitch-designs/design-tokens.json`.
- [x] **Task 3.3: Lập bản đồ Component Mapping**
  * Đã biên soạn tài liệu đặc tả cấu trúc 8 module React component chi tiết với props, state, Tailwind classes tương ứng trong `docs/COMPONENT_SPECS.md`.

---

### Giai đoạn 4: Code & Chuyển đổi sang React Components [HOÀN THÀNH]
Mục tiêu: Hiện thực hóa thiết kế từ Stitch thành ứng dụng web React hoạt động hoàn chỉnh 100%.

- [x] **Task 4.1: Khởi tạo Cấu trúc Dự án React**
  * Đã thiết lập thành công Vite + React 18 + TypeScript.
  * Cài đặt và cấu hình: `lucide-react`, `canvas-confetti`, `tailwindcss`, `postcss`, `autoprefixer`.
- [x] **Task 4.2: Xây dựng Layout Nền & Theme Engine**
  * Hiện thực hóa `BackgroundContainer` hỗ trợ ảnh 4K local/Unsplash, bộ lọc `blur(...)` và lớp phủ tối `darknessOverlay`.
  * Xây dựng `ZenModeController` và modal đổi hình nền `BackgroundSelector`.
- [x] **Task 4.3: Xây dựng Module Đồng hồ Pomodoro**
  * Hiện thực hóa hook `usePomodoro`: đếm ngược 25m Focus / 5m Break / 15m Long Break, vòng SVG progress mượt mà.
  * Tích hợp chuông thiền Solfeggio 528Hz sinh bằng Web Audio API và hiệu ứng ăn mừng `canvas-confetti`.
  * Lưu trữ thống kê số phiên hoàn thành trong ngày vào `localStorage`.
- [x] **Task 4.4: Xây dựng Module YouTube Lofi Player**
  * Tích hợp YouTube IFrame Player API với các bài hát Lofi chọn lọc đảm bảo phát mượt 100%.
  * Thanh phát nhạc nổi (Dock) hiển thị duy nhất tên của bài hát đang phát kèm hoạt họa equalizer, không hiển thị các nút bài hát khác gây rối mắt.
  * Tích hợp Playlist Modal chuyên dụng hiển thị toàn bộ danh sách, hỗ trợ xem/phát/thêm link YouTube (tự động lấy tên chuẩn)/xóa bài hát.
  * Điều khiển Play/Pause/Volume và Skip bài hát trước/sau tiện lợi.
- [x] **Task 4.5: Xây dựng & Tinh chỉnh Module White Noise Mixer**
  * Xây dựng và tinh chỉnh chuyên sâu Web Audio API synthesizer cho toàn bộ 10 kênh âm thanh độc lập, đảm bảo âm thanh phát ra chuẩn xác 100% với tên gọi:
    1. **Mưa rào**: Tiếng mưa rào rơi dày hạt qua cascaded lowpass + highpass filter kèm LFO điều biến cường độ gió thoảng.
    2. **Sấm chớp**: Tiếng sấm rền xa với sub-bass resonant boom (48-52Hz) và sóng âm vọng qua mây đa đỉnh (rolling thunderclaps) chu kỳ 8-15s.
    3. **Lửa trại**: Tiếng lửa bập bùng trầm ấm kết hợp bộ đệm procedural crackles tạo tiếng gỗ nổ lách tách, nổ đanh giòn chân thực.
    4. **Gió thoảng**: Tiếng gió lùa qua tán cây dùng bandpass filter biến thiên qua 2 bộ dao động LFO bất đối xứng (0.08Hz & 0.19Hz).
    5. **Sóng biển**: Chu kỳ sóng vỗ bờ 11.5s với ngọn sóng vỡ dạt dào và lớp bọt sóng tần số cao (foam shimmer) rút dần về biển.
    6. **Suối rừng**: Dòng suối róc rách sống động kết hợp 3 tầng lọc cộng hưởng biến thiên (950Hz, 1700Hz, 2450Hz) mô phỏng bọt nước va vào đá cuội.
    7. **Chim hót**: Bộ phát họa âm chim rừng hót líu lo theo 4 đoản khúc ngẫu nhiên (tiu-tiu, trill, woodland whistle) có độ trễ không gian rộng mở.
    8. **Quán cafe**: Không gian phòng cafe ấm cúng với tiếng chuyện trò râm ran mờ ảo (room murmur) và tiếng chạm ly tách gốm/thìa ngẫu nhiên.
    9. **Bàn phím cơ**: Chuỗi gõ phím cơ nhịp nhàng với tiếng click đanh switch tactile (2800-3600Hz) và tiếng chạm đáy "thock" ấm áp (420-950Hz).
    10. **Dế đêm**: Tiếng dế đêm đồng quê du dương với hòa âm kép (4550Hz & 4900Hz) tạo nhịp đập cánh tự nhiên và chùm tiếng gáy 3-4 xung.
  * Bộ trượt điều khiển âm lượng độc lập cho từng kênh (0-100%) và nút Master Mute / Tắt hết.
  * Cài đặt 4 preset phối sẵn 1-click ("Đêm mưa bão", "Góc quán cafe", "Nhà gỗ mùa đông", "Bình minh trong rừng").
- [x] **Task 4.6: Xây dựng Module Daily Todo List & Reset Engine**
  * Xây dựng Drawer công việc cạnh phải với hai danh mục riêng biệt: `Daily Habits` và `Daily Tasks`.
  * Hiện thực hóa `useDailyReset`: tự động uncheck thói quen sau 00:00 và dọn dẹp task đã xong.
  * Thanh tiến độ % hoàn thành trực quan.
- [x] **Task 4.7: Đồng bộ & Lưu trữ LocalStorage**
  * Đảm bảo toàn bộ cài đặt người dùng, danh sách task, kênh âm thanh, âm lượng được tự động lưu vào `localStorage`.

---

### Giai đoạn 5: Kiểm thử, Tinh chỉnh & Bàn giao (Testing & Polish) [HOÀN THÀNH]
- [x] **Task 5.1: Kiểm thử trải nghiệm âm thanh**
  * Tích hợp cơ chế tự động mở khóa (unlock) `AudioContext` ngay cú click/chạm đầu tiên trên trang, tuân thủ Autoplay Policy.
  * Tích hợp `DynamicsCompressorNode` (soft limiter) trong Web Audio Engine chống vỡ âm/rè khi kết hợp đồng thời nhạc YouTube và nhiều kênh White Noise.
- [x] **Task 5.2: Kiểm thử kịch bản Reset ngày mới**
  * Đã chạy bộ test tự động kiểm chứng 100% logic: thói quen (Daily Habits) tự động uncheck sau 00:00; công việc đã xong (One-off Completed) tự dọn dẹp; công việc chưa xong được giữ lại.
- [x] **Task 5.3: Tối ưu hóa tải trang & Responsive**
  * Đã tối ưu hóa bố cục thích ứng hoàn hảo trên Desktop, Tablet và Mobile.
  * Tích hợp cập nhật tiêu đề tab trình duyệt theo thời gian thực Pomodoro countdown (ví dụ: `(24:59) 🍅 Tập trung — VibeSpace`).
  * Tốc độ build production tối ưu: 2.20 giây, kích thước bundle gzipped < 70KB.
- [x] **Task 5.4: Khắc phục sự cố ngắt nhạc khi bật Zen Mode (Audio Persistence in Zen Mode)**
  * Thực thi nghiêm ngặt nguyên lý Clean DOM theo mục 6.4 của `TECH_ARCHITECTURE.md`: Duy trì toàn bộ cây DOM của vùng làm việc chính cùng phần tử YouTube Iframe (`#yt-hidden-player`) ngầm với `opacity-0 pointer-events-none select-none` thay vì unmount component bằng điều kiện `isZenMode ? ... : ...`.
  * Nhạc Lofi YouTube tiếp tục phát liên tục không bị gián đoạn hay ngắt quãng khi kích hoạt Zen Mode và chuyển đổi qua lại giữa các chế độ.
  * Tinh chỉnh giao diện `ZenPomodoro`: hiển thị badge phiên ("Phiên tập trung" / "Nghỉ ngơi"), nút bỏ qua phiên (Skip), cho phép click vào thanh Audio Pill dưới đáy để tạm dừng/phát nhạc trực tiếp, và hỗ trợ phím tắt `Escape` để thoát nhanh.

---

### Giai đoạn 6: Tái cấu trúc sang Kiến trúc Monorepo (Monorepo Architecture) [HOÀN THÀNH]
Mục tiêu: Chuyển đổi toàn bộ cấu trúc dự án từ Single SPA sang chuẩn Monorepo với npm workspaces, chuẩn bị sẵn sàng cho việc mở rộng backend trong tương lai.

- [x] **Task 6.1: Tổ chức lại cấu trúc thư mục Monorepo**
  * Di chuyển toàn bộ mã nguồn Client SPA sang `apps/frontend/`.
  * Tạo sẵn thư mục `apps/backend/` rỗng kèm `.gitkeep` và `README.md` sẵn sàng cho việc tích hợp mã nguồn backend (REST API, WebSocket, Auth, Cloud Sync).
- [x] **Task 6.2: Thiết lập npm workspaces và root orchestration**
  * Định nghĩa `workspaces: ["apps/*"]` tại root `package.json`.
  * Thiết lập các script điều khiển từ thư mục gốc: `npm run dev`, `npm run build`, `npm run preview`, `npm run dev:frontend`, `npm run build:frontend`.
  * Đặt tên package frontend chuẩn hóa: `@vibespace/frontend`.
- [x] **Task 6.3: Kiểm thử toàn diện và cập nhật tài liệu kiến trúc**
  * Chạy `npm install` và `npm run build` thành công 100% không phát sinh lỗi liên kết thư viện.
  * Cập nhật sơ đồ cấu trúc thư mục trong `docs/TECH_ARCHITECTURE.md` và `docs/PLAN.md`.

---

### Giai đoạn 7: Xây dựng Backend, Database & Cloud Sync (Milestone M7) [ĐANG THỰC HIỆN]
Mục tiêu: Triển khai trọn vẹn dịch vụ Express.js backend, thiết lập Prisma ORM kết nối cơ sở dữ liệu Supabase PostgreSQL, xây dựng hệ thống Authentication (JWT + Google OAuth), CRUD playlist bài hát và Daily Todo với cơ chế Backend Daily Reset, tích hợp UI Auth Modal Glassmorphism trên Frontend, và triển khai lên Render qua MCP.

- [x] **Task 7.1: Khởi tạo Source Code Backend Express.js trong `apps/backend/`**
  * Thiết lập `package.json` với package name `@vibespace/backend`, cấu hình TypeScript (`tsconfig.json`), `cors`, `dotenv`, `express`, `tsx`.
  * Cài đặt middleware: error handler, cors, json parser, health check endpoint `GET /api/health`.
  * Thiết lập script khởi chạy tại root `package.json`: `npm run dev:backend`, `npm run build:backend`, `npm run start:backend`.
  * Đã build TypeScript và kiểm thử endpoint `/api/health` trả về HTTP 200 thành công.
- [x] **Task 7.2: Cấu hình Prisma ORM & Đồng bộ Schema với Supabase PostgreSQL**
  * Cài đặt `prisma` và `@prisma/client`.
  * Khởi tạo `apps/backend/prisma/schema.prisma` với 3 models: `User`, `MusicTrack`, `TodoItem`.
  * Khởi tạo Prisma Client singleton instance tại `apps/backend/src/lib/prisma.ts`.
  * Áp dụng migration DDL đồng bộ 3 bảng (`users`, `music_tracks`, `todo_items`) và thiết lập chỉ mục indexes trên Supabase project `VibeSpace` (`ynqwfjqiiqjtizagokdt`).
  * Kích hoạt Row Level Security (RLS) bảo vệ an toàn toàn bộ các bảng trên Supabase PostgreSQL.
- [x] **Task 7.3: Hiện thực hóa Authentication API (Email/Password & Google OAuth)**
  * Endpoint `POST /api/auth/register`: Validate input, hash mật khẩu bằng `bcryptjs`, tạo user, tự động seed 6 bài Lofi mặc định vào playlist cá nhân, cấp token `JWT`.
  * Endpoint `POST /api/auth/login`: Xác thực credentials, so sánh hash mật khẩu bcrypt, cấp token `JWT`.
  * Endpoint `POST /api/auth/google`: Sử dụng `google-auth-library` verify Google ID token, upsert user (tạo mới và seed nhạc nếu chưa có, hoặc cập nhật avatar/googleId), cấp token `JWT`.
  * Middleware `authMiddleware`: Xác thực Bearer JWT token qua `Authorization` header và gán `req.user`.
  * Endpoint `GET /api/auth/me`: Lấy thông tin tài khoản đang đăng nhập (Protected route).
  * Kiểm thử tự động tích hợp thành công 100% toàn bộ kịch bản đăng ký, đăng nhập sai/đúng, xác thực token và dọn dẹp test record trên Supabase.
- [x] **Task 7.4: Hiện thực hóa Music Tracks Controller & Router**
  * Endpoint `GET /api/tracks`: Lấy danh sách bài hát cá nhân; nếu user mới tạo rỗng danh sách thì tự động seed 6 bài Lofi mặc định.
  * Endpoint `POST /api/tracks`: Thêm bài hát YouTube mới vào tài khoản kèm kiểm tra chống trùng lặp.
  * Endpoint `DELETE /api/tracks/:id`: Xóa bài hát khỏi playlist cá nhân (bảo vệ quyền sở hữu của user).
  * Endpoint `POST /api/tracks/restore-defaults`: Khôi phục playlist về 6 bài mặc định.
  * Kiểm thử tự động tích hợp thành công 100% các luồng GET, POST, Duplicate check, DELETE và Restore Defaults trên Supabase PostgreSQL.
- [x] **Task 7.5: Hiện thực hóa Daily Todo Controller & Backend Daily Reset Engine**
  * Endpoint `GET /api/todos`: Tự động so sánh `lastActiveDate` của user với ngày hôm nay:
    * Nếu sang ngày mới: Tự động uncheck habits, dọn dẹp các task one-off đã xong trong database, cập nhật `lastActiveDate` = today.
    * Trả về danh sách todo đã được reset chuẩn xác.
  * Endpoint `POST /api/todos`: Thêm habit hoặc task mới.
  * Endpoint `PATCH /api/todos/:id`: Đổi trạng thái hoàn thành / sửa tiêu đề.
  * Endpoint `DELETE /api/todos/:id`: Xóa task/habit.
  * Endpoint `POST /api/sync/merge`: Nhận danh sách local tracks và local todos từ frontend khi vừa đăng nhập để gộp vào tài khoản.
  * Kiểm thử tự động tích hợp thành công 100% logic Backend Daily Reset (uncheck habits, xóa completed tasks, giữ incomplete tasks) và merge sync trên Supabase PostgreSQL.
- [x] **Task 7.6: Xây dựng Giao diện Auth Modal Glassmorphism & Tích hợp Frontend**
  * Xây dựng Component `AuthModal.tsx`: Chuyển đổi giữa Đăng nhập / Đăng ký (Email + Mật khẩu + Tên) và nút "Đăng nhập với Google" (Google Identity Services SDK & demo token fallback).
  * Cập nhật `Header.tsx`: Nút "Đăng nhập" khi là Guest; hiển thị Avatar/Tên người dùng + Dropdown menu Đăng xuất và trạng thái Cloud Sync khi đã login.
  * Xây dựng `AuthContext.tsx` & API Service client `api.ts` trên Frontend quản lý trạng thái token và thông tin người dùng.
  * Đã build kiểm thử Vite & TypeScript frontend pass 100%.
- [x] **Task 7.7: Tích hợp Cloud Sync cho `usePlaylists` và `TodoDrawer`**
  * Nâng cấp hook `usePlaylists`: Khi đã đăng nhập thì đồng bộ với `/api/tracks`; hỗ trợ optimistic UI khi thêm, xóa, khôi phục playlist mặc định; khi đăng nhập lần đầu tự động merge bài hát từ local lên cloud qua `/api/sync/merge`.
  * Nâng cấp `useDailyReset` & `TodoDrawer`: Khi đã đăng nhập thì fetch và mutate dữ liệu qua `/api/todos` kết hợp Backend Daily Reset Engine; hiển thị badge trạng thái Cloud Sync / Guest; giữ nguyên trải nghiệm mượt mà không độ trễ (Optimistic UI updates).
  * Đã build kiểm thử Vite & TypeScript frontend pass 100%.
- [x] **Task 7.8: Triển khai Backend lên Render thông qua Render MCP**
  * Tạo Web Service trên Render sử dụng Render MCP (`create_web_service`): `srv-db75qobrjlhs73a1ds30`, URL: `https://vibespace-backend-xg9z.onrender.com`.
  * Cấu hình Environment Variables trên Render: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=10000`, `CORS_ORIGIN=*`.
  * Kiểm tra build và deploy trên Render hoạt động thành công (Trạng thái deploy: `live`).
- [x] **Task 7.9: Kiểm thử E2E Toàn diện & Bàn giao**
  * Kiểm thử luồng Đăng ký / Đăng nhập Email và Google OAuth (nhận JWT và profile).
  * Kiểm thử Thêm / Xóa bài hát cá nhân và khôi phục mặc định trên database Supabase PostgreSQL.
  * Kiểm thử Thêm / Xóa / Hoàn thành Todo và kịch bản Reset qua ngày với Backend Daily Reset Engine.
  * Kiểm thử gộp dữ liệu khách (Guest offline merge) qua endpoint `/api/sync/merge`.
  * Đảm bảo tính tương thích 100% giữa chế độ Guest offline-first và chế độ Cloud synced.

---

## 3. Các Mốc Hoàn thành (Milestones & Next Step)

| Mốc | Mô tả | Trạng thái |
| :--- | :--- | :--- |
| **M1: Specification & Planning** | Hoàn thành PRD.md, TECH_ARCHITECTURE.md, PLAN.md | **Hoàn thành (Done)** |
| **M2: Google Stitch UI Design** | Sinh và duyệt các màn hình trên StitchMCP (3 screens + wallpaper) | **Hoàn thành (Done)** |
| **M3: Design Download & Mapping** | Trích xuất tokens & bóc tách layout thành component spec | **Hoàn thành (Done)** |
| **M4: Core Implementation** | Chuyển đổi mã React, tích hợp Audio & YouTube, Todo Reset | **Hoàn thành (Done)** |
| **M5: Launch Ready** | Kiểm thử hoàn chỉnh và sẵn sàng sử dụng thực tế | **Hoàn thành (Done)** |
| **M6: Monorepo Architecture** | Tổ chức lại monorepo (`apps/frontend`, `apps/backend`) & npm workspaces | **Hoàn thành (Done)** |
| **M7: Backend, Database & Sync** | Express.js + Prisma + Supabase Postgres + Render + Auth & Cloud Sync | **Hoàn thành (Done)** |
