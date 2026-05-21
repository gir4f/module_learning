# Modul Ajar

Internal learning module CMS for PT. Gitronik Dimindo Indonesia.

- Learner pages use Nuxt, Vue, TypeScript, and Tailwind CSS.
- Admin CRUD uses simple full-page editors with PrimeVue controls where useful.
- API routes live in Nuxt server routes.
- Prisma connects to PostgreSQL.
- Login uses bcryptjs password hashes stored on `Profile` plus h3 sessions for `ADMIN` and `VIEWER`.
- Uploaded files are stored under `UPLOAD_DIR` and served by authenticated `/api/uploads/...` routes.

## Setup

Create `.env` from `.env.example`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SESSION_SECRET="change-this-to-a-random-64-char-string"
UPLOAD_DIR="./uploads"
```

## Commands

Use `npm.cmd` on Windows PowerShell:

```sh
npm.cmd install
npx.cmd prisma generate
npm.cmd run db:seed
npm.cmd run dev -- --host 127.0.0.1 --port 3000
```

Verification:

```sh
npm.cmd run type-check
npm.cmd run build
npm.cmd test
```

| Perintah | Keterangan |
|:---------|:-----------|
| `npm run dev` | Development server (Nuxt) |
| `npm run build` | Build production — custom wrapper, lihat [Scripts](#scripts) |
| `npm run start` | Jalankan output production (`node .output/server/index.mjs`) |
| `npm run type-check` | TypeScript type checking |
| `npm test` | Jalankan unit tests (Vitest) |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Jalankan Prisma migrations |
| `npm run db:seed` | Seed data awal ke database |
| `npm run audit:assets` | Audit image assets >1MB — lihat [Scripts](#scripts) |
| `npm run optimize:assets` | Optimasi image spesifik — lihat [Scripts](#scripts) |

## Scripts

Ketiga script di `scripts/` adalah custom Node.js scripts:

### `npm run build` → `scripts/build.mjs`

Wrapper untuk `nuxt build` yang memfilter noise warning sourcemap dari plugin `@tailwindcss/vite`. Tailwind CSS v4 menghasilkan banyak peringatan `Sourcemap is likely to be incorrect` yang tidak berbahaya tapi mengganggu output terminal. Script ini:

- Spawn `nuxt build` sebagai child process
- Pipe stdout/stderr melalui filter baris demi baris
- Suppress baris yang mengandung peringatan sourcemap Tailwind
- Forward exit code dan signal dengan benar

### `npm run audit:assets` → `scripts/audit-assets.mjs`

Audit image di `public/module-assets/`. Walk direktori, temukan semua file image (avif, gif, jpeg, jpg, png, webp), laporkan ukurannya, dan exit code 1 jika ada yang >1MB. Cocok untuk CI check sebelum deploy.

### `npm run optimize:assets` → `scripts/optimize-assets.mjs`

Optimasi gambar tertentu di `public/module-assets/` menggunakan Sharp. Resize ke max 1600×1600px dan compress (JPEG mozjpeg quality 78 / PNG palette). **Catatan**: daftar file di-hardcode (4 file spesifik) — ini one-time script, bukan optimizer generik.

## Production Deploy

Required environment:

```env
NODE_ENV="production"
HOST="0.0.0.0"
PORT="3000"
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SESSION_SECRET="<random 48+ byte secret>"
UPLOAD_DIR="/absolute/path/to/persistent/uploads"
```

Before serving traffic:

```sh
npx prisma generate
npx prisma migrate deploy
npm run build
```

Start the Nuxt server from the generated output:

```sh
npm run start
# atau langsung:
node .output/server/index.mjs
```

For PM2, restart with `--update-env` after changing environment variables:

```sh
pm2 restart modul-ajar --update-env
```

Behind Nginx/SSL, forward `Host`, `X-Forwarded-Host`, and `X-Forwarded-Proto` so same-origin API protection keeps working.

## Bootstrap Accounts

The seed script creates default local accounts:

- Admin
  - Email: `admin@gitronik.co.id`
  - Password: `admin123`
- Viewer
  - Email: `viewer@gitronik.co.id`
  - Password: `viewer123`

Change these passwords before using the app outside local development.

## Docs

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - high-level system shape, runtime flow, and storage boundaries
- [docs/DB_SCHEMA.md](./docs/DB_SCHEMA.md) - Prisma/PostgreSQL table structure, enums, and relations
- [docs/API_CONTRACTS.md](./docs/API_CONTRACTS.md) - current server route contracts used by the app
- [docs/AUTH_ACCESS.md](./docs/AUTH_ACCESS.md) - auth, session, role guard, same-origin rules, and upload access
- [docs/STATE_MANAGEMENT.md](./docs/STATE_MANAGEMENT.md) - Pinia stores, local UI state, and source-of-truth rules
