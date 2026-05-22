# Auth and Access

## Summary

The app uses `h3-session` cookies with `ADMIN` and `VIEWER` roles. All frontend surfaces currently require login, while role differences determine redirect targets and admin-only access.

Primary auth and access components:

- `server/utils/auth.ts`
- `server/middleware/auth.ts`
- `app/stores/auth.ts`
- `app/middleware/auth.global.ts`
- `app/middleware/admin.ts`

## Session Behavior

Current session cookie settings:

- name: `h3-session`
- `httpOnly: true`
- `sameSite: 'lax'`
- `secure: true` only when the request is treated as HTTPS
- `path: '/'`
- `maxAge: 7 days`

Production guards:

- `SESSION_SECRET` must be a strong random value
- the default or development placeholder secret causes `500` in production

## Login Flow

- `POST /api/auth/login`
  - finds a profile by email
  - verifies `passwordHash` with `bcryptjs`
  - stores `userId` in the session
- `GET /api/auth/me`
  - reads the profile from the session
- `POST /api/auth/logout`
  - clears the session

Client auth state is managed by the `auth` store:

- `profile`
- `pending`
- `initialized`
- `isAdmin`
- `isAuthenticated`

## Route Access

### Frontend Routes

- `/login`
  - public
  - redirects logged-in `ADMIN` users to `/admin/modules`
  - redirects logged-in `VIEWER` users to `/`
  - strips all login query params except `redirect`
- `/admin` and `/admin/**`
  - the global frontend middleware requires login
  - `admin.ts` also requires `role === 'ADMIN'`
- `/`
  - requires `VIEWER` or `ADMIN` login
- `/modules/:slug`
  - requires `VIEWER` or `ADMIN` login

## API Access

### Read Access

Current read-route behavior:

- `GET /api/modules`
  - public
  - anonymous and non-admin callers only receive `PUBLISHED` modules
  - logged-in admins can also see drafts
- `GET /api/modules/:idOrSlug`
  - public
  - anonymous and non-admin callers only receive `PUBLISHED` modules
  - logged-in admins can also see drafts
- `GET /api/uploads/:path`
  - requires `VIEWER` or `ADMIN` login

### Admin-Only Mutations

The module editor and upload mutation routes require admin access:

- `POST /api/modules`
- `PATCH /api/modules/:id`
- `DELETE /api/modules/:id`
- `PATCH /api/modules/bulk`
- `DELETE /api/modules/bulk`
- `POST /api/modules/:id/details`
- `PATCH /api/details/:detailId`
- `DELETE /api/details/:detailId`
- `POST /api/details/:detailId/attachments`
- `POST /api/details/:detailId/components`
- `PATCH /api/components/:componentId`
- `DELETE /api/components/:componentId`
- `PATCH /api/attachments/:attachmentId`
- `DELETE /api/attachments/:attachmentId`
- `POST /api/uploads`

## Same-Origin Protection

`server/middleware/auth.ts` blocks cross-origin mutating API requests.

Rules:

- applies to `POST`, `PUT`, `PATCH`, and `DELETE`
- expected origin is computed from:
  - `X-Forwarded-Proto`
  - `X-Forwarded-Host`
  - or the request URL directly
- actual origin is read from:
  - `Origin`
  - fallback `Referer`
- mismatched origin returns `403`
- if origin is missing:
  - development still allows the request
  - production rejects it with `403`

For all routes except `/api/auth/*`, mutating API requests also require a valid session profile.

## Login Security Notes

- the login rate limit is currently in-memory
- the rate-limit key is based on `IP + email`
- default limit:
  - `8` attempts
  - `15` minutes

This is sufficient for a single-instance internal deployment, but it is not suitable as a shared distributed limiter.

## Upload Access Notes

- creating uploaded files is admin-only
- serving uploaded files requires `VIEWER` or `ADMIN` login
- upload paths are protected by a traversal guard
- image uploads can produce `.preview.webp`

## Current Reality Notes

This document intentionally records the current repository state rather than earlier project assumptions.

Important points:

- learner pages are now internal-login only
- learner read APIs remain public but still enforce role-aware module visibility
- admin mutations are protected by an admin session plus the same-origin guard
- the client auth store is the source of truth for auth state
