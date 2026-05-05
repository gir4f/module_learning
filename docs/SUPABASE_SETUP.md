# Supabase Setup

## Required Environment Variables

The app can render seed fallback data without a database, but real shared CRUD requires these values:

```env
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

The public Supabase URL/key are already represented in `.env.example`.

## Admin Bootstrap

When `DATABASE_URL` is configured, the first authenticated Supabase user that hits the app becomes `ADMIN` automatically if no admin profile exists yet. Later users default to `VIEWER`.

Admins can also be promoted manually in SQL:

```sql
update "Profile"
set role = 'ADMIN'
where email = 'person@example.com';
```

## Storage Bucket

The expected bucket is:

```txt
module-assets
```

It is a public bucket for object delivery. The migration keeps authenticated upload/update/delete policies for internal users and intentionally avoids a broad public object-listing policy.

## Database Access

Nuxt server routes use Prisma, so browser code never receives database credentials and never calls Prisma directly. Public tables have RLS enabled as a defense-in-depth baseline; direct client access has no table policies because the app's read/write contract goes through `/server/api`.
