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

### Giai đoạn 2: Design với Google Stitch (StitchMCP)
Mục tiêu: Sử dụng công cụ Google Stitch (qua StitchMCP) để sinh các màn hình giao diện chuẩn Lofi Aesthetic, bố cục hài hòa, hiệu ứng kính mờ (Glassmorphism).

* [ ] **Task 2.1: Khởi tạo Project trên Google Stitch**
  * Gọi công cụ `create_project` trên StitchMCP: Tên project `vibespace-workspace`.
  * Thiết lập phong cách thiết kế chủ đạo: *Dark mode, Lofi Aesthetic, Frosted Glass, Minimalist, Calming, Forest/Nature vibes*.
* [ ] **Task 2.2: Thiết kế Screen 1 - Main Workspace Dashboard (Full View)**
  * Prompting sinh giao diện: Hình nền 4K rừng thông phủ sương mờ, đồng hồ Pomodoro số lớn ở chính giữa, thanh phát nhạc YouTube mini dock ở dưới đáy, nút mở White Noise Mixer, nút mở Daily Todo List drawer bên cạnh, nút chuyển đổi hình nền.
* [ ] **Task 2.3: Thiết kế Screen 2 - Expanded Modals & Drawers**
  * Sinh giao diện mở rộng:
    * Modal bảng điều khiển **White Noise Multi-Channel Mixer** (10 thẻ âm thanh với slider + các thẻ preset 1-click).
    * Drawer bảng công việc **Daily Todo List** (chia 2 tab: Thói quen hàng ngày & Việc trong ngày, kèm thanh progress bar).
    * Modal kho ảnh nền **Wallpaper Gallery** (lưới thumbnail chọn ảnh + thanh trượt Darkness Overlay & Blur).
* [ ] **Task 2.4: Thiết kế Screen 3 - Minimalist Zen Mode**
  * Giao diện tối giản tuyệt đối: Ẩn mọi widget phụ, chỉ còn lại hình nền thiên nhiên và đồng hồ Pomodoro đếm ngược cùng các nút điều khiển tối giản.

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
| **M2: Google Stitch UI Design** | Sinh và duyệt các màn hình trên StitchMCP | **Bước tiếp theo sẵn sàng** |
| **M3: Design Download & Mapping** | Trích xuất tokens & bóc tách layout thành component spec | Chờ M2 |
| **M4: Core Implementation** | Chuyển đổi mã React, tích hợp Audio & YouTube, Todo Reset | Chờ M3 |
| **M5: Launch Ready** | Kiểm thử hoàn chỉnh và sẵn sàng sử dụng thực tế | Chờ M4 |
