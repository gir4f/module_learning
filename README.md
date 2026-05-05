# Modul Ajar

Internal learning module app for PT. Gitronik Dimindo Indonesia.

The app is now a Nuxt full-stack CRUD module:

- Learner pages use Nuxt, Vue 3, and Tailwind CSS.
- Admin CRUD uses PrimeVue.
- API routes live in Nuxt server routes.
- Prisma connects to Supabase Postgres.
- Supabase Auth handles login and roles.
- Supabase Storage stores uploaded module assets.

## Setup

Create `.env` from `.env.example` and fill in the real Supabase values:

```env
DATABASE_URL="postgresql://..."
NUXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NUXT_PUBLIC_SUPABASE_KEY="sb_publishable_or_anon_key"
NUXT_PUBLIC_MODULE_ASSETS_BUCKET="module-assets"
SUPABASE_SERVICE_ROLE_KEY=""
```

`SUPABASE_SERVICE_ROLE_KEY` is optional unless the signed upload API is used.

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
npm.cmd test
npx.cmd nuxi typecheck
npx.cmd nuxi build
```

## Admin Bootstrap

The first authenticated Supabase user becomes `ADMIN` if no admin profile exists. Later users default to `VIEWER`.

Promote a user manually in Supabase SQL if needed:

```sql
update "Profile"
set role = 'ADMIN'
where email = 'person@example.com';
```
