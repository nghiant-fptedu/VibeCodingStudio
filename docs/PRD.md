# VibeSpace - Product Requirements Document (PRD)

---

## 1. Giới thiệu & Tổng quan (Executive Summary)

### 1.1 Tên sản phẩm
**VibeSpace** (Personalized Aesthetic Focus Workspace)

### 1.2 Tầm nhìn sản phẩm (Product Vision)
VibeSpace là ứng dụng web cá nhân hóa không gian làm việc trực tuyến theo phong cách **Lofi Aesthetic**, được thiết kế chuyên biệt để giúp người dùng nhanh chóng đạt được trạng thái tập trung sâu (**Deep Work** / **Flow State**). 

Ứng dụng hướng đến trải nghiệm **Zero-Friction**: người dùng mở trang web là có thể sử dụng ngay tức thì, không cần đăng ký hay đăng nhập tài khoản, loại bỏ mọi rào cản và quảng cáo gây phân tâm.

### 1.3 Mục tiêu cốt lõi (Core Goals)
1. **Khởi động tức thì (Zero Setup)**: Truy cập trang web và sẵn sàng làm việc trong vòng chưa đầy 2 giây.
2. **Âm thanh chữa lành & tập trung**: Kết hợp nhịp nhàng giữa giai điệu Lofi (qua YouTube Player) và các âm thanh môi trường tự nhiên (White Noise Mixer).
3. **Thị giác thư giãn**: Kho hình nền 4K chất lượng cao với các bộ lọc ánh sáng giúp mắt dễ chịu khi làm việc lâu.
4. **Động lực & Năng suất**: Tích hợp đồng hồ Pomodoro chuẩn mực và danh mục công việc hàng ngày (Daily Todo) với cơ chế tự động dọn dẹp thông minh mỗi ngày.

### 1.4 Phạm vi Dự án (Scope of Work)

#### 1.4.1 Thuộc phạm vi thực hiện (In-Scope - Phiên bản V1)
* **Kiến trúc & Nền tảng**:
  * Phát triển ứng dụng web Client-side Single Page Application (React 18 + TypeScript + Vite + Tailwind CSS).
  * Trải nghiệm 100% Zero-login: Sử dụng ngay lập tức không cần đăng ký tài khoản, toàn bộ dữ liệu lưu trữ an toàn tại `localStorage`.
  * Tối ưu hiển thị Responsive trên Desktop, Laptop và Tablet.
* **Module Trình phát nhạc YouTube Lofi (FR-1)**:
  * Tích hợp YouTube IFrame Player API.
  * Thư viện Preset tuyển chọn gồm 6 kênh/bản nhạc Lofi nổi tiếng (Lofi Girl, Chillhop, Cozy Coffee Shop, Synthwave Focus, Peaceful Piano, Rainy Night Lofi).
  * Tính năng dán link YouTube URL hoặc Video ID bất kỳ để nghe nhạc tùy biến.
  * Thanh tìm kiếm nhanh / lọc trong danh mục Presets có sẵn.
  * Điều khiển Play/Pause, chuyển đổi preset, thanh trượt âm lượng (0–100%) và nút Mute/Unmute.
* **Module Bộ trộn âm thanh White Noise (FR-2)**:
  * Bộ trộn đa kênh với 10 âm thanh môi trường loopable chất lượng cao (Mưa rào, Sấm sét, Lửa trại, Gió, Sóng biển, Suối rừng, Chim hót, Quán cafe, Bàn phím cơ, Tiếng ve đêm).
  * Điều khiển Bật/Tắt và thanh chỉnh âm lượng độc lập cho từng kênh (0–100%).
  * 4 Preset phối sẵn 1-click ("Đêm mưa bão", "Góc quán cafe", "Nhà gỗ mùa đông", "Bình minh trong rừng").
  * Nút Master Mute để ngắt nhanh toàn bộ âm thanh môi trường.
* **Module Kho hình nền 4K & Bộ lọc hiển thị (FR-3)**:
  * Thư viện ảnh tĩnh 4K tuyển chọn theo 6 chủ đề thư giãn (Rừng thông, Hoàng hôn đại dương, Núi tuyết, Phòng lofi bên cửa sổ mưa, Quán cafe vintage, Bầu trời đêm).
  * Bộ lọc tùy chỉnh độ tối (Darkness Overlay 0–80%) và độ mờ hậu cảnh (Blur 0–10px) chống chói mắt.
  * Drawer/Popup xem trước thumbnail và chuyển đổi hình nền tức thì.
