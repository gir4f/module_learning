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

## Uploads

Set `UPLOAD_DIR` in `.env`. Uploaded files are saved to that directory and served from `/api/uploads/...`.

Keep `uploads/` out of git.
