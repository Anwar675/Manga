## Giới thiệu

Đây là mã nguồn cho **website đọc Manga** được xây dựng bằng **Next.js 15 (App Router)** kết hợp **Payload CMS** làm hệ thống quản trị nội dung (manga, chapter, media, rating, comment...).
Frontend sử dụng **TailwindCSS 4**, **Swiper**, **shadcn/ui**, **TRPC + React Query** để tối ưu trải nghiệm người dùng và data fetching.

Dự án tập trung vào hiệu năng, SEO cho trang manga, và hệ thống quản trị linh hoạt cho admin.

---

## Tính năng chính

### Trang chủ

* Slider banner, danh sách truyện phổ biến, mới cập nhật, truyện hot.
* Pagination cho danh sách manga (`/pages/[page]`).
* Ranking theo ngày / tuần / tháng / năm bằng Redis.

### Trang chi tiết manga

* Thông tin manga: cover, thể loại, tác giả, trạng thái, lượt xem, follower.
* SEO tự động cho từng manga (meta title, description, Open Graph).
* Rating trung bình (sao) được tính từ collection `ratings`.
* Danh sách chapter, truy cập qua slug `/manga/[mangaSlug]/[chapter]`.

### Đọc chapter

* Hiển thị danh sách ảnh của chapter.
* Tự động ghi lịch sử đọc cho user.
* Điều hướng chapter trước / sau.

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

## Công nghệ sử dụng

### Frontend

* next, react, react-dom
* tailwindcss, tw-animate-css
* lucide-react, swiper
* react-hook-form, zod
* shadcn/ui
* @tanstack/react-query

### Backend / CMS

* payload + postgres adapter
* tích hợp Payload vào Next App Router

### Data fetching

* trpc server/client
* react query

### Cache & ranking

* redis

---

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

* App: http://localhost:3000
* Admin: http://localhost:3000/admin
* TRPC: http://localhost:3000/api/trpc

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