* **Module Đồng hồ Pomodoro trung tâm (FR-4)**:
  * Đồng hồ đếm giờ trung tâm màn hình phong cách tối giản với 3 chế độ: Focus (25m), Short Break (5m), Long Break (15m).
  * Cho phép tùy chỉnh thời lượng phiên theo thói quen cá nhân.
  * Phát chuông báo thiền (Zen chime) khi kết thúc phiên.
  * Đếm số phiên Pomodoro hoàn thành trong ngày (`🍅 x / y`).
  * Chế độ Zen Mode / Fullscreen ẩn toàn bộ widget phụ, chỉ để lại đồng hồ và hình nền.
* **Module Quản lý công việc Daily Todo List (FR-5)**:
  * Phân tách rõ ràng 2 nhóm công việc:
    * *Daily Habits (Thói quen hàng ngày)*: Tự động bỏ tick (uncheck) sau 00:00 mỗi ngày để người dùng làm lại.
    * *Daily Tasks (Việc trong ngày)*: Thêm mới trong ngày; sang ngày mới các việc đã hoàn thành tự động dọn dẹp/chuyển vào lịch sử lưu trữ, việc chưa xong được tự động giữ lại tiếp tục.
  * Thao tác CRUD (Thêm, Sửa, Xóa, Đánh dấu hoàn thành) và thanh tiến độ trực quan (% Progress).
  * Động cơ kiểm tra ngày mới (`Daily Reset Engine`) tự động thực thi khi mở tab hoặc qua ngày.

#### 1.4.2 Ngoại phạm vi (Out-of-Scope - Phiên bản V1)
Các tính năng sau **không** thuộc phạm vi triển khai của phiên bản V1 nhằm đảm bảo tính gọn nhẹ, tức thì và bảo mật:
* **Hệ thống Tài khoản & Xác thực (Auth/User Accounts)**: Không hỗ trợ đăng ký, đăng nhập tài khoản (bằng Email, Google, Facebook...).
* **Lưu trữ Đám mây & Đồng bộ đa thiết bị (Cloud Storage & Sync)**: Không sử dụng backend database (Firebase, Supabase, PostgreSQL) để đồng bộ dữ liệu giữa các máy tính khác nhau.
* **Tìm kiếm tự do toàn bộ YouTube qua YouTube Data API v3**: Không gọi trực tiếp YouTube Search API qua API Key để tránh rủi ro cạn kiệt hạn ngạch quota (10,000 units/ngày) và không cần xây backend proxy bảo mật key.
* **Không gian làm việc nhóm trực tuyến (Multiplayer / Social Focus Rooms)**: Không hỗ trợ tính năng phòng học chung ảo (Study with Me), chat nhóm hoặc nhìn thấy bạn bè cùng học trong V1.
* **Tải lên file cá nhân từ máy tính (Custom File Uploads)**: Không hỗ trợ upload file mp3/mp4 từ máy tính cá nhân lên ứng dụng (chỉ dùng kho tài nguyên có sẵn hoặc dán link YouTube/link ảnh web).
* **Tích hợp bên thứ ba (Third-party Integrations)**: Chưa tích hợp các nền tảng như Spotify SDK, Apple Music, Notion, Google Calendar, Todoist.

#### 1.4.3 Kế hoạch Mở rộng Tương lai (Future Scope / Roadmap V2)
* **Cloud Sync tùy chọn**: Tùy chọn đăng nhập bằng Google/GitHub để sao lưu Todo list và cấu hình mixer lên cloud nếu người dùng có nhu cầu lưu đa thiết bị.
* **Phòng Pomodoro nhóm (Study with Me)**: Tạo và chia sẻ đường link phòng học để bạn bè cùng đếm ngược Pomodoro thời gian thực qua WebRTC.
* **Spotify Web Playback SDK**: Cho phép người dùng đăng nhập tài khoản Spotify Premium để nghe nhạc trực tiếp từ playlist Spotify.
* **Báo cáo Năng suất Nâng cao (Productivity Analytics)**: Biểu đồ thống kê số giờ tập trung và số task hoàn thành theo tuần/tháng với export dữ liệu CSV/JSON.

---

## 2. Đối tượng Người dùng & Kịch bản Sử dụng (User Personas & Use Cases)

