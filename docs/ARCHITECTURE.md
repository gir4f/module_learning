# Architecture

This document captures the intended architecture for the shared internal learning module application.

## Goal

Create a simple shared learning module system for an internal team. Admins manage modules, product details, component tables, and attachments. Learners browse document-style module pages.

The application should be maintainable and data-driven, while avoiding unnecessary LMS complexity.

## Target Stack

| Area | Technology |
| --- | --- |
| App framework | Nuxt full-stack |
| UI framework | Vue 3 |
| Language | TypeScript |
| Layout styling | Tailwind CSS |
| Admin components | PrimeVue |
| Icons | PrimeIcons |
| Client state | Pinia |
| API layer | Nuxt server routes |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | Supabase Auth |
| File storage | Supabase Storage |
| Unit/component tests | Vitest |
| E2E tests | Playwright, optional |

## Request Flow

```txt
Nuxt pages/components
        |
Pinia stores/composables
        |
Nuxt server routes
        |
Prisma
        |
PostgreSQL
```

File upload flow:

```txt
Nuxt UI
        |
Supabase Storage upload
        |
Nuxt server route saves metadata
        |
Prisma
        |
PostgreSQL
```

## Main Domains

### Module

Top-level learning module, such as Device Speed, ISCS, PIDS, Alarm, or Kabel Body.

Important fields:

- `id`
- `slug`
- `title`
- `description`
- `keywords`
- `status`
- `sortOrder`
- `createdAt`
- `updatedAt`

### Module Detail

A document section or product detail inside a module.

Important fields:

- `id`
- `moduleId`
- `slug`
- `title`
- `summary`
- `keywords`
- `sortOrder`
- `createdAt`
- `updatedAt`

### Component Item

A row in a module detail's component/parts table.

Important fields:

- `id`
- `detailId`
- `category`
- `name`
- `quantity`
- `unit`
- `note`
- `sortOrder`

### Attachment

An image, spreadsheet, file, or external reference link attached to a detail.

Important fields:

- `id`
- `detailId`
- `type`
- `title`
- `url`
- `storagePath`
- `mimeType`
- `sizeBytes`
- `sortOrder`
- `createdAt`

## Roles

Start with two roles:

- `admin`: create, update, delete, publish, upload attachments.
- `viewer`: read published modules.

Authentication should use Supabase Auth. Authorization should be checked in Nuxt server routes before Prisma mutations.

## Pages

Recommended pages:

- `/` learner module dashboard
- `/modules/[slug]` learner document page
- `/admin/modules` admin module list and CRUD
- `/admin/modules/[id]` admin module editor

The admin routes require authentication and admin role. Learner routes can require login for internal-only use.

## Components

Use PrimeVue for admin workflows:

- data tables
- dialogs
- confirmations
- toasts
- file upload
- selects and form controls

Use Tailwind for:

- page layout
- responsive document view
- learner typography
- wrappers around PrimeVue components

Recommended component groups:

```txt
components/
  admin/
  attachments/
  layout/
  learning/
  shared/
```

## Migration From Current App

The current app stores static module information in JavaScript files and hardcoded Vue templates. Migration should happen in small steps:

1. Extract module/detail/component content into structured seed data.
2. Build a generic document renderer for modules.
3. Replace hardcoded slug-specific template sections.
4. Add Prisma schema and seed script.
5. Move CRUD to Nuxt server routes.
6. Add Supabase Auth and Storage.

## Non-Goals For Now

- Multi-tenant organization support
- Complex LMS progress tracking
- Quiz engine
- Course enrollment workflows
- Realtime collaboration
- Public marketplace or public authoring

