# Database Schema

## Summary

The current database schema is defined in [`prisma/schema.prisma`](../prisma/schema.prisma), with schema history tracked through [`prisma/migrations`](../prisma/migrations).

Provider:

- `PostgreSQL`

ORM:

- `Prisma`

## Migration Workflow

The database is migration-backed.

- `prisma/schema.prisma` is the desired model definition.
- `prisma/migrations` is the schema history and must be committed to version control.
- For development, run `npm run db:migrate` so new migrations are created and applied.
- For production or deployment, run `npx prisma migrate deploy` so only committed migrations are applied.
- Do not edit `prisma/migrations/migration_lock.toml` manually.

## Main Tables

### `Profile`

Stores login accounts for the application.

Primary fields:

- `id` `String` primary key
- `email` `String` unique
- `fullName` `String?`
- `passwordHash` `String?`
- `role` `UserRole`
- `createdAt`
- `updatedAt`

Notes:

- current roles: `ADMIN`, `VIEWER`
- local login uses `email + passwordHash`

### `Module`

Top-level learning module entity.

Primary fields:

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

Product variant or section inside a module.

Primary fields:

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

Important constraint:

- `@@unique([moduleId, slug])`

### `ComponentItem`

Component or material row for a module detail.

Primary fields:

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

File or link attachment for a module detail.

Primary fields:

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

Records admin activity history (`create`, `update`, `delete`).

Primary fields:

- `id` `String` primary key
- `action` `AuditAction`
- `entityType` `AuditEntityType`
- `entityId` `String` (`@db.VarChar(50)`)
- `entityLabel` `String` (`@db.VarChar(200)`)
- `actorId` `String?` (FK to `Profile`)
- `actorEmail` `String` (`@db.VarChar(254)`)
- `actorName` `String?` (`@db.VarChar(200)`)
- `payloadBefore` `Json?` - entity snapshot before the change
- `payloadAfter` `Json?` - entity snapshot after the change
- `createdAt`

Relation:

- `actor -> Profile?` (`onDelete: SetNull` so audit logs remain after profile deletion)

Indexes:

- `@@index([createdAt(sort: Desc)])` - used for newest-first cursor pagination
- `@@index([entityType, entityId])` - used for per-entity filtering

Notes:

- `payloadBefore` and `payloadAfter` are stored in the database but are intentionally not exposed by the current `GET /api/audit-logs` API response. They are reserved for internal forensic needs.

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

Cascade delete currently applies to:

- `Module -> ModuleDetail`
- `ModuleDetail -> ComponentItem`
- `ModuleDetail -> Attachment`

That means deleting a module also deletes its related details, components, and attachment records.

Special case for `AuditLog`:

- `Profile -> AuditLog` uses `onDelete: SetNull`, so if a profile is deleted, `actorId` becomes `null` while the audit log record remains.

## Seed Reality

The default seed currently creates:

- admin account `admin@gitronik.co.id`
- viewer account `viewer@gitronik.co.id`
- module data from `app/data/seedModules`

If credentials or seed data change, the source of truth remains [`prisma/seed.ts`](../prisma/seed.ts).