### 2.1 Đối tượng Người dùng (User Personas)
* **Sinh viên / Học sinh**: Cần không gian yên tĩnh, âm thanh mưa rơi và đồng hồ đếm ngược để ôn thi, làm bài tập dài hạn.
* **Lập trình viên / Kỹ sư phần mềm**: Ngồi làm việc liên tục 8–10 tiếng/ngày, thích âm nhạc Lofi/Chillhop nhẹ nhàng không lời, cần công cụ ghi chép nhanh task trong ngày.
* **Người làm việc tự do (Freelancers / Remote Workers)**: Làm việc tại nhà hoặc quán cafe ồn ào, cần một "văn phòng ảo" yên bình để duy trì tính kỷ luật.
* **Nhà văn / Content Creators**: Cần không gian khơi gợi cảm hứng sáng tạo với hình ảnh thiên nhiên và âm thanh lửa trại/sóng biển.

### 2.2 Kịch bản Sử dụng Điển hình (User Journey)
1. Người dùng mở tab `VibeSpace` trên trình duyệt.
2. Hệ thống tự động hiển thị không gian làm việc gần nhất với hình nền rừng thông 4K và một bản nhạc Lofi êm dịu.
3. Người dùng bật thêm tiếng mưa rơi (Rain) và sấm chớp (Thunder) ở mức âm lượng 40%.
4. Người dùng mở bảng Todo List, thấy danh sách thói quen buổi sáng (Daily Habits) đã được tự động làm mới, người dùng nhập thêm 2 việc cần giải quyết trong ngày.
5. Người dùng bấm **Start** trên đồng hồ Pomodoro (25 phút), bật chế độ **Zen Mode** để ẩn bớt các nút bấm thừa và bắt đầu tập trung làm việc.
6. Khi hết 25 phút, chuông báo vang lên, người dùng nghỉ ngắn 5 phút trước khi bắt đầu phiên làm việc tiếp theo.

---

## 3. Yêu cầu Chức năng Chi tiết (Detailed Functional Requirements)

### FR-1: Trình phát nhạc Lofi YouTube (YouTube Lofi Player)
* **FR-1.1 (Phát nhạc mặc định)**: Khi trang tải hoặc khi người dùng bấm Play, hệ thống phát ngay một bài/luồng Lofi tuyển chọn chất lượng cao.
* **FR-1.2 (Thư viện tuyển chọn - Curated Presets)**: Cung cấp sẵn ít nhất 6 kênh/bản nhạc Lofi nổi tiếng theo các phong cách:
  * *Lofi Girl - Beats to relax/study to*
  * *Chillhop Radio - Jazzy & Lofi hip hop*
  * *Cozy Coffee Shop Lofi*
  * *Synthwave / Cyberpunk Chill Focus*
  * *Peaceful Piano & Strings*
  * *Rainy Night Lofi Vibes*
* **FR-1.3 (Dán link tùy chỉnh)**: Người dùng có thể dán bất kỳ YouTube URL hoặc Video ID nào để phát bản nhạc yêu thích của riêng họ.
* **FR-1.4 (Tìm kiếm trong kho Preset)**: Thanh tìm kiếm nhanh hỗ trợ gõ từ khóa để lọc các kênh trong danh mục Preset có sẵn.
* **FR-1.5 (Điều khiển phát)**: Hỗ trợ Play/Pause, chuyển đổi giữa các Presets, thanh kéo âm lượng (Volume Slider 0% – 100%), nút Mute/Unmute.
* **FR-1.6 (Giao diện thu gọn)**: Trình phát nhạc có thể hiển thị dạng Dock mini tinh tế hoặc mở rộng để xem danh sách bài và nhập link.

### FR-2: Bộ trộn âm thanh môi trường (White Noise Multi-Channel Mixer)
* **FR-2.1 (Danh mục âm thanh đa dạng)**: Hỗ trợ ít nhất 10 kênh âm thanh thiên nhiên & môi trường loopable chất lượng cao:
  1. *Mưa rào (Heavy Rain)*
  2. *Sấm sét xa (Distant Thunder)*
  3. *Lửa trại / Lò sưởi (Campfire / Fireplace)*
  4. *Gió thổi qua tán cây (Gentle Wind)*
  5. *Sóng biển vỗ bờ (Ocean Waves)*
  6. *Suối chảy róc rách (Forest Stream)*
  7. *Tiếng chim hót trong rừng (Bird Song)*
  8. *Không khí quán cà phê (Coffee Shop Ambience)*
  9. *Tiếng gõ bàn phím cơ (Mechanical Keyboard)*
  10. *Tiếng ve / Đêm hè (Night Crickets)*
