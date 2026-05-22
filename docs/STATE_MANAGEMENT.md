# State Management

## Summary

The repository currently uses this combination:

- `Pinia` for canonical data state
- local `ref/reactive` state for draft forms and UI interactions
- `useState()` for small cross-component or cross-layout UI state

Practical rules:

- server data that has already been loaded or saved -> Pinia
- drafts that have not been saved yet -> local form state
- small UI state such as search text, theme, or dialog visibility -> local state or `useState`

## Stores

### `auth`

File:

- `app/stores/auth.ts`

Responsibilities:

- login
- logout
- fetch or refresh the current profile
- `isAdmin`
- `isAuthenticated`

Used by:

- login page
- global route middleware
- admin middleware
- top navbar
- admin sidebar

### `learning-modules`

File:

- `app/stores/learningModules.ts`

Responsibilities:

- learner module list
- learner current module by slug
- list and detail pending/error state
- freshness invalidation between admin and learner surfaces

Used by:

- homepage `/`
- learner detail `/modules/:slug`
- desktop navbar search
- learner mobile drawer search

Current state fields:

- `modules`
- `currentModule`
- `pending`
- `pendingDetail`
- `error`
- `detailError`
- `loaded`
- `dirty`
- `detailDirtyKeys`

Primary actions:

- `fetchModules()`
- `ensureModules()`
- `invalidateModules()`
- `invalidateModule(...)`
- `fetchModuleBySlug(slug)`
- `ensureModuleBySlug(slug)`
- `replaceModule(...)`
- `upsertModule(...)`
- `setCurrentModule(...)`
- `clearCurrentModule()`

### `modules`

File:

- `app/stores/modules.ts`

Responsibilities:

- admin module list
- admin current module by id
- admin module CRUD
- save or delete details
- add or delete attachments
- file attachment upload flow

Used by:

- `/admin/modules`
- `/admin/modules/new`
- `/admin/modules/:id`
- desktop navbar search in admin mode
- mobile drawer search in admin mode

Current state fields:

- `modules`
- `currentModule`
- `pendingList`
- `pendingDetail`
- `pendingMutation`
- `listError`
- `detailError`

Primary actions:

- `fetchModules(search?)`
- `fetchModuleById(id)`
- `refreshCurrentModule()`
- `createModule(payload)`
- `updateModule(id, payload)`
- `deleteModule(id)`
- `saveSection(moduleId, detailId, payload)`
- `deleteSection(detailId)`
- `addAttachment(detailId, payload)`
- `attachFiles(detailId, files, sortStart)`
- `deleteAttachment(attachmentId)`

### `audit-log`

File:

- `app/stores/auditLog.ts`

Responsibilities:

- load the full admin audit log dataset used by `/admin/audit-logs`
- fetch every cursor page through `fetchAllAuditEntries(...)`
- expose a simple loading and error state for the page

Used by:

- `/admin/audit-logs`

Current state fields:

- `items`
- `loading`
- `error`

Primary actions:

- `fetchAll(limit?)`
- `resetState()`

Note:

- entity type, actor, and date filters are currently applied in the page component after the store fetch completes
- page pagination is also local UI pagination, not store-owned cursor state

### `audit-recent`

File:

- `app/stores/auditRecent.ts`

Responsibilities:

- recent audit log entries for the admin sidebar card
- stale-refresh logic through `shouldRefreshAuditRecent(...)`
- queued refresh behavior while a fetch is already in flight
- background refresh on admin navigation and window focus

Used by:

- `AuditSidebarCard.vue`

Current state fields:

- `items`
- `loading`
- `error`
- `lastFetchedAt`

Primary actions:

- `fetchRecent(limit)`
- `refreshIfStale(limit)`
- `triggerBackgroundRefresh(limit)`
- `resetState()`

## Local State That Still Exists

`useState()` is still reasonable for:

- `learning-module-local-search`
- `theme-preference`
- `theme-resolved`
- `theme-ready`

Local draft form state intentionally kept out of Pinia:

- `moduleForm` in the admin editor
- `sectionForms` in the admin editor
- command palette open/close state
- upload progress visuals

Reasons:

- this state is transient
- it does not need to become shared canonical source-of-truth state
- it is safer to keep it separate from fetched or saved server state
- theme handling uses the `useDarkMode()` composable with canonical preference (`system`, `light`, `dark`) and a separate resolved mode

## Current Search Flow

### Learner

- the homepage loads the module list into the `learning-modules` store
- filter, search, category, and sort are handled locally on the client
- desktop navbar search and mobile drawer search read from the same learner store
- the detail page fills `currentModule` through `fetchModuleBySlug`
- after an admin mutation, the learner store is marked `dirty`
- learner list, search, and detail revalidate on the next entry when dirty instead of refetching continuously

### Admin

- the admin list loads modules into the `modules` store
- the admin command palette searches locally on top of `modules`
- the admin editor loads `currentModule` by id
- save mutations in admin always resynchronize the store

## Source-of-Truth Rules

### Admin

- canonical saved module data -> `modules` store
- editor forms -> local drafts
- after save:
  - the store is refreshed or upserted
  - the local draft is reset from `currentModule`

### Learner

- canonical module list -> `learning-modules` store
- canonical open module -> `learning-modules.currentModule`
- homepage search text -> `useState('learning-module-local-search')`
- admin mutations do not directly copy objects into the learner store; the learner side still refetches from the learner endpoint

## Anti-Patterns to Avoid

Going forward, avoid slipping back into these patterns:

- page components calling Axios directly for module CRUD even though the store already owns the actions
- list views using Pinia while detail or editor views use unsynchronized local state
- admin or learner search creating a second fetch path that can drift from the main store
- moving entire form drafts into Pinia without a strong reason
