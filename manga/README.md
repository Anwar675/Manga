## Giới thiệu

Đây là mã nguồn cho **website đọc Manga** được xây dựng bằng **Next.js 15 (App Router)** kết hợp **Payload CMS** làm hệ thống quản trị nội dung (manga, chapter, media, rating, comment...).  
Frontend dùng **TailwindCSS 4**, **Swiper**, **shadcn/ui**, **TRPC + React Query** để tối ưu UX và data fetching.

## Tính năng chính

- **Trang chủ**
  - Slider banner, danh sách truyện phổ biến, mới cập nhật, truyện hot.
  - Pagination cho danh sách manga (`/pages/[page]`).
- **Trang chi tiết manga**
  - Thông tin manga, cover, thể loại, tác giả, trạng thái, lượt xem, follower.
  - Rating trung bình (sao) được tính từ collection `ratings`.
  - Danh sách chapter, truy cập chapter qua slug `/manga/[mangaSlug]/[chapter]`.
- **Đọc chapter**
  - Hiển thị danh sách `pages` (ảnh) của chapter.
- **Auth**
  - Đăng ký / đăng nhập (Next App Router + Payload user collection).
- **Admin / CMS**
  - Giao diện Payload admin tại `/admin` (dưới `src/app/(payload)/admin`).
  - Quản lý collections: `Users`, `Media`, `Categories`, `Banners`, `Authors`, `Manga`, `Chapters`, `EffectComment`, `Comments`, `Rating`.
- **Rating**
  - Collection `ratings` lưu rating của từng user cho từng manga.
  - Hook `updateMangaRating` tự động tính `avg` và `count` và lưu vào field `rating` của `Manga`.
- **Comment & hiệu ứng**
  - Hệ thống `comments` + `effect-comments` để hiển thị admin chat / thông báo.
- **Rank**
  -Bảng xếp hạng bao gồm top ngày, tháng ,năm dùng `redis` để tối ưu query đối với mỗi viewer

## Công nghệ sử dụng

- **Frontend**
  - `next`, `react`, `react-dom`
  - `tailwindcss`, `tw-animate-css`, `tailwind-scrollbar-hide`
  - `lucide-react`, `swiper`
  - `react-hook-form`, `@hookform/resolvers`, `zod`
  - `shadcn/ui`, `sonner`
- **Backend / CMS**
  - `payload` với adapter `@payloadcms/db-postgres`
  - `@payloadcms/next` để tích hợp vào Next App Router
- **Data fetching**
  - `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`
  - `@tanstack/react-query`

## Cấu trúc thư mục chính

- `src/app`
  - `(app)/(home)` – trang home, chi tiết manga, danh sách phân trang, settings.
  - `(auth)` – trang `sign-in`, `sign-up`.
  - `(payload)` – admin Payload (`admin`, `api`, `graphql`, ...).
  - `api/trpc/[trpc]` – handler cho TRPC router.
- `src/collections`
  - Định nghĩa collections của Payload CMS: `Manga`, `Chapters`, `Rating`, `Comments`, `EffectComment`, `Users`, `Media`, ...
- `src/modules`
  - `home/ui` – component UI cho trang home (card manga, slider, popular, new update,...).
  - `auth` – logic & UI auth.
  - `comments` – server + UI comment / admin chat.
- `src/lib`
  - `star-collection.ts` – hook tính rating manga.
  - `seed.ts` – script seed dữ liệu.
  - `formatime.ts`, `utils.ts`, ...
- `src/trpc`
  - TRPC client, server, router (`routers/_app.ts`, v.v.).

## Chuẩn bị môi trường

### Biến môi trường bắt buộc

Tạo file `.env` (hoặc `.env.local`) với các biến tối thiểu:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
PAYLOAD_SECRET=chuoi_bi_mat_bat_ky
```

Tùy môi trường triển khai, có thể cần thêm biến cho hosting, URL public, v.v.

## Cài đặt & chạy dự án

### 1. Cài dependency

```bash
bun install
# hoặc
npm install
```

### 2. Chạy migrate & seed database (Postgres)

```bash
bun generate:types      # sinh lại file `payload-types.ts`
bun db:fresh           # migrate fresh (xóa & tạo lại schema Payload)
bun db:seed            # chạy script seed dữ liệu mẫu
```

> Lưu ý: `db:fresh` sẽ **xoá dữ liệu cũ**, chỉ dùng ở môi trường dev.

### 3. Chạy server dev

```bash
bun dev
```

Ứng dụng frontend & Payload sẽ chạy tại `http://localhost:3000`.

- Admin Payload: `http://localhost:3000/admin`
- API TRPC: `http://localhost:3000/api/trpc`

### 4. Build & chạy production

```bash
bun build
bun start
```

## Scripts có sẵn

- `bun dev` – chạy Next dev server.
- `bun build` – build production.
- `bun start` – chạy app đã build.
- `bun lint` – chạy ESLint.
- `bun generate:types` – sinh `payload-types.ts` từ cấu hình Payload.
- `bun db:fresh` – reset database theo schema Payload.
- `bun db:seed` – seed dữ liệu mẫu.

## Ghi chú triển khai

- Ứng dụng dựa trên **Next App Router** nên khi deploy (Vercel / Node server riêng) cần bật hỗ trợ **Edge/Node runtime** phù hợp.
- Payload dùng Postgres, cần đảm bảo kết nối ra ngoài được (database cloud hoặc container cùng network).
- Một số dependency như `sharp` được đánh dấu trong `trustedDependencies`, cần cho phép cài đặt trên môi trường build.

## Phát triển tiếp

- Thêm tính năng tìm kiếm manga, filter theo thể loại.
- Tối ưu SEO (metadata cho trang manga, chapter).
- Bổ sung middleware auth cho các route cần bảo vệ (đăng truyện, quản lý manga).
- Viết test (unit / integration) cho hooks quan trọng như rating, chapter.