* **FR-2.2 (Điều khiển độc lập từng kênh)**: Mỗi kênh có nút Bật/Tắt (Toggle) và thanh trượt điều chỉnh âm lượng riêng biệt (0% – 100%).
* **FR-2.3 (Phối âm nhanh - 1-Click Sound Presets)**: Cung cấp các cấu hình phối sẵn kinh điển:
  * *Đêm mưa bão*: Mưa rào (70%) + Sấm sét (40%) + Gió (30%)
  * *Góc quán cafe ấm áp*: Quán cafe (60%) + Mưa nhẹ (25%) + Gõ phím (20%)
  * *Nhà gỗ mùa đông*: Lửa trại (70%) + Gió rít (35%)
  * *Bình minh trong rừng*: Chim hót (50%) + Suối chảy (40%) + Gió thoảng (20%)
* **FR-2.4 (Master Controls)**: Nút "Tắt tất cả" (Mute All) để ngắt nhanh toàn bộ âm thanh môi trường khi cần nghe điện thoại hoặc họp.

### FR-3: Kho hình nền 4K & Bộ lọc hiển thị (Visual Experience & 4K Wallpapers)
* **FR-3.1 (Bộ sưu tập 4K tuyển chọn)**: Cung cấp kho ảnh nền độ phân giải cao được phân loại theo chủ đề:
  * *Rừng thông sương mù (Pine Forest & Mist)*
  * *Hoàng hôn trên đại dương (Sunset Ocean)*
  * *Đỉnh núi tuyết hùng vĩ (Snowy Peaks)*
  * *Căn phòng Lofi bên cửa sổ mưa (Rainy Lofi Room)*
  * *Quán cà phê vintage ấm cúng (Cozy Coffee Shop)*
  * *Bầu trời đêm đầy sao (Starry Night Sky)*
* **FR-3.2 (Bộ lọc Darkness Overlay)**: Thanh trượt tăng/giảm lớp phủ màu tối (0% – 80%) để bảo vệ mắt và làm nổi bật các widget.
* **FR-3.3 (Bộ lọc Blur - Làm mờ nền)**: Thanh trượt điều chỉnh độ mờ hậu cảnh (0px – 10px) giúp giảm phân tâm khi người dùng muốn dồn 100% sự chú ý vào công việc.
* **FR-3.4 (Bộ chọn hình nền trực quan)**: Drawer hoặc Popup hiển thị thumbnail sắc nét, chuyển đổi hình nền tức thì chỉ với 1 click.

### FR-4: Đồng hồ Pomodoro trung tâm (Central Pomodoro Timer)
* **FR-4.1 (Vị trí & Thẩm mỹ)**: Đặt ngay vị trí trung tâm màn hình với typography to bản, thanh lịch, phong cách tối giản.
* **FR-4.2 (3 Chế độ thời gian chuẩn)**:
  * *Focus (Tập trung)*: Mặc định 25 phút.
  * *Short Break (Nghỉ ngắn)*: Mặc định 5 phút.
  * *Long Break (Nghỉ dài)*: Mặc định 15 phút.
* **FR-4.3 (Điều khiển thời gian)**: Các nút Start (Bắt đầu), Pause (Tạm dừng), Reset (Đặt lại), Skip (Bỏ qua phiên).
* **FR-4.4 (Tùy chỉnh thời lượng)**: Cho phép người dùng chỉnh số phút của Focus, Short Break, Long Break theo thói quen cá nhân.
* **FR-4.5 (Âm báo chuông)**: Phát âm thanh chuông nhẹ (Zen Chime / Bell) khi kết thúc một phiên đếm giờ.
* **FR-4.6 (Đếm số phiên hoàn thành)**: Hiển thị số phiên Pomodoro đã hoàn thành trong ngày (ví dụ: `🍅 4 / 8`).
* **FR-4.7 (Zen Mode / Focus Mode)**: Chế độ toàn màn hình ẩn toàn bộ các bảng điều khiển xung quanh, chỉ giữ lại hình nền và đồng hồ đếm giờ.

