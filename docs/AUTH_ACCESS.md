# Auth and Access

## Summary

Aplikasi memakai session cookie berbasis `h3-session` dan role `ADMIN` / `VIEWER`.

Komponen utama auth/access:

- `server/utils/auth.ts`
- `server/middleware/auth.ts`
- `app/stores/auth.ts`
- `app/middleware/auth.global.ts`
- `app/middleware/admin.ts`

## Session Behavior

Cookie session saat ini:

- name: `h3-session`
- `httpOnly: true`
- `sameSite: 'lax'`
- `secure: true` hanya saat request dianggap HTTPS
- `path: '/'`
- `maxAge: 7 hari`

Production guard:

- `SESSION_SECRET` wajib random kuat
- default/dev placeholder secret akan menyebabkan `500` di production

## Login Flow

- `POST /api/auth/login`
  - cari profile by email
  - cek `passwordHash` dengan `bcryptjs`
  - set session `userId`
- `GET /api/auth/me`
  - baca profile dari session
- `POST /api/auth/logout`
  - clear session

Client auth state dikelola store `auth`:

- `profile`
- `pending`
- `initialized`
- `isAdmin`
- `isAuthenticated`

## Route Access

### Frontend Routes

- `/login`
  - public
  - kalau user sudah login, redirect ke `/admin`
  - query login selain `redirect` akan dibersihkan
- `/admin` dan `/admin/**`
  - frontend middleware menuntut user login
  - middleware `admin.ts` juga menuntut `role === 'ADMIN'`
- `/`
  - public
- `/modules/:slug`
  - public

## API Access

### Public Read

Saat ini route berikut bisa diakses tanpa login:

- `GET /api/modules`
- `GET /api/modules/:idOrSlug`
- `GET /api/uploads/:path`

Behavior untuk read modules:

- anonymous / non-admin hanya menerima modul `PUBLISHED`
- admin yang login dapat melihat draft juga

### Admin-Only Mutations

Mutating route modul/editor mewajibkan admin:

- `POST /api/modules`
- `PATCH /api/modules/:id`
- `DELETE /api/modules/:id`
- `POST /api/modules/:id/details`
- `PATCH /api/details/:detailId`
- `DELETE /api/details/:detailId`
- `POST /api/details/:detailId/attachments`
- `PATCH /api/attachments/:attachmentId`
- `DELETE /api/attachments/:attachmentId`
- `POST /api/uploads`

## Same-Origin Protection

`server/middleware/auth.ts` memblokir mutating API request lintas origin.

Rules:

- berlaku untuk `POST`, `PUT`, `PATCH`, `DELETE`
- expected origin dihitung dari:
  - `X-Forwarded-Proto`
  - `X-Forwarded-Host`
  - atau request URL langsung
- actual origin dibaca dari:
  - `Origin`
  - fallback `Referer`
- kalau origin beda -> `403`
- kalau origin tidak ada:
  - development masih diizinkan
  - production ditolak `403`

Selain route `/api/auth/*`, mutating API juga menuntut request punya session profile yang valid.

## Login Security Notes

- login rate limit saat ini masih in-memory
- key rate limit berbasis `IP + email`
- default limit:
  - `8` attempt
  - `15` menit

Ini cukup untuk single-instance/internal deployment, tapi belum cocok sebagai shared distributed limiter.

## Upload Access Notes

- create upload file -> admin only
- serve upload file -> public-by-URL saat ini
- upload path punya traversal guard
- image upload bisa punya `preview.webp`

Kalau nanti aplikasi benar-benar ingin full internal-only file access, `GET /api/uploads/:path` perlu diproteksi lagi. Saat ini belum.

## Current Reality Notes

Dokumen ini sengaja merekam kondisi repo sekarang, bukan aspirasi fase sebelumnya.

Yang penting:

- learner pages dan learner APIs saat ini masih public-read
- admin mutations sudah dilindungi session admin + same-origin guard
- auth store di client sudah menjadi source of truth auth state
