# Architecture

This app is a simple internal learning module CMS. Admins manage modules, sections, component tables, and attachments. Learners browse published modules as readable documents.

## Stack

| Area | Technology |
| --- | --- |
| App framework | Nuxt 3 full-stack |
| UI | Vue 3 + TypeScript |
| Styling | Tailwind CSS |
| Admin controls | PrimeVue, used sparingly |
| Icons | PrimeIcons |
| State | Pinia |
| API layer | Nuxt server routes |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | bcryptjs + h3 sessions |
| File storage | Local disk uploads served by Nuxt routes |
| Tests | Vitest, Playwright optional |

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

Upload flow:

```txt
Admin upload form
        |
POST /api/uploads
        |
local UPLOAD_DIR
        |
attachment metadata in PostgreSQL
```

## Domains

- `Profile`: login identity, role, and password hash.
- `Module`: high-level module metadata.
- `ModuleDetail`: document section inside a module.
- `ComponentItem`: row in a section component table.
- `Attachment`: image, spreadsheet, file, or external link metadata.

## Auth

Server routes use h3 sessions. Admin-only mutations call `requireAdmin(event)`. Learner reads may return only published modules for viewers.

## Pages

- `/` learner module dashboard
- `/modules/[slug]` learner document page
- `/login` email/password login
- `/admin/modules` simple module list
- `/admin/modules/new` module creation form
- `/admin/modules/[id]` full-page module editor

## Non-Goals

- Multi-tenant organization support
- LMS progress tracking
- Quiz engine
- Course enrollment workflows
- Realtime collaboration
- Public marketplace or public authoring