### FR-5: Quản lý công việc hàng ngày (Daily Todo List & Reset Engine)
* **FR-5.1 (Widget dạng Drawer/Floating Panel)**: Nằm ở góc màn hình, có thể thu gọn hoặc mở rộng linh hoạt.
* **FR-5.2 (Phân loại 2 nhóm công việc)**:
  1. **Thói quen lặp lại hàng ngày (Daily Habits / Routines)**:
     * Dành cho các việc lặp đi lặp lại mỗi ngày (VD: Đọc sách 20p, Uống 2L nước, Review code, Luyện LeetCode...).
     * Tự động bỏ tích (uncheck) sau 00:00 mỗi ngày để người dùng làm lại vào ngày mới.
  2. **Việc phát sinh trong ngày (Daily Tasks / One-off Tasks)**:
     * Dành cho công việc cụ thể của ngày hôm đó (VD: Hoàn thành báo cáo dự án X, Gửi email cho khách hàng Y).
     * Khi sang ngày mới: Các việc đã hoàn thành (`completed: true`) sẽ tự động được dọn dẹp chuyển vào mục Lịch sử (Archive); các việc chưa làm (`completed: false`) sẽ được tự động giữ lại để tiếp tục làm tiếp hôm sau.
* **FR-5.3 (Thao tác quản lý)**:
  * Thêm việc mới với gắn nhãn (Habit vs Daily Task).
  * Đánh dấu hoàn thành / Bỏ đánh dấu.
  * Sửa tiêu đề, xóa công việc.
* **FR-5.4 (Thanh tiến độ trong ngày)**: Hiển thị thanh phần trăm và số lượng việc đã hoàn thành (VD: `Đã xong 5/7 việc (71%)`).
* **FR-5.5 (Cơ chế Tự động Reset theo ngày)**:
  * Hệ thống so sánh ngày hiện tại (`currentDate`) với ngày lưu gần nhất (`lastActiveDate`) trong `localStorage`.
  * Khi phát hiện sang ngày mới (hoặc mở lại app vào ngày hôm sau), hệ thống tự động kích hoạt logic reset mà không làm mất dữ liệu của người dùng.

---

## 4. Yêu cầu Phi chức năng (Non-Functional Requirements - NFR)

| Tiêu chí | Yêu cầu |
| :--- | :--- |
| **Hiệu năng (Performance)** | Tốc độ tải trang khởi điểm dưới 2 giây. Chuyển đổi bài hát/hình nền không gây giật lag. |
| **Quyền riêng tư (Privacy)** | 100% dữ liệu (danh sách công việc, cấu hình âm thanh, tùy chọn nền) lưu tại trình duyệt của người dùng (`localStorage`). Không thu thập dữ liệu cá nhân. |
| **Tính khả dụng (Accessibility)** | Tương phản màu sắc đảm bảo tiêu chuẩn WCAG AA khi bật các lớp phủ nền (Darkness Overlay). Phím tắt cơ bản (Space để Start/Pause Pomodoro). |
| **Thiết kế Thẩm mỹ (Aesthetics)** | Giao diện phong cách Glassmorphism mờ ảo hiện đại, bảng màu trầm ấm thư giãn, typography thanh lịch (Inter / JetBrains Mono). |
| **Khả năng phản hồi (Responsive)** | Tối ưu hóa hoàn hảo trên Desktop (1920x1080, 1440x900) và Laptop/Tablet; hỗ trợ trải nghiệm di động cơ bản. |
| **Trình duyệt hỗ trợ** | Chạy mượt mà trên Chrome, Firefox, Safari, Edge phiên bản mới nhất. |

---

## 5. Tiêu chí Chấp nhận & Đo lường Thành công (Acceptance Criteria & DoD)

* [ ] Mở trang web lần đầu tiên: Có ngay nhạc phát sẵn, hình nền đẹp, đồng hồ hiển thị rõ ràng, không có lỗi console.
* [ ] Nhạc YouTube: Phát mượt mà, đổi kênh trong preset được ngay, dán link YouTube bất kỳ phát thành công, kéo volume thay đổi âm lượng chính xác.
* [ ] White Noise: Có thể bật đồng thời nhiều âm thanh (mưa + lửa + sấm), kéo thanh trượt từng âm lượng độc lập mà không bị rè hay xung đột âm thanh.
* [ ] Background: Chuyển đổi hình nền tức thì; thanh trượt làm tối và làm mờ hoạt động mượt mà.
* [ ] Pomodoro: Đếm ngược chính xác, chuông báo kêu khi hết giờ, đổi chế độ 25/5/15 hoạt động chuẩn.
* [ ] Todo List: Thêm việc mới mượt mà; test logic đổi ngày (mock date) thì thói quen tự bỏ tick và việc đã xong tự dọn dẹp.
