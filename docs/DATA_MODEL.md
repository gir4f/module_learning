# Data Model

This is the recommended first-pass data model for the shared learning module system.

## Prisma Model Sketch

```prisma
model Profile {
  id        String   @id
  email     String   @unique
  fullName  String?
  role      UserRole @default(VIEWER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Module {
  id          String         @id @default(cuid())
  slug        String         @unique
  title       String
  description String?
  keywords    String?
  status      PublishStatus  @default(DRAFT)
  sortOrder   Int            @default(0)
  details     ModuleDetail[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ModuleDetail {
  id          String          @id @default(cuid())
  moduleId    String
  slug        String
  title       String
  summary     String?
  keywords    String?
  sortOrder   Int             @default(0)
  module      Module          @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  components  ComponentItem[]
  attachments Attachment[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@unique([moduleId, slug])
}

model ComponentItem {
  id        String       @id @default(cuid())
  detailId  String
  category  String?
  name      String
  quantity  String
  unit      String
  note      String?
  sortOrder Int          @default(0)
  detail    ModuleDetail @relation(fields: [detailId], references: [id], onDelete: Cascade)
}

model Attachment {
  id          String         @id @default(cuid())
  detailId    String
  type        AttachmentType
  title       String
  url         String
  storagePath String?
  mimeType    String?
  sizeBytes   Int?
  sortOrder   Int            @default(0)
  detail      ModuleDetail   @relation(fields: [detailId], references: [id], onDelete: Cascade)
  createdAt   DateTime       @default(now())
}

enum UserRole {
  ADMIN
  VIEWER
}

enum PublishStatus {
  DRAFT
  PUBLISHED
}

enum AttachmentType {
  IMAGE
  SPREADSHEET
  FILE
  LINK
}
```

## Validation Rules

- Module title is required.
- Module slug must be unique.
- Detail title is required.
- Detail slug must be unique inside its parent module.
- Component rows require `name`, `quantity`, and `unit`.
- Attachment title and URL are required.
- Uploaded files must use allowed MIME types.
- Images should have size limits and be stored in Supabase Storage, not directly in PostgreSQL.

## Seed Data

Existing module content should be migrated into seed data. Keep seed scripts idempotent so they can run repeatedly in development.

Recommended seed order:

1. Modules
2. Details
3. Component items
4. Attachments with static asset URLs or storage paths

## Search

Search should be derived from:

- module title
- module keywords
- detail title
- detail keywords
- component names
- attachment titles

Avoid manually maintaining a separate search table unless search becomes slow.

