# Data Model

The Prisma schema is the source of truth. The main ownership model is:

- `Profile`: user identity, role, and optional `passwordHash`.
- `Module`: top-level learning module.
- `ModuleDetail`: document section inside a module.
- `ComponentItem`: component/parts row belonging to a detail.
- `Attachment`: link or uploaded-file metadata belonging to a detail.

## Attachment Fields

Uploaded files are stored on disk, not in PostgreSQL. Attachments store:

- `url`: public route such as `/api/uploads/file-name.pdf`, or an external link.
- `filePath`: local path under `UPLOAD_DIR` for uploaded files.
- `mimeType`
- `sizeBytes`

## Validation Rules

- Module title is required.
- Module slug must be unique.
- Detail title is required.
- Detail slug must be unique inside its parent module.
- Component rows require `name`, `quantity`, and `unit`.
- Attachment title and URL are required.
- Uploaded files must use allowed MIME types.

## Seed Data

Seed scripts should stay idempotent. Recommended order:

1. Default admin profile
2. Modules
3. Details
4. Component items
5. Attachments

## Search

Search should be derived from module title, module keywords, detail title, detail keywords, component names, and attachment titles.
