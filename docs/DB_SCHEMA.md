# Database Schema

## Summary

Schema database saat ini didefinisikan di [prisma/schema.prisma](</C:/Users/pppercivalll/Documents/Kuliah/Materi Kuliah/SEM 6/Project KP/module_learning/prisma/schema.prisma>), dengan histori perubahan schema dikelola lewat [prisma/migrations](</C:/Users/pppercivalll/Documents/Kuliah/Materi Kuliah/SEM 6/Project KP/module_learning/prisma/migrations>).

Provider:

- `PostgreSQL`

ORM:

- `Prisma`

## Migration Workflow

Database sekarang bersifat migration-backed.

- `prisma/schema.prisma` adalah definisi model yang diinginkan.
- `prisma/migrations` adalah histori perubahan schema yang harus ikut version control.
- Untuk development, jalankan `npm run db:migrate` agar migration baru dibuat dan diterapkan.
- Untuk production/deploy, jalankan `npx prisma migrate deploy` agar hanya migration yang sudah committed yang diterapkan.
- Jangan edit `prisma/migrations/migration_lock.toml` secara manual.

## Main Tables

### `Profile`

Menyimpan akun login aplikasi.

Fields utama:

- `id` `String` primary key
- `email` `String` unique
- `fullName` `String?`
- `passwordHash` `String?`
- `role` `UserRole`
- `createdAt`
- `updatedAt`

Notes:

- role saat ini: `ADMIN`, `VIEWER`
- login lokal memakai `email + passwordHash`

### `Module`

Entitas modul ajar utama.

Fields utama:

- `id` `String` primary key
- `slug` `String` unique
- `title` `String`
- `description` `String?`
- `keywords` `String?`
- `status` `PublishStatus`
- `sortOrder` `Int`
- `createdAt`
- `updatedAt`

Relation:

- `details -> ModuleDetail[]`

### `ModuleDetail`

Varian produk/section di dalam satu modul.

Fields utama:

- `id` `String` primary key
- `moduleId` `String`
- `slug` `String`
- `title` `String`
- `summary` `String?`
- `keywords` `String?`
- `sortOrder` `Int`
- `createdAt`
- `updatedAt`

Relations:

- `module -> Module`
- `components -> ComponentItem[]`
- `attachments -> Attachment[]`

Constraint penting:

- `@@unique([moduleId, slug])`

### `ComponentItem`

Baris komponen/material untuk satu varian produk.

Fields utama:

- `id` `String` primary key
- `detailId` `String`
- `category` `String?`
- `name` `String`
- `quantity` `String`
- `unit` `String`
- `note` `String?`
- `sortOrder` `Int`

Relation:

- `detail -> ModuleDetail`

### `Attachment`

Lampiran file atau link untuk satu varian produk.

Fields utama:

- `id` `String` primary key
- `detailId` `String`
- `type` `AttachmentType`
- `title` `String`
- `url` `String`
- `filePath` `String?`
- `mimeType` `String?`
- `sizeBytes` `Int?`
- `sortOrder` `Int`
- `createdAt`
Relation:

- `detail -> ModuleDetail`

### `AuditLog`

Mencatat riwayat aktivitas admin (create, update, delete).

Fields utama:

- `id` `String` primary key
- `action` `AuditAction`
- `entityType` `AuditEntityType`
- `entityId` `String` (`@db.VarChar(50)`)
- `entityLabel` `String` (`@db.VarChar(200)`)
- `actorId` `String?` (FK ke `Profile`)
- `actorEmail` `String` (`@db.VarChar(254)`)
- `actorName` `String?` (`@db.VarChar(200)`)
- `payloadBefore` `Json?` — snapshot entity sebelum perubahan
- `payloadAfter` `Json?` — snapshot entity sesudah perubahan
- `createdAt`

Relation:

- `actor -> Profile?` (onDelete: **SetNull** — audit log tetap ada jika profile dihapus)

Indexes:

- `@@index([createdAt(sort: Desc)])` — untuk pagination cursor (terbaru duluan)
- `@@index([entityType, entityId])` — untuk filter per entity

Notes:

- `payloadBefore`/`payloadAfter` disimpan di database tetapi sengaja **tidak di-expose** di API response GET `/api/audit-logs` saat ini — hanya untuk keperluan forensik internal.

## Enums

### `UserRole`

- `ADMIN`
- `VIEWER`

### `PublishStatus`

- `DRAFT`
- `PUBLISHED`

### `AttachmentType`

- `IMAGE`
- `SPREADSHEET`
- `FILE`
- `LINK`

### `AuditAction`

- `CREATE`
- `UPDATE`
- `DELETE`

### `AuditEntityType`

- `MODULE`
- `MODULE_DETAIL`
- `COMPONENT_ITEM`
- `ATTACHMENT`

## Relationship Map

```text
Profile
  1 -> many AuditLog (onDelete: SetNull)

Module
  1 -> many ModuleDetail

ModuleDetail
  many -> 1 Module
  1 -> many ComponentItem
  1 -> many Attachment

ComponentItem
  many -> 1 ModuleDetail

Attachment
  many -> 1 ModuleDetail

AuditLog
  many -> 1 Profile? (actorId, nullable)
```

## Delete Behavior

Cascade delete saat ini berlaku untuk:

- `Module -> ModuleDetail`
- `ModuleDetail -> ComponentItem`
- `ModuleDetail -> Attachment`

Artinya ketika modul dihapus, section, komponen, dan attachment record ikut terhapus.

Khusus `AuditLog`:

- `Profile -> AuditLog` memakai **`onDelete: SetNull`** — jika profile dihapus, `actorId` menjadi `null` tapi record audit log **tetap ada**.

## Seed Reality

Seed default saat ini membuat:

- akun admin `admin@gitronik.co.id`
- akun viewer `viewer@gitronik.co.id`
- module data dari `app/data/seedModules`

Kalau credential/seed berubah, source of truth-nya tetap file [prisma/seed.ts].
