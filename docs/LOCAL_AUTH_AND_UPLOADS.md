# Local Auth And Uploads

The app uses PostgreSQL profiles plus h3 sessions for auth.

## Default Admin

Run:

```sh
npm.cmd run db:seed
```

The seed creates:

- `admin@gitronik.co.id`
- `admin123`

Change this password before non-local use.

## Session Secret

Set `SESSION_SECRET` to a strong random value before production use:

```sh
openssl rand -base64 48
```

Production auth requests fail fast if `SESSION_SECRET` is missing, too short, or still using a known placeholder.

## Uploads

Set `UPLOAD_DIR` in `.env`. Uploaded files are saved to that directory and served from `/api/uploads/...`.

Keep `uploads/` out of git.

The canonical upload API is `/api/uploads`. Legacy `/api/files/*` routes are intentionally not supported.
