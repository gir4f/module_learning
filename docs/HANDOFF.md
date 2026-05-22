# Dokumen Serah Terima — Modul Ajar

> **Proyek**: Modul Ajar — Internal Learning Module CMS  
> **Organisasi**: PT. Gitronik Dimindo Indonesia  
> **Repository**: `gir4f/module_learning`  
> **Penyusun**: Intern Developer  
> **Tanggal Serah Terima**: 22 Mei 2026  
> **Periode Pengembangan**: 4 Mei 2026 – 21 Mei 2026

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Stack Teknologi](#2-stack-teknologi)
3. [Kronologi Pengembangan](#3-kronologi-pengembangan)
4. [Fitur yang Sudah Selesai](#4-fitur-yang-sudah-selesai)
5. [Arsitektur Aplikasi](#5-arsitektur-aplikasi)
6. [Peta Kode Sumber (Codebase Map)](#6-peta-kode-sumber-codebase-map)
7. [Skema Database](#7-skema-database)
8. [Sistem Autentikasi & Keamanan](#8-sistem-autentikasi--keamanan)
9. [State Management](#9-state-management)
10. [API Contracts](#10-api-contracts)
11. [Testing](#11-testing)
12. [Panduan Setup & Development](#12-panduan-setup--development)
13. [Panduan Deployment Production](#13-panduan-deployment-production)
14. [Akun Bawaan (Seed)](#14-akun-bawaan-seed)
15. [Keterbatasan & Catatan Teknis](#15-keterbatasan--catatan-teknis)
16. [Rekomendasi Pengembangan Masa Depan](#16-rekomendasi-pengembangan-masa-depan)
17. [Referensi Dokumentasi Existing](#17-referensi-dokumentasi-existing)

---

## 1. Ringkasan Eksekutif

**Modul Ajar** adalah aplikasi web modul ajar internal (LMS) full-stack yang dibangun untuk mengelola dan menampilkan modul pembelajaran produk di PT. Gitronik Dimindo Indonesia.q**.

Aplikasi memiliki dua tampilan utama:

- **Learner Surface** — Halaman katalog dan detail modul untuk karyawan yang ingin mempelajari produk perusahaan.
- **Admin Surface** — Dashboard pengelolaan modul dengan fitur CRUD lengkap (Create, Read, Update, Delete), termasuk manajemen varian produk, komponen material, dan upload lampiran file.

Kedua surface tersebut diimplementasikan dengan sistem RBAC dengan role `ADMIN` dan `VIEWER`.

---

## 2. Stack Teknologi

| Layer | Teknologi | Versi |
|:------|:----------|:------|
| Framework | Nuxt | 4.x |
| Frontend | Vue 3 + TypeScript | - |
| Styling | Tailwind CSS v4 + PrimeVue (Aura Theme) | - |
| State Management | Pinia | 3.x |
| Server Engine | Nitro / h3 | (bawaan Nuxt) |
| ORM | Prisma | 6.x |
| Database | PostgreSQL | - |
| Autentikasi | h3 Cookie-based Session + bcryptjs | - |
| Upload Processing | Sharp (image preview .webp) | - |
| UI Animations | @formkit/auto-animate | - |
| Notifications | vue-sonner | - |
| UI Components | PrimeVue (Button, Drawer, Select, dll.) | 4.x |
| Validasi | Zod | 4.x |
| Font | Inter (Google Fonts) | - |
| Testing | Vitest | 4.x |
| Node.js | ^20.19.0 atau >=22.12.0 | - |

---

## 3. Kronologi Pengembangan

Berikut adalah ringkasan fase pengembangan berdasarkan riwayat commit:

### Fase 1 — Inisialisasi & Foundation (4–5 Mei 2026)
- Initial commit dan setup repository.
- Inisialisasi awal dengan Supabase Auth (kemudian digantikan).
- Pembuatan navbar, card box styling, dan halaman CRUD dasar.
- Pembuatan seed data modul dan unit test awal (`search`, `seedModules`, `slug`).

### Fase 2 — Migrasi Auth & Upgrade Framework (6–13 Mei 2026)
- **Migrasi dari Supabase Auth ke Session Auth (h3-session)** — keputusan arsitektur kunci.
- Simplifikasi admin CRUD.
- Upgrade framework: **Nuxt 4**, **Tailwind CSS v4**, **Vue 3.5 component APIs**.
- Implementasi rate limiter untuk login.
- Penambahan unit test untuk `apiErrors`, `upload`, dan `rateLimit`.

### Fase 3 — Polish UI/UX & Responsiveness (14–16 Mei 2026)
- Optimasi viewport mobile dan performa responsif secara intensif.
- Konversi image preview ke format `.webp`.
- Pemisahan `AppTopNavbar` dan `NavbarMobileDrawer`.
- Implementasi dark/light mode yang mengikuti preferensi perangkat.
- Integrasi **AutoAnimate** untuk animasi transisi yang halus.
- Disable tombol "SIMPAN" saat tidak ada perubahan.

### Fase 4 — Fitur Lanjutan & Finalisasi (17–19 Mei 2026)
- Penambahan **Command Palette** untuk navigasi cepat.
- **Migrasi state management ke Pinia** sebagai single source of truth.
- Penambahan dokumentasi lengkap (`docs/`).
- Penambahan login internal untuk role `VIEWER`.
- Implementasi **Bulk Delete & Bulk Status** untuk operasi massal modul.
- Implementasi **Fuzzy Logic pada CSV Import** untuk pencocokan data komponen.
- Penambahan unit test untuk `authRoutes`, `authRefresh`, `themePreference`, `moduleBulkValidation`, `csvUtils`, dan `csvImportLimits`.

### Fase 5 — Audit Log & Stabilisasi (20–21 Mei 2026)
- Implementasi **Audit Log** — pencatatan riwayat aktivitas admin (create, update, delete).
- Halaman admin **Riwayat Aktivitas** (`/admin/audit-logs`) dengan filter kategori dan pengguna.
- Penambahan komponen **BulkActionPill** untuk operasi massal varian produk dan lampiran.
- Penambahan composable `useFocusTrap` untuk aksesibilitas modal/dialog.
- Fix **Vue single-root-node** pada halaman editor modul agar kompatibel dengan `<Transition>` NuxtPage.
- Penambahan unit test untuk `auditDisplay`, `auditLog`, `auditPagination`, dan `bulkActions`.

---

## 4. Fitur yang Sudah Selesai

### Learner Surface (Halaman Publik Internal)
- [x] Katalog modul dengan pencarian dan filter lokal.
- [x] Halaman detail modul dengan navigasi antar varian produk.
- [x] Tabel komponen/material per varian produk.
- [x] Daftar lampiran (gambar, PDF, spreadsheet, link).
- [x] Image Lightbox untuk melihat gambar secara penuh.
- [x] PDF Preview Modal untuk melihat dokumen PDF.
- [x] Dark/Light mode (dengan deteksi preferensi perangkat).
- [x] Responsive design (desktop & mobile).
- [x] Print-friendly header untuk cetakan.

### Admin Surface (Dashboard Pengelolaan)
- [x] Daftar modul admin dengan pencarian dan sorting.
- [x] Buat modul baru (`/admin/modules/new`).
- [x] Editor modul lengkap (`/admin/modules/:id`):
  - Edit metadata modul (judul, slug, deskripsi, keywords, status, urutan).
  - Kelola varian produk (section/detail).
  - Kelola komponen/material per varian (inline table editor).
  - Upload & kelola lampiran file (gambar, PDF, spreadsheet).
  - Otomatis generate preview `.webp` untuk gambar.
- [x] Bulk operations: hapus massal & ubah status massal.
- [x] Bulk operations varian produk dan lampiran (BulkActionPill).
- [x] CSV Import dengan fuzzy matching untuk komponen.
- [x] Command Palette untuk navigasi cepat.
- [x] AutoAnimate untuk transisi yang halus.
- [x] Tombol "SIMPAN" yang otomatis disable jika tidak ada perubahan.
- [x] **Audit Log** — Riwayat aktivitas admin (`/admin/audit-logs`).

### Autentikasi & Keamanan
- [x] Login dengan email & password.
- [x] Role-Based Access Control (`ADMIN` / `VIEWER`).
- [x] Cookie-based session (`h3-session`) dengan `httpOnly`, `sameSite`, `secure`.
- [x] Same-Origin Protection (Anti-CSRF) untuk semua API mutasi.
- [x] Rate Limiting pada endpoint login (8 percobaan / 15 menit per IP+email).
- [x] Path traversal guard pada upload.
- [x] Redirect otomatis berdasarkan role setelah login.
- [x] SESSION_SECRET validation di production (fail-fast jika lemah).

### Infrastruktur
- [x] Database seed script untuk data awal.
- [x] Custom build script yang menyembunyikan noise sourcemap Tailwind.
- [x] Asset audit & optimize scripts.
- [x] 19 unit test files dengan Vitest.

---

## 5. Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                   │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Learner    │  │   Admin      │  │    Login      │  │
│  │  Pages      │  │   Pages      │  │    Page       │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                │                  │           │
│  ┌──────┴────────────────┴──────────────────┴────────┐  │
│  │              Pinia Stores (State)                 │  │
│  │    auth  |  learningModules  |  modules            │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │ fetch / axios                  │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP (cookie session otomatis)
┌─────────────────────────┼───────────────────────────────┐
│                  Nuxt Server (Nitro/h3)                  │
│                         │                                │
│  ┌──────────────────────┴─────────────────────────────┐  │
│  │          Server Middleware (auth.ts)                │  │
│  │   Same-Origin Check + Session Validation            │  │
│  └──────────────────────┬─────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────┴─────────────────────────────┐  │
│  │              API Routes (server/api/)               │  │
│  │   /auth  |  /modules  |  /details  |  /uploads     │  │
│  └──────────────────────┬─────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────┴─────────────────────────────┐  │
│  │        Server Utils                                 │  │
│  │   prisma | auth | rateLimit | uploads | slug        │  │
│  └──────────────────────┬─────────────────────────────┘  │
│                         │                                │
└─────────────────────────┼───────────────────────────────┘
                          │
          ┌───────────────┼──────────────────┐
          │               │                  │
     PostgreSQL     File System         h3-session
      (Prisma)     (UPLOAD_DIR)       (Cookie Store)
```

Semua komponen berjalan dalam **satu proses Nuxt/Nitro yang sama** — tidak ada backend service terpisah. Ini adalah arsitektur monolith yang sangat cocok untuk aplikasi internal dengan skala kecil-menengah.

---

## 6. Peta Kode Sumber (Codebase Map)

### Frontend (`app/`)

```
app/
├── app.vue                          # Root component (loading indicator, toaster, scroll-to-top)
├── assets/css/main.css              # Stylesheet utama Tailwind + custom CSS
├── components/
│   ├── admin/                       # Komponen khusus halaman admin
│   │   ├── AdminFieldGroup.vue      # Wrapper untuk grup form field
│   │   ├── AdminSectionHeader.vue   # Header section editor
│   │   ├── AdminSurface.vue         # Container/card untuk konten admin
│   │   ├── InlineComponentTable.vue # Inline editor tabel komponen
│   │   ├── ModuleForm.vue           # Form metadata modul
│   │   ├── ModuleList.vue           # Daftar modul di admin (18KB - komponen terbesar)
│   │   └── SectionCard.vue          # Card editor per varian produk
│   ├── layout/                      # Komponen tata letak
│   │   ├── AdminSidebar.vue         # Sidebar navigasi admin
│   │   ├── AppTopNavbar.vue         # Navbar utama (23KB - sangat kompleks)
│   │   ├── AuditSidebarCard.vue     # Card aktivitas terbaru di sidebar admin
│   │   ├── LearningFooter.vue       # Footer halaman learner
│   │   ├── LearningHeader.vue       # Header halaman learner
│   │   └── NavbarMobileDrawer.vue   # Drawer navigasi mobile
│   ├── learning/                    # Komponen khusus halaman learner
│   │   ├── AttachmentList.vue       # Daftar lampiran
│   │   ├── ComponentTable.vue       # Tabel komponen/material
│   │   ├── DocumentHeader.vue       # Header dokumen modul
│   │   ├── ModuleCard.vue           # Card modul di katalog
│   │   ├── ModuleDocument.vue       # Konten utama halaman detail (12KB)
│   │   ├── ModuleLibrary.vue        # Grid katalog modul
│   │   ├── ModuleSearch.vue         # Input pencarian modul
│   │   ├── PrintHeader.vue          # Header khusus cetak
│   │   └── SectionNav.vue           # Navigasi antar varian produk
│   └── shared/                      # Komponen reusable lintas surface
│       ├── BulkActionPill.vue       # Pill operasi massal (hapus, dll.)
│       ├── EmptyState.vue           # Tampilan state kosong
│       ├── ErrorNotice.vue          # Tampilan error
│       ├── ImageLightbox.vue        # Lightbox gambar fullscreen
│       ├── LoadingBlock.vue         # Indikator loading
│       ├── PageShell.vue            # Wrapper halaman
│       ├── PdfPreviewModal.vue      # Modal preview PDF
│       ├── ScrollToTop.vue          # Tombol scroll ke atas
│       └── SortSelect.vue           # Dropdown sorting
├── composables/
│   ├── useApiClient.ts              # Axios instance terpusat
│   ├── useDarkMode.ts               # Composable dark/light mode
│   ├── useFocusTrap.ts              # Focus trap untuk modal/dialog (aksesibilitas)
│   ├── useModuleEditor.ts           # Helper editor modul admin
│   └── useModuleSearch.ts           # Logic pencarian & filter modul
├── data/
│   └── seedModules.ts               # Data seed modul (15KB, dipakai oleh prisma/seed.ts)
├── layouts/
│   ├── admin.vue                    # Layout admin (sidebar + main content)
│   └── default.vue                  # Layout learner (header + footer)
├── middleware/
│   ├── admin.ts                     # Guard: hanya role ADMIN boleh masuk
│   └── auth.global.ts              # Guard global: wajib login untuk semua halaman
├── pages/
│   ├── admin/
│   │   ├── index.vue                # Redirect ke /admin/modules
│   │   ├── audit-logs/
│   │   │   └── index.vue            # Halaman riwayat aktivitas admin
│   │   └── modules/
│   │       ├── index.vue            # Daftar modul admin (13KB)
│   │       ├── new.vue              # Halaman buat modul baru
│   │       └── [id].vue             # Editor modul (46KB - halaman terbesar)
│   ├── modules/
│   │   └── [slug].vue               # Halaman detail modul learner
│   ├── index.vue                    # Homepage / katalog modul (6KB)
│   └── login.vue                    # Halaman login (4KB)
├── plugins/
│   └── 01.auth-resume.client.ts     # Restore session auth saat app load
├── stores/
│   ├── auditLog.ts                  # Store riwayat aktivitas admin
│   ├── auditRecent.ts               # Store aktivitas terbaru untuk sidebar card
│   ├── auth.ts                      # Store autentikasi (login/logout/profile)
│   ├── learningModules.ts           # Store data modul untuk learner
│   └── modules.ts                   # Store data & CRUD modul untuk admin (10KB)
├── types/
│   ├── audit.ts                     # TypeScript interfaces untuk audit log
│   └── learning.ts                  # TypeScript interfaces untuk modul
└── utils/
    ├── adminModuleUi.ts             # Helper UI admin
    ├── apiErrors.ts                 # Helper parsing error API
    ├── auditClient.ts               # Helper fetch & filter audit log (stale-refresh, pagination)
    ├── auditDisplay.ts              # Helper tampilan audit log (label aksi, entity)
    ├── authRefresh.ts               # Helper refresh auth
    ├── authRoutes.ts                # Helper routing auth (redirect logic)
    ├── csvImportLimits.ts           # Konstanta batas CSV import
    ├── csvUtils.ts                  # Parser CSV dengan fuzzy matching (7KB)
    ├── moduleUi.ts                  # Helper UI modul
    ├── motion.ts                    # Helper animasi/transisi
    ├── search.ts                    # Fungsi pencarian lokal
    ├── slug.ts                      # Generator slug
    ├── themePreference.ts           # Helper preferensi tema
    ├── timeAgo.ts                   # Format waktu relatif
    ├── upload.ts                    # Helper upload file
    └── validation.ts               # Validasi form dengan Zod
```

### Backend (`server/`)

```
server/
├── api/
│   ├── auth/
│   │   ├── login.post.ts            # POST /api/auth/login
│   │   ├── logout.post.ts           # POST /api/auth/logout
│   │   └── me.get.ts                # GET  /api/auth/me
│   ├── modules/
│   │   ├── index.get.ts             # GET  /api/modules
│   │   ├── index.post.ts            # POST /api/modules
│   │   ├── bulk.delete.ts           # DELETE /api/modules/bulk
│   │   ├── bulk.patch.ts            # PATCH  /api/modules/bulk
│   │   └── [id]/
│   │       ├── index.get.ts         # GET    /api/modules/:id
│   │       ├── index.patch.ts       # PATCH  /api/modules/:id
│   │       ├── index.delete.ts      # DELETE /api/modules/:id
│   │       └── details.post.ts      # POST   /api/modules/:id/details
│   ├── details/
│   │   └── [detailId]/
│   │       ├── index.patch.ts       # PATCH  /api/details/:detailId
│   │       ├── index.delete.ts      # DELETE /api/details/:detailId
│   │       ├── attachments.post.ts  # POST   /api/details/:detailId/attachments
│   │       └── components.post.ts   # POST   /api/details/:detailId/components
│   ├── attachments/
│   │   └── [attachmentId]/
│   │       ├── index.patch.ts       # PATCH  /api/attachments/:attachmentId
│   │       └── index.delete.ts      # DELETE /api/attachments/:attachmentId
│   ├── components/
│   │   └── [componentId]/
│   │       ├── index.patch.ts       # PATCH  /api/components/:componentId
│   │       └── index.delete.ts      # DELETE /api/components/:componentId
│   ├── audit-logs/
│   │   ├── index.get.ts             # GET /api/audit-logs (list riwayat)
│   │   ├── index.post.ts            # POST /api/audit-logs (catat aktivitas)
│   │   ├── index.patch.ts           # PATCH /api/audit-logs
│   │   ├── index.put.ts             # PUT /api/audit-logs
│   │   └── index.delete.ts          # DELETE /api/audit-logs
│   ├── uploads/
│   │   └── [...path].get.ts         # GET /api/uploads/:path (serve file)
│   └── uploads.post.ts              # POST /api/uploads (upload file)
├── middleware/
│   └── auth.ts                      # Same-origin guard + session check
└── utils/
    ├── apiError.ts                  # Helper error response
    ├── auditLog.ts                  # Helper pencatatan audit log ke database
    ├── auth.ts                      # Session management (h3-session)
    ├── cache.ts                     # Cache utility (ada tapi bukan mekanisme utama)
    ├── moduleBulk.ts                # Validasi bulk operations
    ├── prisma.ts                    # Prisma client singleton
    ├── rateLimit.ts                 # In-memory rate limiter
    ├── slug.ts                      # Server-side slug generator
    └── uploads.ts                   # Path traversal guard & file helpers
```

### File Konfigurasi Penting

```
root/
├── nuxt.config.ts                   # Konfigurasi Nuxt (theme PrimeVue, modules, runtime config)
├── package.json                     # Dependencies & scripts
├── prisma/
│   ├── schema.prisma                # Skema database
│   ├── migrations/                  # Histori Prisma migrations
│   ├── seed.ts                      # Script seed data awal
│   └── seed-sql.ts                  # Alternatif seed via SQL
├── scripts/
│   ├── build.mjs                    # Custom build (suppress sourcemap warnings)
│   ├── audit-assets.mjs             # Audit asset yang tidak terpakai
│   └── optimize-assets.mjs          # Optimasi asset
├── .env.example                     # Template environment variables
└── tsconfig.json                    # Konfigurasi TypeScript
```

---

## 7. Skema Database

- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Schema**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations`

### Entity Relationship Diagram

```
┌─────────────────┐
│     Profile      │
│─────────────────│
│ id          PK  │
│ email    UNIQUE │
│ fullName        │
│ passwordHash    │
│ role (enum)     │
│ createdAt       │
│ updatedAt       │
│ auditLogs  →[]  │
└─────────────────┘

┌─────────────────┐       ┌──────────────────┐
│     Module       │       │   ModuleDetail    │
│─────────────────│       │──────────────────│
│ id          PK  │──1:N─→│ id          PK   │
│ slug     UNIQUE │       │ moduleId     FK   │
│ title           │       │ slug              │
│ description     │       │ title             │
│ keywords        │       │ summary           │
│ status (enum)   │       │ keywords          │
│ sortOrder       │       │ sortOrder         │
│ createdAt       │       │ createdAt         │
│ updatedAt       │       │ updatedAt         │
└─────────────────┘       └────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────┴──────┐ ┌────┴───────┐
              │ComponentItem│ │ Attachment  │
              │────────────│ │────────────│
              │ id      PK │ │ id      PK │
              │ detailId FK│ │ detailId FK│
              │ category   │ │ type (enum)│
              │ name       │ │ title      │
              │ quantity   │ │ url        │
              │ unit       │ │ filePath   │
              │ note       │ │ mimeType   │
              │ sortOrder  │ │ sizeBytes  │
              └────────────┘ │ sortOrder  │
                             │ createdAt  │
                             └────────────┘

┌───────────────────┐
│     AuditLog       │
│───────────────────│
│ id            PK  │
│ action    (enum)  │
│ entityType (enum) │
│ entityId          │
│ entityLabel       │
│ actorId      FK?  │──N:1──→ Profile (SetNull)
│ actorEmail        │
│ actorName         │
│ payloadBefore Json│
│ payloadAfter Json │
│ createdAt         │
└───────────────────┘
```

### Enums

| Enum | Nilai |
|:-----|:------|
| `UserRole` | `ADMIN`, `VIEWER` |
| `PublishStatus` | `DRAFT`, `PUBLISHED` |
| `AttachmentType` | `IMAGE`, `SPREADSHEET`, `FILE`, `LINK` |
| `AuditAction` | `CREATE`, `UPDATE`, `DELETE` |
| `AuditEntityType` | `MODULE`, `MODULE_DETAIL`, `COMPONENT_ITEM`, `ATTACHMENT` |

### Cascade Delete

Menghapus `Module` akan **otomatis menghapus** semua `ModuleDetail`, `ComponentItem`, dan `Attachment` yang terkait.

### AuditLog Delete Behavior

`Profile → AuditLog` memakai **`onDelete: SetNull`** — jika profile dihapus, `actorId` menjadi `null` tapi record audit log **tetap ada** untuk keperluan forensik.

---

## 8. Sistem Autentikasi & Keamanan

### Arsitektur Auth

Aplikasi menggunakan **Cookie-based Session** (`h3-session`) murni dari engine Nitro/h3 bawaan Nuxt. Ini adalah keputusan arsitektur yang disengaja karena:

1. Aplikasi ini pada sementara waktu ini masih monolith SSR (frontend & backend satu proses).
2. Cookie `httpOnly` jauh lebih aman dari XSS dibanding JWT di `localStorage`.
3. Data role selalu dibaca real-time dari database (tidak pernah stale seperti JWT).
4. Tidak ada kebutuhan untuk API token / mobile app saat ini.

### Alur Login

```
Client                    Server
  │                         │
  │  POST /api/auth/login   │
  │  {email, password}      │
  │────────────────────────→│
  │                         │ 1. Rate limit check (IP + email)
  │                         │ 2. Cari profile by email (Prisma)
  │                         │ 3. Bandingkan password (bcryptjs)
  │                         │ 4. Set session cookie (h3-session)
  │  Set-Cookie: h3-session │
  │←────────────────────────│
  │                         │
  │  GET /api/auth/me       │
  │  (cookie otomatis)      │
  │────────────────────────→│
  │                         │ Baca userId dari session
  │                         │ Ambil profile dari DB
  │  {profile}              │
  │←────────────────────────│
```

### Properti Cookie Session

| Properti | Nilai |
|:---------|:------|
| `name` | `h3-session` |
| `httpOnly` | `true` |
| `sameSite` | `lax` |
| `secure` | `true` saat HTTPS |
| `maxAge` | 7 hari |
| `path` | `/` |

### Layer Keamanan

| Lapisan | Implementasi | File |
|:--------|:------------|:-----|
| Password Hashing | bcryptjs (cost factor 12) | `server/api/auth/login.post.ts` |
| Session Management | h3 `useSession()` | `server/utils/auth.ts` |
| Same-Origin Guard (Anti-CSRF) | Cek header `Origin`/`Referer` vs expected origin | `server/middleware/auth.ts` |
| Login Rate Limiter | In-memory, 8 attempt / 15 menit per IP+email | `server/utils/rateLimit.ts` |
| Upload Path Traversal Guard | Validasi path relatif | `server/utils/uploads.ts` |
| Production Secret Validation | Fail-fast jika `SESSION_SECRET` lemah/default | `server/utils/auth.ts` |
| Frontend Route Guard | Global middleware wajib login | `app/middleware/auth.global.ts` |
| Admin Route Guard | Middleware cek role `ADMIN` | `app/middleware/admin.ts` |

### Akses API per Role

| Endpoint | Viewer | Admin |
|:---------|:------:|:-----:|
| `GET /api/modules` | ✅ (hanya `PUBLISHED`) | ✅ (semua status) |
| `GET /api/modules/:id` | ✅ (hanya `PUBLISHED`) | ✅ (semua status) |
| `POST/PATCH/DELETE /api/modules` | ❌ | ✅ |
| `POST/PATCH/DELETE /api/details` | ❌ | ✅ |
| `POST/PATCH/DELETE /api/attachments` | ❌ | ✅ |
| `POST /api/uploads` | ❌ | ✅ |
| `GET /api/uploads/:path` | ✅ | ✅ |

---

## 9. State Management

State management mengikuti aturan ketat:

| Jenis Data | Disimpan di | Alasan |
|:-----------|:-----------|:-------|
| Data server yang sudah di-load/disimpan | **Pinia Store** | Single source of truth |
| Draft form yang belum disimpan | **Local `ref`/`reactive`** | Transient, tidak perlu shared |
| UI state kecil (search text, theme) | **`useState()`** | Lintas komponen, bukan data server |

### Store: `auth` (`app/stores/auth.ts`)
- State: `profile`, `pending`, `initialized`.
- Action: `login()`, `logout()`, `ensureProfile()`, `refreshProfile()`.
- Computed: `isAdmin`, `isAuthenticated`.

### Store: `auditLog` (`app/stores/auditLog.ts`)
- State: `items`, `loading`, `error`, `nextCursor`.
- Action: `applyFilters()`, `fetchPage()`, `resetState()`.

### Store: `auditRecent` (`app/stores/auditRecent.ts`)
- State: `items`, `loading`, `error`, `lastFetchedAt`, `refreshQueued`.
- Action: `fetchRecent()`, `refreshIfStale()`, `triggerBackgroundRefresh()`, `resetState()`.
- Dipakai oleh `AuditSidebarCard.vue` di sidebar admin.
- Stale-refresh logic: threshold 15 detik, coalescing request.

### Store: `learningModules` (`app/stores/learningModules.ts`)
- State: `modules`, `currentModule`, `pending`, `error`, `dirty`.
- Action: `fetchModules()`, `ensureModules()`, `fetchModuleBySlug()`, `invalidateModules()`.
- Mekanisme dirty-flag: setelah admin melakukan mutasi, store learner ditandai `dirty` dan akan refetch saat learner surface dibuka kembali.

### Store: `modules` (`app/stores/modules.ts`)
- State: `modules`, `currentModule`, `pendingList`, `pendingDetail`, `pendingMutation`.
- Action CRUD lengkap: `createModule()`, `updateModule()`, `deleteModule()`, `saveSection()`, `deleteSection()`, `addAttachment()`, `attachFiles()`, `deleteAttachment()`.

---

## 10. API Contracts

Kontrak API lengkap sudah didokumentasikan di `docs/API_CONTRACTS.md`. Berikut ringkasannya:

### Auth
| Method | Endpoint | Keterangan |
|:-------|:---------|:-----------|
| `POST` | `/api/auth/login` | Login (email + password) |
| `GET` | `/api/auth/me` | Ambil profil dari session |
| `POST` | `/api/auth/logout` | Logout (clear session) |

### Modules
| Method | Endpoint | Keterangan |
|:-------|:---------|:-----------|
| `GET` | `/api/modules` | List modul (query: `search`) |
| `POST` | `/api/modules` | Buat modul baru (admin) |
| `PATCH` | `/api/modules/bulk` | Bulk update status (admin) |
| `DELETE` | `/api/modules/bulk` | Bulk delete (admin) |
| `GET` | `/api/modules/:idOrSlug` | Detail modul |
| `PATCH` | `/api/modules/:id` | Update modul (admin) |
| `DELETE` | `/api/modules/:id` | Hapus modul (admin) |

### Details (Varian Produk)
| Method | Endpoint | Keterangan |
|:-------|:---------|:-----------|
| `POST` | `/api/modules/:id/details` | Tambah varian produk (admin) |
| `PATCH` | `/api/details/:detailId` | Update varian produk (admin) |
| `DELETE` | `/api/details/:detailId` | Hapus varian produk (admin) |

### Components & Attachments
| Method | Endpoint | Keterangan |
|:-------|:---------|:-----------|
| `POST` | `/api/details/:detailId/components` | Tambah komponen (admin) |
| `PATCH` | `/api/components/:componentId` | Update komponen (admin) |
| `DELETE` | `/api/components/:componentId` | Hapus komponen (admin) |
| `POST` | `/api/details/:detailId/attachments` | Tambah attachment (admin) |
| `PATCH` | `/api/attachments/:attachmentId` | Update attachment (admin) |
| `DELETE` | `/api/attachments/:attachmentId` | Hapus attachment (admin) |

### Uploads
| Method | Endpoint | Keterangan |
|:-------|:---------|:-----------|
| `POST` | `/api/uploads` | Upload file (admin, max 10MB) |
| `GET` | `/api/uploads/:path` | Serve file (wajib login) |

### Audit Logs
| Method | Endpoint | Keterangan |
|:-------|:---------|:-----------|
| `GET` | `/api/audit-logs` | List riwayat aktivitas (admin, cursor pagination) |

### Format Error

```json
{
  "statusMessage": "Pesan error umum",
  "fieldErrors": { "fieldName": "Pesan error per field" }
}
```

---

## 11. Testing

Framework: **Vitest** (konfigurasi: `npm test` → `vitest run --pool=threads`)

### Unit Test Files (19 file)

Semua test berada di `tests/unit/` kecuali `validation.test.ts` yang ada di `test/`.

| File | Menguji |
|:-----|:--------|
| `adminModuleUi.test.ts` | Helper UI admin module |
| `apiErrors.test.ts` | Parsing error API |
| `auditClient.test.ts` | Helper fetch, filter, pagination, stale-refresh audit log |
| `auditDisplay.test.ts` | Helper tampilan audit log |
| `auditLog.test.ts` | Pencatatan audit log ke database |
| `auditPagination.test.ts` | Pagination dan filter audit log |
| `authRefresh.test.ts` | Logika refresh autentikasi |
| `authRoutes.test.ts` | Routing dan redirect autentikasi |
| `bulkActions.test.ts` | BulkActionPill dan operasi massal |
| `csvImportLimits.test.ts` | Batas-batas CSV import |
| `csvUtils.test.ts` | Parser CSV dan fuzzy matching |
| `moduleBulkValidation.test.ts` | Validasi bulk operations |
| `rateLimit.test.ts` | Rate limiter behavior |
| `search.test.ts` | Fungsi pencarian lokal |
| `seedModules.test.ts` | Integritas data seed |
| `slug.test.ts` | Generator slug |
| `themePreference.test.ts` | Preferensi tema dark/light |
| `upload.test.ts` | Helper upload file |
| `validation.test.ts` | Validasi form (Zod) |

### Menjalankan Test

```bash
npm test
```

---

## 12. Panduan Setup & Development

### Requirements
- **Node.js**
- **PostgreSQL** (lokal atau remote)

### Langkah Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/gir4f/module_learning.git
   cd module_learning
   ```

2. **Buat file `.env`** dari template
   ```bash
   cp .env.example .env
   ```

3. **Isi environment variables** di `.env`
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
   DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
   SESSION_SECRET="change-this-to-a-random-64-char-string"
   UPLOAD_DIR="./uploads"
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Jalankan Prisma migration**
   ```bash
   npm run db:migrate
   ```

6. **Seed data awal**
   ```bash
   npm run db:seed
   ```

7. **Jalankan development server**
   ```bash
   npm run dev -- --host 127.0.0.1 --port 3000
   ```

### Command yang tersedia

| Perintah | Keterangan |
|:---------|:-----------|
| `npm run dev` | Development server |
| `npm run build` | Build production (custom script) |
| `npm run start` | Jalankan output production |
| `npm run type-check` | TypeScript type checking |
| `npm test` | Jalankan unit tests |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Buat/aplikasikan Prisma migration untuk development |
| `npm run db:seed` | Seed data awal ke database |
| `npm run audit:assets` | Audit asset yang tidak terpakai |
| `npm run optimize:assets` | Optimasi asset |

---

## 13. Panduan Deployment Production

### Environment Variables

| Key | Value | Keterangan |
|:----|:------|:-----------|
| `NODE_ENV` | `production` | Mode production |
| `HOST` | `0.0.0.0` | Bind ke semua interface |
| `PORT` | `3000` | Port server |
| `DATABASE_URL` | `postgresql://...` | URL koneksi database |
| `DIRECT_URL` | `postgresql://...` | URL direct (untuk migrasi) |
| `SESSION_SECRET` | `[random 48+ karakter]` | **Wajib kuat di production** |
| `UPLOAD_DIR` | `/var/data` atau `./uploads` | Folder penyimpanan file upload |

### Build & Start

```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma Client
npx prisma generate

# 3. Jalankan migrasi database
npx prisma migrate deploy

# 4. Build aplikasi
npm run build

# 5. Jalankan server
node .output/server/index.mjs
```

### Reverse Proxy (Nginx/SSL)

Jika di-deploy di belakang Nginx, pastikan header berikut di-forward:
- `Host`
- `X-Forwarded-Host`
- `X-Forwarded-Proto`

Ini agar Same-Origin Protection berfungsi dengan benar.

---

## 14. Akun Bawaan (Seed)

Script seed (`prisma/seed.ts`) membuat akun berikut:

| Role | Email | Password |
|:-----|:------|:---------|
| **ADMIN** | `admin@gitronik.co.id` | `admin123` |
| **VIEWER** | `viewer@gitronik.co.id` | `viewer123` |

> ⚠️ **PENTING**: Ganti password ini sebelum digunakan di production.

Untuk menjalankan seed di production:
```bash
npx prisma db seed
```

---

## 15. Keterbatasan & Catatan Teknis

### Keterbatasan sejauh ini

1. **Rate Limiter In-Memory**: Rate limiter login saat ini menyimpan data di memori proses. Jika aplikasi di-scale ke beberapa instance (horizontal scaling), rate limit tidak akan shared antar instance. Untuk scale-out, bisa menggunakan Redis atau layanan rate limit dedicated.

2. **Tidak Ada Fitur "Lupa Password"**: Saat ini belum ada mekanisme reset password. Jika user lupa password, admin harus mengubah `passwordHash` langsung di database.

3. **Prisma Migrations Menjadi Source of Truth Schema**: Folder `prisma/migrations` sudah ada di repository dan wajib ikut version control. Untuk perubahan schema, update `prisma/schema.prisma`, jalankan `npm run db:migrate` di development, lalu commit migration yang dihasilkan. Untuk production, gunakan `npx prisma migrate deploy`.

4. **Pencarian Server-Side Sederhana**: Pencarian modul di API menggunakan filter teks biasa (`LIKE`). Untuk volume data besar, bisa mempertimbangkan untuk integrasi full-text search PostgreSQL atau engine pencarian terpisah.

### Catatan Teknis Penting

5. **Vue Single-Root-Node pada Page Components**: Semua file `.vue` di `app/pages/` **wajib** memiliki **satu root element** di dalam `<template>`. Nuxt menggunakan `<Transition>` untuk animasi antar halaman, dan Vue's `<Transition>` tidak bisa menganimasikan komponen dengan multiple root nodes. Jika halaman membutuhkan beberapa elemen root-level (misalnya konten utama + modal), bungkus semuanya dalam satu `<div>` wrapper.

6. **Audit Log Belum Memiliki Retention Policy**: Data audit log saat ini tidak memiliki batas penyimpanan atau mekanisme pembersihan otomatis. Untuk penggunaan jangka panjang, pertimbangkan untuk menambahkan cron job atau retention policy yang menghapus log lama.

---

## 16. Rekomendasi Pengembangan Masa Depan

### 16.1 Integrasi Autentikasi

Saat ini autentikasi menggunakan Cookie-based Session (`h3-session`) yang **sangat aman dan optimal untuk arsitektur web SSR**. Namun, jika perusahaan berencana mengintegrasikan login dengan aplikasi lain (Mobile App Presensi/Gajian, Aplikasi Sortir Gudang), maka arsitektur autentikasi perlu dievolusikan:

**Opsi yang direkomendasikan:**

| Opsi | Kapan Digunakan | Kelebihan |
|:-----|:----------------|:----------|
| **Better Auth** (library Node.js) | Kalau masih ingin tetap self-hosted dan kode sendiri | Plugin system (2FA, Passkeys, Roles), integrasi Prisma native, dukungan API Token untuk mobile |


### 16.2 Fitur Tambahan yang Bisa Dipertimbangkan

- **Reset Password**: Implementasi fitur "Lupa Password".
- ~~**Audit Log**: Mencatat siapa yang mengubah/menghapus modul dan kapan.~~ ✅ Sudah diimplementasikan.
- **Audit Log Retention**: Pembersihan otomatis data audit log lama.
- **Versioning Modul**: Riwayat perubahan modul (undo/rollback).
- **Notifikasi**: Pemberitahuan saat modul baru dipublikasikan (mungkin bisa diimplementasikan bareng dengan PWA).
- **PWA**: Barangkali web modul ajar butuh offline mode dan native-like mobile.
- **Rich Editor Text**: Sekadar pertimbangan untuk editor text saat ini masih plain, hanya text saja tidak dengan formatting text yang lebih luas.
- **Pencarian Full-Text**: Implementasi PostgreSQL `tsvector` untuk pencarian yang lebih cepat dan akurat pada volume data besar.
- **Redis untuk Session & Rate Limit**: Jika di-scale ke multiple instance.

### 16.3 Upgrade & Maintenance Rutin

- Jalankan `npm audit` secara berkala untuk cek kerentanan dependency.
- Update Prisma schema dan jalankan `npx prisma migrate dev` untuk perubahan database.
- Jalankan `npm test` sebelum setiap deploy untuk memastikan tidak ada regresi.

---

## 17. Referensi Dokumentasi Existing

Dokumentasi teknis detail sudah tersedia di folder `docs/`:

| Dokumen | Isi |
|:--------|:----|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arsitektur sistem, runtime shape, dan batas-batas storage |
| [DB_SCHEMA.md](./docs/DB_SCHEMA.md) | Struktur tabel Prisma/PostgreSQL, enum, dan relasi |
| [API_CONTRACTS.md](./docs/API_CONTRACTS.md) | Kontrak API server route yang aktif |
| [AUTH_ACCESS.md](./docs/AUTH_ACCESS.md) | Autentikasi, session, role guard, same-origin, dan upload access |
| [STATE_MANAGEMENT.md](./docs/STATE_MANAGEMENT.md) | Pinia stores, local UI state, dan aturan source-of-truth |
| [README.md](./README.md) | Setup cepat, perintah, dan akun default |

---

> *Dokumen ini disusun sebagai serah terima (handoff) proyek Modul Ajar dari intern developer kepada tim pengembang selanjutnya di PT. Gitronik Dimindo Indonesia. Semua informasi di atas mencerminkan kondisi repository per tanggal 21 Mei 2026.*
