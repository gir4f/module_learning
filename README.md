# Modul Ajar

Internal learning module CMS for PT. Gitronik Dimindo Indonesia.

- Learner pages use Nuxt, Vue, TypeScript, and Tailwind CSS.
- Admin CRUD uses simple full-page editors with PrimeVue controls where useful.
- API routes live in Nuxt server routes.
- Prisma connects to PostgreSQL.
- Login uses bcryptjs password hashes stored on `Profile` plus h3 sessions.
- Uploaded files are stored under `UPLOAD_DIR` and served by `/api/uploads/...`.

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

## Admin Bootstrap

The seed script creates a default admin account:

- Email: `admin@gitronik.co.id`
- Password: `admin123`

Change this password before using the app outside local development.