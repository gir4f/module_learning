# Implementation Plan

The migration target is now in place. Use this as the forward plan for future work.

## Current Baseline

- Nuxt 3 app structure under `app/` and `server/`
- Data-driven learner dashboard and document pages
- Prisma schema for modules, details, components, attachments, and profiles
- h3 session login backed by bcryptjs password hashes
- Local file uploads through `/api/uploads`
- Simple admin module list, create page, and full-page editor

## Next Priorities

1. Harden validation and error messages around full-page admin forms.
2. Add focused Vitest coverage for auth, uploads, validation, and editor payload shaping.
3. Add Playwright coverage for login, module creation, section editing, component rows, and uploads.
4. Replace the default seeded admin password before any non-local deployment.
5. Add deployment-specific upload persistence if the hosting environment has ephemeral disk.

## Done Criteria

- Internal users can log in with email and password.
- Viewers can read published learning modules.
- Admins can CRUD modules, details, component rows, and attachments.
- Content is rendered from database/seed data.
- No hardcoded module-content branches are introduced.
- `npm.cmd run type-check` and `npm.cmd run build` pass.
