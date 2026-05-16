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
node .output/server/index.mjs
```

For PM2, restart with `--update-env` after changing environment variables:

```sh
pm2 restart modul-ajar --update-env
```

Behind Nginx/SSL, forward `Host`, `X-Forwarded-Host`, and `X-Forwarded-Proto` so same-origin API protection keeps working.

## Admin Bootstrap

The seed script creates a default admin account:

- Email: `admin@gitronik.co.id`
- Password: `admin123`

Change this password before using the app outside local development.

## Demo Smoke Checklist

- Login with the seeded admin account.
- Refresh `/admin/modules`, `/admin/modules/new`, and an editor page; the session should stay active.
- Create a module, edit its information, add a section, edit component rows, add a link, upload a file, then delete the test data.
- Open `/`, search/filter modules, then open `/modules/device-speed`.
- Check dark/light mode and mobile widths around 320px and 768px.
