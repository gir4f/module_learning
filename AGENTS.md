# AGENTS.md

Guidance for AI coding tools working in this repository.

## Project Context

This project is currently a Vue 3 + Vite learning module prototype. The intended direction is a shared internal learning module application with admin CRUD, document-style learner pages, and a simple full-stack architecture.

Target stack:

- Nuxt full-stack app
- Vue 3 + TypeScript
- Tailwind CSS for layout and learner pages
- PrimeVue + PrimeIcons for admin CRUD components
- Pinia for client-side state
- Prisma ORM
- PostgreSQL database
- Supabase Auth for internal team login
- Supabase Storage for uploaded module assets
- Nuxt server routes as the API layer
- Vitest for unit/component tests
- Playwright optionally for end-to-end CRUD flows

## Product Direction

Build this as a content management system for learning modules, not as hardcoded module pages.

The learner experience should remain document-style:

- searchable module dashboard
- long-form module documents
- section navigation for long modules
- component/parts tables
- images, spreadsheets, and reference attachments

The admin experience should support CRUD for:

- modules
- module details/sections
- component rows
- attachments

Avoid adding quiz, progress tracking, multi-tenant organization logic, or complex analytics unless explicitly requested.

## Architecture Rules

- Keep product/module knowledge in structured data and database models, not directly in Vue templates.
- Do not add new `v-if="slug === '...'"` branches for module content.
- Use route-level pages only for screen composition.
- Put reusable UI in components.
- Put shared data types in a central types/schema area.
- Put persistence behind repositories/server routes.
- Never access Prisma from browser/client code.
- Use Nuxt server routes for database operations.
- Use Supabase Auth for identity and role checks.
- Use Supabase Storage for uploaded files; store only metadata and URLs in PostgreSQL.

Recommended data ownership:

- `Module` owns high-level learning module metadata.
- `ModuleDetail` owns each document section/product detail inside a module.
- `ComponentItem` belongs to a module detail.
- `Attachment` belongs to a module detail.
- Search data should be derived from module/detail/component fields plus optional keywords.

## UI Guidance

- Use PrimeVue for admin CRUD: `DataTable`, `Dialog`, `ConfirmDialog`, `Toast`, `Button`, `InputText`, `Textarea`, `Select`, `FileUpload`, `Toolbar`, `Tag`.
- Use Tailwind CSS for page layout, spacing, learner documents, responsive grids, and custom wrappers.
- Keep forms semantic and accessible.
- Use confirmation dialogs for destructive actions.
- Show validation errors close to the related fields.
- Keep the learner pages clean and readable; avoid making them look like an admin dashboard.

## Current Repo Notes

- Existing source is under `src/`.
- Current static module data is in `src/data/modules.js`.
- Current local CRUD helpers are in `src/data/products.js` and `src/data/moduleAttachments.js`.
- Current large hardcoded pages are `src/modules/ModuleDetail.vue` and `src/modules/ProductCrud.vue`.
- Existing package-lock changes may be user-owned; do not revert them unless asked.
- Ignore `node_modules` during analysis.

## Verification

For the current Vite project, use:

```sh
npm.cmd run type-check
npm.cmd run build-only
```

PowerShell may block `npm.ps1`, so prefer `npm.cmd` on Windows.

The combined `npm.cmd run build` can fail on this machine because `run-p` may hit `spawn EPERM`; split type-check and build-only when needed.

## Implementation Priorities

1. Document and preserve current content.
2. Define the shared data model.
3. Migrate hardcoded module content into seed data or database seed scripts.
4. Introduce reusable document-rendering components.
5. Build admin CRUD with PrimeVue.
6. Add Nuxt server routes and Prisma persistence.
7. Add Supabase Auth and Storage.
8. Add tests for CRUD, validation, and rendering.

