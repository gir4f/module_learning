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

## Migration Roadmap

The project is planned for a 3-phase stack upgrade. Execute phases sequentially; do not proceed to the next phase if the current phase has build errors.

### Phase 1: Nuxt 3 → Nuxt 4 (Low Risk)

The project structure already uses the `app/` directory convention (`srcDir: 'app'`), so structural migration is minimal.

Steps:

1. Run `npx nuxt upgrade --dedupe` to upgrade Nuxt to v4.
2. Remove `compatibilityDate`, `srcDir: 'app'`, and `serverDir: 'server'` from `nuxt.config.ts` (these are Nuxt 4 defaults).
3. Audit all `useFetch` / `useAsyncData` calls — `data.value` defaults to `undefined` instead of `null` in Nuxt 4. Change any `=== null` checks to `== null` or `!data.value`.
4. Verify `definePageMeta` middleware references still resolve.
5. Run `npm.cmd run build` and fix any errors.

### Phase 2: Tailwind CSS v3 → v4 (Medium Risk)

Tailwind v4 replaces JS config with CSS-first configuration and uses the Oxide (Rust) engine.

Steps:

1. Replace dependencies:
   ```sh
   npm uninstall @nuxtjs/tailwindcss
   npm install tailwindcss@latest @tailwindcss/vite@latest tailwindcss-primeui@latest
   ```
2. Remove `@nuxtjs/tailwindcss` from `modules` in `nuxt.config.ts`. Add Tailwind as a Vite plugin:
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   export default defineNuxtConfig({
     vite: { plugins: [tailwindcss()] },
   })
   ```
3. Delete `tailwind.config.ts`. Migrate all custom tokens to `@theme` in `app/assets/css/main.css`.
4. Replace the top of `main.css`:
   ```css
   @import "tailwindcss";
   @plugin "tailwindcss-primeui";

   @theme {
     --font-sans: "Inter", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
     --color-brand-navy: #1d4f80;
     --color-brand-navy-light: #e7f1fb;
     --color-brand-teal: #10b7c5;
     --color-brand-teal-50: #ecfeff;
     --color-brand-teal-dark: #078996;
     --color-brand-ink: #26323f;
     --color-brand-dark-navy: #8dc6ff;
     --color-brand-dark-teal: #48dce6;
     --color-brand-dark-ink: #e5edf5;
     --color-category-device: #10b7c5;
     --color-category-cable: #f59e0b;
     --color-category-accessory: #64748b;
     --color-category-sop: #ef4444;
     --animate-fade-up: fade-up 420ms ease-out both;
     --animate-shimmer: shimmer 1.6s linear infinite;
   }
   ```
5. Update PrimeVue theme config with CSS layer ordering:
   ```typescript
   cssLayer: {
     name: 'primevue',
     order: 'base, primevue, theme, components, utilities',
   }
   ```
6. Run `npx @tailwindcss/upgrade` to auto-migrate deprecated utility classes in `.vue` files.
7. Run `npm.cmd run build` and fix any errors.

### Phase 3: Vue 3.5 Feature Adoption (Very Low Risk)

Vue 3.5 is already installed via Nuxt. This phase adopts new APIs for cleaner code:

- **Reactive Props Destructure**: Replace `const props = defineProps<{...}>()` + `props.xxx` with `const { xxx } = defineProps<{...}>()` in components like `ComponentTable`, `DocumentHeader`, `SectionNav`, `AttachmentList`.
- **`useTemplateRef()`**: Replace `const el = ref<HTMLElement | null>(null)` with `const el = useTemplateRef<HTMLElement>('el')` in `ImageLightbox.vue`.
- **`useId()`**: Use for SSR-safe unique IDs where applicable.

### Migration Safety Rules

- Commit after each phase so you can revert independently.
- Do NOT modify Prisma schema, seed data, or server API routes during migration.
- Do NOT add new dependencies beyond what is specified.
- Preserve ALL existing custom CSS (dark mode overrides, PrimeVue styles, print styles, animations).
- If `npx @tailwindcss/upgrade` fails, migrate utility classes manually.
