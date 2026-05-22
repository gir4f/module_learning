# Modul Ajar

Internal learning module CMS for PT. Gitronik Dimindo Indonesia.

- Learner pages use Nuxt, Vue, TypeScript, and Tailwind CSS.
- Admin CRUD uses simple full-page editors with PrimeVue controls where useful.
- API routes live in Nuxt server routes.
- Prisma connects to PostgreSQL, with schema changes tracked through `prisma/migrations`.
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
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev -- --host 127.0.0.1 --port 3000
```

Verification:

```sh
npm.cmd run type-check
npm.cmd run build
npm.cmd test
```

| Command | Description |
|:--------|:------------|
| `npm run dev` | Development server (Nuxt) |
| `npm run build` | Production build - custom wrapper, see [Scripts](#scripts) |
| `npm run start` | Run the production output (`node .output/server/index.mjs`) |
| `npm run type-check` | TypeScript type checking |
| `npm test` | Run unit tests (Vitest) |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply Prisma migrations for development |
| `npm run db:seed` | Seed initial data into the database |
| `npm run audit:assets` | Audit image assets larger than 1MB - see [Scripts](#scripts) |
| `npm run optimize:assets` | Optimize specific images - see [Scripts](#scripts) |

## Database Migrations

The database schema is managed through Prisma migrations.

- The source model lives in `prisma/schema.prisma`.
- Schema history lives in `prisma/migrations` and must be committed to version control.
- For development, use `npm run db:migrate` after changing the schema or when bootstrapping a new database.
- For production, use `npx prisma migrate deploy`, not `migrate dev`.
- `DIRECT_URL` is required because Prisma uses a direct connection for schema changes.

## Scripts

The three scripts in `scripts/` are custom Node.js scripts:

### `npm run build` -> `scripts/build.mjs`

A wrapper around `nuxt build` that filters noisy sourcemap warnings from the `@tailwindcss/vite` plugin. Tailwind CSS v4 emits many `Sourcemap is likely to be incorrect` warnings that are harmless but clutter terminal output. This script:

- Spawns `nuxt build` as a child process
- Pipes stdout/stderr through a line-by-line filter
- Suppresses lines containing Tailwind sourcemap warnings
- Forwards exit codes and signals correctly

### `npm run audit:assets` -> `scripts/audit-assets.mjs`

Audits images in `public/module-assets/`. It walks the directory, finds all image files (`avif`, `gif`, `jpeg`, `jpg`, `png`, `webp`), reports their sizes, and exits with code 1 if any file is larger than 1MB. This is useful as a CI check before deployment.

### `npm run optimize:assets` -> `scripts/optimize-assets.mjs`

Optimizes specific images in `public/module-assets/` using Sharp. It resizes them to a maximum of `1600x1600` and compresses them (JPEG `mozjpeg` quality 78 / PNG palette). Note: the file list is hard-coded (4 specific files) - this is a one-time script, not a generic optimizer.

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
# or directly:
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
- [docs/HANDOFF.md](./docs/HANDOFF.md) - handoff document for further development
