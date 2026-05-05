# Implementation Plan

This plan is intentionally simple and incremental.

## Phase 1: Stabilize Current Content

- Inventory current module pages and assets.
- Extract existing module/detail/component data into structured seed data.
- Keep current Vite app working while data structures are introduced.
- Optimize very large images before production deployment.

## Phase 2: Move To Data-Driven Rendering

- Create reusable learner document components.
- Render modules from data instead of hardcoded slug branches.
- Preserve current learner behavior and search.
- Add empty states for modules with no components or attachments.

## Phase 3: Introduce Full-Stack Nuxt

- Create Nuxt project structure.
- Add Tailwind CSS.
- Add PrimeVue and PrimeIcons.
- Add Pinia.
- Move learner pages and shared components into Nuxt.

## Phase 4: Add Prisma And PostgreSQL

- Define Prisma schema.
- Add database migrations.
- Add seed script for current learning content.
- Add Nuxt server routes for module CRUD.
- Keep Prisma usage server-only.

## Phase 5: Add Admin CRUD

- Build admin module list with PrimeVue DataTable.
- Build create/edit dialogs or dedicated editor page.
- Add detail editor.
- Add component table editor.
- Add attachment editor.
- Add ConfirmDialog and Toast.

## Phase 6: Add Supabase Auth And Storage

- Add Supabase Auth login.
- Create `admin` and `viewer` roles.
- Protect admin routes.
- Upload files to Supabase Storage.
- Save attachment metadata through the API.

## Phase 7: Test And Deploy

- Add Vitest tests for utilities, validation, and API handlers.
- Add component tests for admin forms.
- Optionally add Playwright tests for full CRUD flow.
- Deploy frontend/server to the selected Nuxt-compatible host.
- Configure environment variables for database and Supabase.

## Minimum Done Criteria

- Internal users can log in.
- Viewers can read published learning modules.
- Admins can CRUD modules, details, component rows, and attachments.
- Content is rendered from database/seed data.
- No new hardcoded module branches are introduced.
- Type-check and build pass.

