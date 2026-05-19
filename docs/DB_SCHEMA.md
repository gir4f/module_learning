# Database Schema

## Summary

Schema database saat ini didefinisikan di [prisma/schema.prisma](</C:/Users/pppercivalll/Documents/Kuliah/Materi Kuliah/SEM 6/Project KP/module_learning/prisma/schema.prisma>).

Provider:

- `PostgreSQL`

ORM:

- `Prisma`

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

## Relationship Map

```text
Profile

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
```

## Delete Behavior

Cascade delete saat ini berlaku untuk:

- `Module -> ModuleDetail`
- `ModuleDetail -> ComponentItem`
- `ModuleDetail -> Attachment`

Artinya ketika modul dihapus, section, komponen, dan attachment record ikut terhapus.

## Seed Reality

Seed default saat ini membuat:

- akun admin `admin@gitronik.co.id`
- akun viewer `viewer@gitronik.co.id`
- module data dari `app/data/seedModules`

Kalau credential/seed berubah, source of truth-nya tetap file [prisma/seed.ts].
