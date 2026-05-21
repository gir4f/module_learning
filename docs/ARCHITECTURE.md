# Architecture

## Summary

`module_learning` adalah aplikasi Nuxt full-stack untuk modul ajar internal PT. Gitronik Dimindo Indonesia.

Stack utama:

- `Nuxt 4` + `Vue 3` + `TypeScript`
- `Tailwind CSS` + `PrimeVue`
- `Nitro/h3` server routes di `server/api`
- `Prisma` + `PostgreSQL`
- `Pinia` untuk source of truth state modul dan auth di client
- local file storage untuk upload di bawah `UPLOAD_DIR`

## Main Runtime Shape

- Learner surface:
  - `/` menampilkan katalog modul
  - `/modules/:slug` menampilkan detail modul
  - reader data dikelola oleh store `learning-modules`
  - route learner membutuhkan login `VIEWER` atau `ADMIN`
- Admin surface:
  - `/admin/modules` untuk list modul
  - `/admin/modules/new` untuk create modul
  - `/admin/modules/:id` untuk editor modul
  - `/admin/audit-logs` untuk riwayat aktivitas admin
  - admin data dikelola oleh store `modules` dan `auditLog`
  - route admin hanya untuk `ADMIN`
- Auth surface:
  - `/login`
  - session cookie dikelola oleh `h3-session`

## Data Model

Prisma schema saat ini:

- `Profile`
  - `email`, `passwordHash`, `role`
- `Module`
  - `slug`, `title`, `description`, `keywords`, `status`, `sortOrder`
- `ModuleDetail`
  - child dari `Module`
  - `slug`, `title`, `summary`, `keywords`, `sortOrder`
- `ComponentItem`
  - child dari `ModuleDetail`
  - `category`, `name`, `quantity`, `unit`, `note`, `sortOrder`
- `Attachment`
  - child dari `ModuleDetail`
  - `type`, `title`, `url`, `filePath`, `mimeType`, `sizeBytes`, `sortOrder`

Relasi `Module -> ModuleDetail -> ComponentItem/Attachment` memakai cascade delete.

## Frontend State Boundaries

State dibagi seperti ini:

- `app/stores/auth.ts`
  - profile user, login, logout, refresh profile
- `app/stores/learningModules.ts`
  - learner module list
  - learner current module by slug
  - pending/error learner list dan detail
  - dirty-flag invalidation untuk menjaga konsistensi setelah mutasi admin
- `app/stores/modules.ts`
  - admin module list
  - admin current module by id
  - admin CRUD modul, section, dan attachment
- `app/stores/auditLog.ts`
  - admin audit log list dengan cursor pagination
  - filter berdasarkan entity type dan actor
- `app/stores/auditRecent.ts`
  - recent audit log entries untuk admin sidebar card
  - stale-refresh logic (15 detik threshold)
  - background refresh saat navigasi admin dan window focus

`useState()` masih dipakai untuk UI-only state kecil, misalnya:

- `learning-module-local-search`
- `theme-preference`
- `theme-resolved`
- `theme-ready`

Rule yang dipakai sekarang:

- canonical fetched/saved module data -> Pinia
- temporary form draft / input text / open-close UI -> local refs atau `useState`
- theme dibootstrap lebih awal lewat head script, lalu state tombol/theme disinkronkan di client lewat `useDarkMode()` composable

## Server Boundaries

- `server/api/modules`
  - read module list dan detail
  - create/update/delete modul
- `server/api/details`
  - update/delete detail
  - add attachment/component ke detail tertentu
- `server/api/attachments`
  - update/delete attachment
- `server/api/uploads`
  - upload file baru
  - serve file yang sudah diupload
- `server/api/auth`
  - login/logout/me
- `server/api/audit-logs`
  - list riwayat aktivitas admin (cursor pagination)

Semua server route berjalan di Nuxt/Nitro process yang sama; tidak ada backend service terpisah.

## Current Access Shape

- learner pages saat ini bersifat internal-login
- learner `GET /api/modules` dan `GET /api/modules/:id-or-slug`
  - viewer mendapat modul `PUBLISHED`
  - admin yang sedang login dapat melihat draft juga
- admin pages membutuhkan session admin
- mutating API membutuhkan admin + same-origin request
- upload file:
  - `POST /api/uploads` admin only
  - `GET /api/uploads/...` butuh login (`VIEWER` atau `ADMIN`)

## Storage

- database: PostgreSQL
- upload file: filesystem lokal di `UPLOAD_DIR`
- preview image:
  - image upload dapat menghasilkan `.preview.webp`
- session:
  - cookie `h3-session`
  - state session tersimpan lewat `useSession`

## Known Implementation Notes

- Read API modul mengirim `Cache-Control: no-store`, jadi client tidak mengandalkan cache HTTP untuk konsistensi admin.
- Konsistensi admin -> learner dijaga di level Pinia: mutasi admin meng-invalidasi learner store, lalu learner revalidate saat surface-nya dibuka lagi.
- List modul memakai payload ringkas, sedangkan detail modul memakai payload lengkap dari `moduleInclude`.
- `server/utils/cache.ts` masih ada, tetapi saat ini bukan mekanisme utama konsistensi client state.

## Vue Page Component Rules

- Semua file `.vue` di `app/pages/` **wajib** memiliki satu root element di `<template>`. Nuxt menggunakan `<Transition>` untuk animasi antar halaman, dan Vue's `<Transition>` tidak mendukung multiple root nodes. Jika perlu menampilkan elemen tambahan (misal modal), bungkus dalam satu `<div>` wrapper.
