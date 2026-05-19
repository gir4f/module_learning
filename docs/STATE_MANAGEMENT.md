# State Management

## Summary

Repo saat ini memakai kombinasi:

- `Pinia` untuk canonical data state
- local `ref/reactive` untuk draft form dan UI interactions
- `useState()` untuk UI state kecil lintas komponen/layout

Rule praktisnya:

- server data yang sudah di-load atau sudah disimpan -> Pinia
- draft yang belum disimpan -> local form state
- state UI kecil seperti search text, theme, dialog visibility -> local state atau `useState`

## Stores

### `auth`

File:

- `app/stores/auth.ts`

Tanggung jawab:

- login
- logout
- fetch/refresh current profile
- `isAdmin`
- `isAuthenticated`

Dipakai oleh:

- login page
- global route middleware
- admin middleware
- top navbar
- admin sidebar

### `learning-modules`

File:

- `app/stores/learningModules.ts`

Tanggung jawab:

- learner module list
- learner current module by slug
- pending/error untuk list dan detail
- freshness invalidation antara surface admin dan learner

Dipakai oleh:

- homepage `/`
- learner detail `/modules/:slug`
- desktop navbar search
- mobile drawer search untuk learner mode

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

Action utama:

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

Tanggung jawab:

- admin module list
- admin current module by id
- admin CRUD module
- save/delete detail
- add/delete attachment
- upload file attachment flow

Dipakai oleh:

- `/admin/modules`
- `/admin/modules/new`
- `/admin/modules/:id`
- desktop navbar search saat mode admin
- mobile drawer search saat mode admin

Current state fields:

- `modules`
- `currentModule`
- `pendingList`
- `pendingDetail`
- `pendingMutation`
- `listError`
- `detailError`

Action utama:

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

## Local State That Still Exists

`useState()` yang memang masih wajar dipakai:

- `learning-module-local-search`
- `dark-mode`

Local draft form state yang sengaja tidak dimasukkan Pinia:

- `moduleForm` di admin editor
- `sectionForms` di admin editor
- command palette open/close state
- upload progress visual

Alasan:

- state ini bersifat transient
- tidak perlu menjadi shared canonical source of truth
- lebih aman dipisah dari fetched/saved server state

## Current Search Flow

### Learner

- homepage memuat list modul ke store `learning-modules`
- filter/search/category/sort dijalankan lokal di client
- navbar learner search dan mobile drawer search membaca store yang sama
- detail page mengisi `currentModule` lewat `fetchModuleBySlug`
- setelah ada mutasi admin, learner store ditandai `dirty`
- learner list/search/detail akan revalidate pada entry berikutnya bila dirty, bukan fetch terus-menerus

### Admin

- admin list memuat list modul ke store `modules`
- command palette admin mencari lokal di atas `modules`
- admin editor memuat `currentModule` by id
- save mutation di admin selalu kembali menyinkronkan store

## Source-of-Truth Rules

### Admin

- canonical saved module data -> store `modules`
- editor forms -> local draft
- setelah save:
  - store di-refresh atau di-upsert
  - local draft di-reset dari `currentModule`

### Learner

- canonical module list -> store `learning-modules`
- canonical opened module -> `learning-modules.currentModule`
- search text homepage -> `useState('learning-module-local-search')`
- admin mutation tidak langsung menyalin object ke learner store; learner tetap refetch dari endpoint learner sendiri

## Anti-Patterns to Avoid

Ke depan, hindari balik ke pola berikut:

- page langsung memanggil Axios untuk module CRUD padahal store sudah punya action-nya
- list pakai Pinia tapi detail/editor pakai state lokal yang tidak sinkron
- search admin/learner punya jalur fetch kedua yang bisa stale terhadap store utama
- memasukkan seluruh form draft ke Pinia tanpa alasan kuat
