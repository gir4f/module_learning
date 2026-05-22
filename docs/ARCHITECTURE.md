# Architecture

## Summary

`module_learning` is a Nuxt full-stack application for PT. Gitronik Dimindo Indonesia's internal learning modules.

Primary stack:

- `Nuxt 4` + `Vue 3` + `TypeScript`
- `Tailwind CSS` + `PrimeVue`
- `Nitro/h3` server routes in `server/api`
- `Prisma` + `PostgreSQL`
- `Pinia` as the source of truth for module and auth state on the client
- Local file storage for uploads under `UPLOAD_DIR`

## Main Runtime Shape

- Learner surface:
  - `/` shows the module catalog
  - `/modules/:slug` shows module details
  - Learner data is managed by the `learning-modules` store
  - Learner routes require `VIEWER` or `ADMIN` login
- Admin surface:
  - `/admin/modules` shows the module list
  - `/admin/modules/new` creates a new module
  - `/admin/modules/:id` opens the module editor
  - `/admin/audit-logs` shows admin activity history
  - Admin data is managed by the `modules`, `audit-log`, and `audit-recent` stores
  - Admin routes require `ADMIN`
- Auth surface:
  - `/login`
  - Session cookies are managed by `h3-session`

## Data Model

Current Prisma entities:

- `Profile`
  - `email`, `passwordHash`, `role`
- `Module`
  - `slug`, `title`, `description`, `keywords`, `status`, `sortOrder`
- `ModuleDetail`
  - child of `Module`
  - `slug`, `title`, `summary`, `keywords`, `sortOrder`
- `ComponentItem`
  - child of `ModuleDetail`
  - `category`, `name`, `quantity`, `unit`, `note`, `sortOrder`
- `Attachment`
  - child of `ModuleDetail`
  - `type`, `title`, `url`, `filePath`, `mimeType`, `sizeBytes`, `sortOrder`

The `Module -> ModuleDetail -> ComponentItem/Attachment` chain uses cascade delete.

## Frontend State Boundaries

State is currently split like this:

- `app/stores/auth.ts`
  - user profile, login, logout, profile refresh
- `app/stores/learningModules.ts`
  - learner module list
  - learner current module by slug
  - learner list/detail pending and error state
  - dirty-flag invalidation after admin mutations
- `app/stores/modules.ts`
  - admin module list
  - admin current module by id
  - admin CRUD for modules, sections, and attachments
- `app/stores/auditLog.ts`
  - full admin audit log collection for `/admin/audit-logs`
  - fetches every cursor page from the API, then the page applies filters and local pagination
- `app/stores/auditRecent.ts`
  - recent audit log entries for the admin sidebar card
  - stale-refresh logic with a 15 second threshold
  - background refresh on admin navigation and window focus

`useState()` is still used for small UI-only state, for example:

- `learning-module-local-search`
- `theme-preference`
- `theme-resolved`
- `theme-ready`

Current rules:

- Canonical fetched or saved module data lives in Pinia
- Temporary form drafts, input text, and open/close UI state live in local refs or `useState`
- Theme preference is bootstrapped early through a head script, then synchronized on the client through the `useDarkMode()` composable

## Server Boundaries

- `server/api/modules`
  - read the module list and module details
  - create, update, and delete modules
- `server/api/details`
  - update and delete details
  - add attachments or components to a detail
- `server/api/attachments`
  - update and delete attachments
- `server/api/uploads`
  - upload new files
  - serve uploaded files
- `server/api/auth`
  - login, logout, and current-session profile
- `server/api/audit-logs`
  - list admin activity history with cursor pagination

All server routes run in the same Nuxt/Nitro process. There is no separate backend service.

## Current Access Shape

- Learner pages are currently internal-login only
- Frontend route protection is handled by `app/middleware/auth.global.ts`
- `GET /api/modules` and `GET /api/modules/:idOrSlug` are still public, but role-aware:
  - anonymous and non-admin callers only receive `PUBLISHED` modules
  - logged-in admins can also see drafts
- Admin pages require an admin session
- Mutating API routes require both an admin session and a same-origin request
- File uploads:
  - `POST /api/uploads` is admin-only
  - `GET /api/uploads/...` requires `VIEWER` or `ADMIN` login

## Storage

- Database: PostgreSQL
  - schema changes are managed through Prisma migrations in `prisma/migrations`
- Upload files: local filesystem under `UPLOAD_DIR`
- Image previews:
  - image uploads can generate `.preview.webp`
- Session:
  - `h3-session` cookie
  - session state is stored through `useSession`

## Known Implementation Notes

- Module read APIs send `Cache-Control: no-store`, so the client does not rely on HTTP caching for admin consistency.
- Admin-to-learner consistency is handled at the Pinia level: admin mutations invalidate the learner store, and learner pages revalidate the next time the learner surface is opened.
- The module list uses a compact payload, while module detail uses the full payload from `moduleInclude`.
- `server/utils/cache.ts` still exists, but it is not the primary consistency mechanism for client state.
- Database changes must go through `prisma/schema.prisma` plus Prisma migrations, and the generated migration files must be committed.

## Vue Page Component Rules

- Every `.vue` file in `app/pages/` must have exactly one root element inside `<template>`. Nuxt uses `<Transition>` for page transitions, and Vue's `<Transition>` does not support multiple root nodes. If a page needs extra elements such as a modal, wrap everything in a single `<div>`.
