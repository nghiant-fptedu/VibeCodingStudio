
## Prompt 1
[/grill-me](slashCommand;grill-me) 

Tôi muốn xây dựng một ứng dụng web tên là VibeSpace giúp user tạo ra một không gian làm việc tập trung cá nhân hóa. User có thể mở website và sử dụng ngay lập tức mà không cần đăng ký tài khoản. 

Các chức năng chính của website mà tôi mong muốn:

1. User có thể nghe nhạc LoFi thư giãn thông qua trình phát nhạc của Youtube. Mặc định hệ thống sẽ chọn sẵn 1 bài và user có thể thay đổi bài hát khác. User có thể copy và dán link Youtube để thêm bài hát tùy ý. User có thể tùy chỉnh được âm lượng.
2. User có thể tùy chỉnh để mix các âm thanh white noise như tiếng mưa rơi, tiếng lửa cắm trại, tiếng gió, ... và có thể tùy chỉnh âm lượng của từng loại âm thanh riêng biệt.
3. User có thể tùy chỉnh background của website thông qua kho ảnh nền sinh động thư giãn mà hệ thống cung cấp như ảnh rừng thông, đại dương, núi, biển, ...
4. Có đồng hồ pomodoro đếm giờ đặt ở vị trí trung tâm.
5. Có chức năng todo list theo ngày và sẽ reset mỗi ngày (sau 00:00). User có thể tạo các công việc hằng ngày để dễ dàng theo dõi và hoàn thành.

Bạn đóng vai trò là Project Manager & BA, hãy viết PRD.md (Product Requirements Document), TECH_ARCHITECTURE.md, PLAN.md. Các tài liệu này sẽ được lưu trong folder `docs` để tiện cho việc quản lý.

Lưu ý: Quy trình làm việc của tôi là planning -> design (Google Stitch) -> download design từ Google Stitch -> code (convert design to react component).

## Prompt 2

Hãy tổ chức lại dự án theo kiến trúc monorepo và đồng thời tạo sẵn 1 folder rỗng chứa source code backend


## Prompt 3

[/grill-me](slashCommand;grill-me) 
Bạn là senior project manager.
Tôi muốn implement thêm backend (expressjs) và database (postgresql) để triển khai thêm một số những tính năng mới cho dự án.
1. Cho phép user đăng ký / đăng nhập tài khoản 
2. Lưu lại danh sách các bài nhạc và cho phép xóa
3. Lưu lại danh sách todo mà user đã tạo và cho phép xóa

Tôi sẽ deploy backend bằng render và database bằng supabase thông qua mcp mà tôi đã cấu hình.

Hãy lên kế hoạch cho milestone tiếp theo sau khi hoàn thành grill me.