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
|  - Khởi tạo dự án trên StitchMCP (create_project)                                [SẮP TỚI]      |
|  - Tạo các màn hình giao diện (Main Workspace, Zen Mode, Sound Mixer, Todo)                     |
|                                                                                                 |
|  [Giai đoạn 3: DOWNLOAD DESIGN TỪ GOOGLE STITCH]                                                |
|  - Trích xuất HTML, CSS, Design Tokens và Asset references từ StitchMCP                          |
|  - Phân tích cấu trúc phân rã giao diện thành các React Component Specs                         |
|                                                                                                 |
|  [Giai đoạn 4: CODE & CHUYỂN ĐỔI SANG REACT COMPONENTS]                                         |
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
  * **Screenshot Preview**: [Xem ảnh chụp](https://lh3.googleusercontent.com/aida/AEtjO1XmBoy-HiPVsSw1q196Q3fPj20Lca4cpEYxOB9oKcCDICfHuUJnUBdP7pFSe3FowUnShneBGNwW0-svbUSXl-vI19yTl_sINrK5yeg87eJ5F4Nnpjc1wRx_-jWfFD2NjVdqSYaSur9MjTeRYUbdzaQXTCdHS7WWKCVhCCO5KkwOyt-lj5Jc7ouBucfRHTjAVhtSfOAvG4Jw0oSG57aE_8d-cVQJjF5CNsjQxYp0FjjjI7bNyHGIt-OmCug)
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
  * **Screenshot Preview**: [Xem ảnh chụp](https://lh3.googleusercontent.com/aida/AEtjO1X3gIdQKd_Ype6gaFpKU-nrG7WZErLF1qGoKoh4jgTcGs1CctBdSQiEKhwVZYEWCIEL8PCUH1OYavbD4WOK0oayQTBzw25djKpLrfmbxc_YQZzCg6tD16pBa1dujgzAOnH5EOZ--zihfQTDyuqSseHK5cFU8qBziqVHBiQENMvXIi3SWFv8W7ywIqufDgz9gym2DpcnSqSar5x8DBXRDiYIMnJprcwwXMJOuoUxWdRJnDHkblXt7xO0yuY)
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
  * **Screenshot Preview**: [Xem ảnh chụp](https://lh3.googleusercontent.com/aida/AEtjO1U3wKQFh9wMXiVOe8QFMpAQ9EBee-ytnE9O35ltTKOIp1bMgi69Hl37zfVQC2augBuPHzW7FPb8J4IVYW2XuNArMcXOn_N7vGe3oqPoK4CP_TrbZOUcGZ6weVKMUl0wxKgwJY3KXl95u5lIPqFR4i9pCOihcg15O6u5g9RgqdiPl4jRQRPEzq3BK8PwoeUb--I2omWDoulGR2sGoxlHKKCKnsCoYfT0SODmVL5fxrowDshC2agCaYXAKQ)
  * **Component React ánh xạ**:
    * `src/components/pomodoro/ZenPomodoro.tsx` (Đồng hồ đếm ngược tối giản 24:38, vòng progress thanh thoát)
    * `src/components/common/ZenModeToggle.tsx` (Nút thoát chế độ Zen Mode thu nhỏ ở góc trên phải)
    * `src/components/music/ZenAudioIndicator.tsx` (Dòng hiển thị bài hát và âm lượng tối giản ở đáy)

* **Wallpaper Asset đi kèm**:
  * **Screen ID**: `323cac25fc104f738346fae07e77b679`
  * **Title**: `Cinematic high-resolution photograph of a serene misty pine forest at deep twilight`
  * **Image URL**: [Tải ảnh 4K](https://lh3.googleusercontent.com/aida/AEtjO1U_DTq0YgEStLBcMJfjJuPhd30BWKEFy1iCYSrIuC1aMWNFyHZeGIFV1bvBOzJt2j2iPwmVSu3deUPrfWb-FGQqCGVBhxJY5fbfKG9E-xOm59wstqLpTVLCUwztqIeCXQydcWT2p1dkGLCwZLSA01-Tp4czuCBHwpdd-viNT_i8KgCxdmmATg1TBbKst8Cc9kCaMCyPPUak3oeZqSd7RFGM8npXMoEGv7Ng3S5OHUEh_ebWqc2g0IBSfxM)

#### Bảng Tổng hợp Ánh xạ Screen và React Components

| Screen ID | Tiêu đề Màn hình | Loại giao diện | Các Component React ánh xạ tương ứng |
| :--- | :--- | :--- | :--- |
| `3fc492be343d49dc9ad20fb45c2f91ee` | VibeSpace - Lofi Focus Workspace | Dashboard chính đầy đủ | `Header`, `PomodoroTimer`, `YouTubePlayer`, `BackgroundContainer`, `SoundMixerTrigger`, `TodoDrawerTrigger` |
| `1c869128fba241db9e5116c79279724b` | VibeSpace - Sound Mixer Modal & Task Drawer | Overlay Modals & Drawers | `SoundMixerModal`, `SoundChannelCard`, `PresetCombos`, `TodoDrawer`, `HabitList`, `DailyTaskList`, `TodoProgressBar`, `BackgroundSelector` |
| `e95bd016ecf64506964d0dc2d18e34ae` | VibeSpace - Minimalist Zen Mode | Chế độ tập trung thuần túy | `ZenPomodoro`, `ZenModeToggle`, `ZenAudioIndicator`, `BackgroundContainer` |
| `323cac25fc104f738346fae07e77b679` | Serene Misty Pine Forest at Twilight | 4K Wallpaper Asset | `BackgroundContainer` (Default Wallpaper) |

---

### Giai đoạn 3: Download & Trích xuất Design từ Google Stitch
Mục tiêu: Tải thiết kế chi tiết về workspace local và bóc tách cấu trúc để chuẩn bị code.

* [ ] **Task 3.1: Tải mã nguồn giao diện từ StitchMCP**
  * Sử dụng `get_screen` để lấy mã HTML/CSS, cấu trúc DOM, màu sắc và typography đã sinh từ Stitch.
* [ ] **Task 3.2: Bóc tách Design Tokens**
  * Trích xuất các biến màu sắc (Glassmorphism border, background opacity, glow effects, text contrast).
  * Cấu hình các giá trị này vào file cấu hình Tailwind CSS (`tailwind.config.js`) và CSS Variables (`index.css`).
* [ ] **Task 3.3: Lập bản đồ Component Mapping**
  * Phân rã mã HTML thành danh sách các component React độc lập, tái sử dụng được.

---

### Giai đoạn 4: Code & Chuyển đổi sang React Components
Mục tiêu: Hiện thực hóa thiết kế từ Stitch thành ứng dụng web React hoạt động hoàn chỉnh 100%.

* [ ] **Task 4.1: Khởi tạo Cấu trúc Dự án React**
  * Khởi tạo template Vite + React + TypeScript.
  * Cài đặt các thư viện bổ trợ: `lucide-react`, `canvas-confetti` (hiệu ứng khi xong việc), và Tailwind CSS.
* [ ] **Task 4.2: Xây dựng Layout Nền & Theme Engine**
  * Hiện thực hóa `BackgroundContainer` với các bộ lọc `filter: blur(...)` và lớp phủ tối `brightness(...)`.
  * Xây dựng `ZenModeController` điều khiển bật/tắt toàn màn hình.
* [ ] **Task 4.3: Xây dựng Module Đồng hồ Pomodoro**
  * Hiện thực hóa hook `usePomodoro`: đếm ngược, chuyển đổi Focus (25m) / Short Break (5m) / Long Break (15m).
  * Tích hợp âm thanh chuông báo thiền (Zen chime) khi hết phiên.
  * Lưu trữ thống kê số phiên hoàn thành trong ngày vào `localStorage`.
* [ ] **Task 4.4: Xây dựng Module YouTube Lofi Player**
  * Tích hợp thư viện preset các kênh Lofi nổi tiếng (Lofi Girl, Chillhop...).
  * Xây dựng trình trích xuất link YouTube URL tùy chỉnh.
  * Tích hợp IFrame API điều khiển Play/Pause/Volume.
* [ ] **Task 4.5: Xây dựng Module White Noise Mixer**
  * Chuẩn bị và tích hợp 10 file âm thanh môi trường chất lượng cao (mưa, sấm, lửa trại, gió, sóng...).
  * Xây dựng hệ thống điều khiển âm lượng độc lập cho từng kênh qua Web Audio API.
  * Cài đặt các preset phối sẵn 1-click ("Đêm mưa bão", "Nhà gỗ mùa đông"...).
* [ ] **Task 4.6: Xây dựng Module Daily Todo List & Reset Engine**
  * Xây dựng giao diện Drawer công việc đẹp mắt, phân loại `Habit` và `One-off Task`.
  * Hiện thực hóa `useDailyReset`: tự động uncheck thói quen và dọn dẹp task cũ khi bước sang ngày mới.
  * Thanh tiến độ trực quan (% hoàn thành trong ngày).
* [ ] **Task 4.7: Đồng bộ & Lưu trữ LocalStorage**
  * Đảm bảo toàn bộ cài đặt của người dùng được tự động lưu lại và phục hồi hoàn hảo khi F5/tải lại trang.

---

### Giai đoạn 5: Kiểm thử, Tinh chỉnh & Bàn giao (Testing & Polish)
* [ ] **Task 5.1: Kiểm thử trải nghiệm âm thanh**
  * Kiểm tra hiện tượng Autoplay trên trình duyệt và xử lý mượt mà khi người dùng tương tác lần đầu.
  * Đảm bảo không bị rè hay xung đột khi phát đồng thời nhạc YouTube và 3-4 kênh White Noise.
* [ ] **Task 5.2: Kiểm thử kịch bản Reset ngày mới**
  * Giả lập thay đổi ngày hệ thống trong `localStorage` để kiểm chứng logic reset thói quen và dọn task đã hoàn thành.
* [ ] **Task 5.3: Tối ưu hóa tải trang & Responsive**
  * Kiểm tra hiển thị trên các kích thước màn hình phổ biến.
  * Đảm bảo trải nghiệm trực quan, mượt mà và thư giãn nhất.

---

## 3. Các Mốc Hoàn thành (Milestones & Next Step)

| Mốc | Mô tả | Trạng thái |
| :--- | :--- | :--- |
| **M1: Specification & Planning** | Hoàn thành PRD.md, TECH_ARCHITECTURE.md, PLAN.md | **Hoàn thành (Done)** |
| **M2: Google Stitch UI Design** | Sinh và duyệt các màn hình trên StitchMCP (3 screens + wallpaper) | **Hoàn thành (Done)** |
| **M3: Design Download & Mapping** | Trích xuất tokens & bóc tách layout thành component spec | **Sẵn sàng thực hiện** |
| **M4: Core Implementation** | Chuyển đổi mã React, tích hợp Audio & YouTube, Todo Reset | Chờ M3 |
| **M5: Launch Ready** | Kiểm thử hoàn chỉnh và sẵn sàng sử dụng thực tế | Chờ M4 |
