# VibeCodingStudio (VibeSpace) - Monorepo

> Personalized Aesthetic Focus Workspace

Ứng dụng web giúp tạo ra một không gian làm việc tập trung cá nhân hóa với nhạc Lofi, âm thanh thiên nhiên White Noise, hình nền 4K thư giãn, đồng hồ Pomodoro và Daily Todo List.

---

## 📁 Cấu trúc Monorepo

Dự án được quản lý theo mô hình **Monorepo** với **npm workspaces**:

```
vibespace/ (Root)
├── apps/
│   ├── frontend/        # Ứng dụng Web Client React 18 + Vite + Tailwind CSS (@vibespace/frontend)
│   └── backend/         # Thư mục rỗng sẵn sàng cho mã nguồn Backend (REST API / Services)
├── docs/                # Tài liệu kỹ thuật dự án (PRD, TECH_ARCHITECTURE, PLAN, COMPONENT_SPECS)
├── stitch-designs/      # Tài nguyên thiết kế giao diện từ Google Stitch
├── .agents/             # Agent rules & skills
├── package.json         # Cấu hình npm workspaces điều phối toàn bộ monorepo
└── README.md
```

---

## 🚀 Khởi chạy Dự án

Cài đặt dependencies tại thư mục gốc:
```bash
npm install
```

### Chạy Frontend từ Thư mục Gốc:
```bash
# Khởi chạy Vite Dev Server cho frontend
npm run dev

# Hoặc dùng script chỉ định rõ workspace
npm run dev:frontend

# Build production cho frontend
npm run build
```

### Chạy trực tiếp trong từng App:
```bash
cd apps/frontend
npm run dev
```

---

## 📚 Tài liệu Dự án
- [Product Requirements Document (PRD)](docs/PRD.md)
- [Technical Architecture](docs/TECH_ARCHITECTURE.md)
- [Project Plan](docs/PLAN.md)
- [Component Specifications](docs/COMPONENT_SPECS.md)
