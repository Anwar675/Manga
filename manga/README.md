## Giới thiệu

Đây là mã nguồn cho **website đọc Manga** được xây dựng bằng **Next.js 15 (App Router)** kết hợp **Payload CMS** làm hệ thống quản trị nội dung (manga, chapter, media, rating, comment...).
Frontend sử dụng **TailwindCSS 4**, **Swiper**, **shadcn/ui**, **TRPC + React Query** để tối ưu trải nghiệm người dùng và data fetching.

Dự án tập trung vào hiệu năng, SEO cho trang manga, và hệ thống quản trị linh hoạt cho admin.

---

## ✨ Tính năng nổi bật

- Trang chủ đẹp mắt: Banner slider, Truyện phổ biến, Mới cập nhật, Top ranking (ngày/tuần/tháng/năm)
- Trang chi tiết manga + SEO động (meta title, description, Open Graph, canonical)
- Chapter reader tối ưu: Swiper vertical, lazy-load ảnh, next/prev chapter, lịch sử đọc tự động
- Tìm kiếm realtime + filter nâng cao (thể loại, trạng thái, follow, ranking)
- Hệ thống follow manga + thư viện cá nhân
- Lịch sử đọc chi tiết (chapter gần nhất, thời gian)
- Đánh giá sao + tính trung bình tự động
- Hệ thống comment (manga & chapter)
- Auth + phân quyền (User / Translator / Admin / Super Admin)
- Admin dashboard đầy đủ tại `/admin` (quản lý manga, chapter, media, user, comment, rating...)
- Ranking realtime bằng **Redis** (không load database nặng)
- Dark mode + responsive hoàn hảo
### SEO manga

* Sinh dynamic metadata cho mỗi trang manga:

  * Title theo tên manga
  * Description theo summary
  * Open Graph image từ cover
* URL thân thiện SEO: `/manga/[slug]`
* Hỗ trợ sitemap & indexing.

### Tìm kiếm & filter

* Tìm kiếm manga theo tên.
* Filter theo:

  * Thể loại (genre)
  * Trạng thái
  * Truyện đã follow
  * Ranking
* Kết hợp nhiều filter để tạo trang danh sách nâng cao.

### Follow & thư viện cá nhân

* User có thể follow manga.
* Trang riêng hiển thị danh sách manga đã follow.
* Pagination cho danh sách follow.
* Đồng bộ follower count trong Manga.

### Lịch sử đọc

* Lưu lịch sử đọc chapter theo user.
* Trang lịch sử hiển thị:

  * Manga đã đọc
  * Chapter gần nhất
  * Thời gian đọc

### Auth & phân quyền

* Đăng ký / đăng nhập.
* Phân quyền role:

  * User
  * Translator
  * Admin
  * Super Admin
* RBAC cho admin dashboard.

### Admin / CMS

* Giao diện admin tại `/admin`.
* Quản lý collections:

  * Users
  * Media
  * Categories
  * Banners
  * Authors
  * Manga
  * Chapters
  * Rating
  * Comments
  * Follow
  * History

### Rating

* User rating theo sao.
* Hook tự động tính average rating cho manga.

### Comment

* Hệ thống comment cho manga & chapter.
* Admin có thể quản lý comment.

### Rank

* Ranking top ngày / tuần / tháng / năm.
* Dùng Redis để tối ưu truy vấn.

---

## 🛠 Công nghệ sử dụng

| Layer          | Công nghệ                              |
|----------------|----------------------------------------|
| Framework      | Next.js 15 (App Router)                |
| CMS            | Payload CMS + PostgreSQL               |
| Styling        | Tailwind CSS 4 + shadcn/ui             |
| Data Fetching  | tRPC + React Query                     |
| Cache/Ranking  | Redis                                  |
| Icons          | lucide-react                           |
| Form           | react-hook-form + zod                  |
| Slider         | Swiper                                 |
| Auth           | Payload built-in auth                  |




## Cấu trúc thư mục chính

### src/app

* (home) – trang home, manga, ranking
* (auth) – sign-in / sign-up
* (payload) – admin CMS
* api/trpc – TRPC handler

### src/collections

* Manga
* Chapters
* Rating
* Comments
* Users
* Media
* Follow
* History
* Categories

### src/modules

* home/ui – UI trang home
* auth – logic auth
* manga – UI & logic manga
* comments – comment system

### src/lib

* rating hooks
* seed script
* format helpers

### src/trpc

* client
* routers
* server config

---

## Chuẩn bị môi trường

### Biến môi trường bắt buộc

Tạo `.env` hoặc `.env.local`:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
PAYLOAD_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
```

---

## Cài đặt & chạy dự án

### 1. Cài dependency

```bash
bun install
# hoặc
npm install
```

### 2. Database

```bash
bun generate:types
bun db:fresh
bun db:seed
```

> Cảnh báo: `db:fresh` sẽ xoá dữ liệu cũ.

### 3. Chạy dev

```bash
bun dev
```

### 4. Demo

* Live: https://alga21.site
* Admin: http://localhost:3000/cms-91xka-admin

### 4. Production

```bash
bun build
bun start
```

---

## Scripts

* bun dev – chạy dev server
* bun build – build production
* bun start – chạy production
* bun lint – eslint
* bun generate:types – sinh payload types
* bun db:fresh – reset database
* bun db:seed – seed dữ liệu

---

## Ghi chú triển khai

* Yêu cầu Postgres và Redis hoạt động ổn định.
* Cần hỗ trợ Node runtime khi deploy.
* Dependency như sharp phải được build đúng môi trường.

---

## Phát triển tiếp

* SEO nâng cao (structured data, sitemap auto)
* Recommendation system
* Notification cho manga follow
* Caching layer cho manga phổ biến
* Unit & integration tests
* Monitoring & logging cho admin actions
