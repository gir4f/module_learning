# AGENTS.md

Guidance for AI coding tools working in this repository.

## Project Context

This project is a Nuxt 3 full-stack learning module application for PT. Gitronik Dimindo Indonesia. Treat it as a content management system for internal learning modules, with admin CRUD and clean document-style learner pages.

Target stack:

- Nuxt 3 full-stack app
- Vue 3 + TypeScript
- Tailwind CSS + PrimeVue + PrimeIcons
- Pinia for client-side state
- Prisma ORM
- PostgreSQL database
- bcryptjs password hashing with h3 session auth
- Local disk uploads served through Nuxt server routes
- Vitest for unit/component tests
- Playwright optionally for end-to-end CRUD flows

## Product Direction

Build this as a data-driven learning module CMS, not as hardcoded module pages.

The learner experience should remain document-style:

- searchable module dashboard
- long-form module documents
- section navigation for long modules
- component/parts tables
- images, spreadsheets, and reference attachments

The admin experience should support simple CRUD for:

- modules
- module details/sections
- component rows
- attachments

Avoid quiz, progress tracking, multi-tenant organization logic, or complex analytics unless explicitly requested.

## Architecture Rules

- Keep product/module knowledge in structured data and database models, not directly in Vue templates.
- Do not add new `v-if="slug === '...'"` branches for module content.
- Use route-level pages only for screen composition.
- Put reusable UI in components.
- Put shared data types in `app/types`.
- Put persistence behind repositories/server routes.
- Never access Prisma from browser/client code.
- Use Nuxt server routes for database operations.
- Use h3 sessions for auth.
- Store uploaded files on local disk, serve them via Nuxt server routes, and store only metadata and URLs in PostgreSQL.

Recommended data ownership:

- `Module` owns high-level learning module metadata.
- `ModuleDetail` owns each document section/product detail inside a module.
- `ComponentItem` belongs to a module detail.
- `Attachment` belongs to a module detail.
- Search data should be derived from module/detail/component fields plus optional keywords.

## UI Guidance

- Use Tailwind CSS for layout, spacing, learner documents, responsive grids, and custom wrappers.
- Use PrimeVue sparingly for buttons, inputs, textareas, selects, toasts, and confirmation dialogs.
- Keep admin CRUD simple and human; prefer full-page editors over nested drawers.
- Use inline editing for component tables where practical.
- Keep forms semantic and accessible.
- Use confirmation dialogs for destructive actions.
- Show validation errors close to the related fields.
- Keep learner pages clean and readable; avoid making them look like an admin dashboard.

## Current Repo Notes

- Nuxt source lives under `app/`.
- Server routes live under `server/api`.
- Shared learning types live in `app/types/learning.ts`.
- Seed data lives in `app/data/seedModules.ts` and `prisma/seed.ts`.
- Legacy Vite files have been removed.
- Existing package-lock changes may be user-owned; do not revert them unless asked.
- Ignore `node_modules` during analysis.

## Verification

Use Windows-friendly commands:

```sh
npm.cmd run type-check
npm.cmd run build
```

Use `npm.cmd test` for unit tests when changing utilities, validation, or data behavior.
