# API Contracts

## Summary

This document summarizes the route contracts currently used by the application. It focuses on the routes that are actually active in the current learner and admin flow.

All routes live under `server/api`.

## Auth

### `POST /api/auth/login`

Body:

```json
{
  "email": "viewer@gitronik.co.id",
  "password": "viewer123"
}
```

Successful response:

```json
{
  "profile": {
    "id": "string",
    "email": "viewer@gitronik.co.id",
    "role": "VIEWER"
  }
}
```

Notes:

- invalid credentials return `400` or `401`
- rate limiting is applied per `IP + email` and returns `429`
- a successful login sets the session cookie
- both `ADMIN` and `VIEWER` can log in

### `GET /api/auth/me`

Successful response:

```json
{
  "profile": {
    "id": "string",
    "email": "viewer@gitronik.co.id",
    "fullName": null,
    "role": "VIEWER"
  }
}
```

Without a session, the route returns `401`.

### `POST /api/auth/logout`

Response:

```json
{
  "success": true
}
```

## Modules

### `GET /api/modules`

Query params:

- `search` optional

Access:

- public
- unauthenticated and non-admin callers only see `PUBLISHED` modules
- logged-in admins see all statuses

Current list item response shape:

```json
{
  "id": "string",
  "slug": "afs",
  "title": "AFS",
  "description": "string or null",
  "keywords": "string or null",
  "status": "PUBLISHED",
  "sortOrder": 0,
  "createdAt": "iso",
  "updatedAt": "iso",
  "details": [
    {
      "id": "string",
      "slug": "section-slug",
      "title": "Product Variant Title",
      "summary": "string or null",
      "keywords": "string or null",
      "sortOrder": 0,
      "components": [{ "id": "string", "name": "MCB" }],
      "attachments": [{ "id": "string", "title": "Datasheet" }]
    }
  ]
}
```

Notes:

- the response uses `Cache-Control: no-store`
- search runs server-side across module, detail, component, and attachment text

### `POST /api/modules`

Access:

- admin only

Body schema:

```json
{
  "title": "Module Title",
  "slug": "optional-slug",
  "description": "optional",
  "keywords": "optional",
  "status": "DRAFT",
  "sortOrder": 0
}
```

Response:

- full module payload with complete `details`

### `GET /api/modules/:idOrSlug`

Access:

- public
- non-admin callers only receive `PUBLISHED` modules
- logged-in admins can also receive draft modules

Response:

- full module payload
- `details.components` and `details.attachments` are complete and already sorted

Returns `404` if the module is not found or is not visible to the current role.

### `PATCH /api/modules/:id`

Access:

- admin only

The body may be partial, but must contain at least one field:

```json
{
  "title": "optional",
  "slug": "optional",
  "description": "optional or null",
  "keywords": "optional or null",
  "status": "optional DRAFT or PUBLISHED",
  "sortOrder": 0
}
```

Response:

- full module payload after update

### `DELETE /api/modules/:id`

Access:

- admin only

Response:

```json
{
  "deleted": true
}
```

Or:

```json
{
  "deleted": false
}
```

This supports idempotent delete behavior when the row was already removed earlier.

## Bulk Operations

### `PATCH /api/modules/bulk`

Access:

- admin only

Bulk-updates module status.

Body:

```json
{
  "ids": ["module-id-1", "module-id-2"],
  "status": "DRAFT | PUBLISHED"
}
```

Response:

```json
{
  "requestedCount": 2,
  "affectedCount": 2,
  "missingIds": []
}
```

Notes:

- `missingIds` contains IDs not found in the database
- each successfully updated module produces one `AuditLog` entry
- `affectedCount` can be smaller than `requestedCount` if some IDs are invalid

### `DELETE /api/modules/bulk`

Access:

- admin only

Bulk-deletes modules together with all related details, components, and attachments.

Body:

```json
{
  "ids": ["module-id-1", "module-id-2"]
}
```

Response:

```json
{
  "requestedCount": 2,
  "affectedCount": 2,
  "missingIds": []
}
```

Notes:

- related uploaded files are removed from the filesystem after the transaction succeeds
- cascade delete applies to detail, component, and attachment records
- one `AuditLog` entry is written per top-level deleted module, not per child record
- if `ids` is empty or all IDs are invalid, `affectedCount` is `0`

## Module Details

### `POST /api/modules/:id/details`

Access:

- admin only

Body:

```json
{
  "title": "Product Variant Title",
  "slug": "optional",
  "summary": "optional or null",
  "keywords": "optional or null",
  "sortOrder": 0,
  "components": [
    {
      "category": "optional or null",
      "name": "Component",
      "quantity": "1",
      "unit": "pcs",
      "note": "optional or null",
      "sortOrder": 0
    }
  ]
}
```

Response:

- full detail payload (`components` + `attachments`)

### `PATCH /api/details/:detailId`

Access:

- admin only

Body schema is the same as create detail.

Response:

- full detail payload

### `DELETE /api/details/:detailId`

Access:

- admin only

Response:

```json
{
  "ok": true
}
```

## Attachments

### `POST /api/details/:detailId/attachments`

Access:

- admin only

Body:

```json
{
  "type": "IMAGE | SPREADSHEET | FILE | LINK",
  "title": "Attachment",
  "url": "/api/uploads/... or https://...",
  "filePath": "optional or null",
  "mimeType": "optional or null",
  "sizeBytes": 1234,
  "sortOrder": 0
}
```

Response:

- the newly created attachment

### `PATCH /api/attachments/:attachmentId`

Access:

- admin only

Body schema is the same as create attachment.

### `DELETE /api/attachments/:attachmentId`

Access:

- admin only

Response:

```json
{
  "ok": true
}
```

## Components

### `POST /api/details/:detailId/components`

Access:

- admin only

Adds one new component to the detail.

### `PATCH /api/components/:componentId`

Access:

- admin only

Updates one component.

### `DELETE /api/components/:componentId`

Access:

- admin only

Deletes one component.

## Uploads

### `POST /api/uploads`

Access:

- admin only

Multipart form:

- `file` field is required

Rules:

- max size `10 MB`
- allowed MIME types:
  - jpeg/png/webp/gif
  - pdf
  - csv/xls/xlsx

Response:

```json
{
  "url": "/api/uploads/171234-file.pdf",
  "filePath": "171234-file.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 123456,
  "fileName": "file.pdf",
  "previewUrl": "/api/uploads/171234-file.preview.webp",
  "previewFilePath": "171234-file.preview.webp",
  "previewMimeType": "image/webp",
  "previewSizeBytes": 45678
}
```

Notes:

- previews are only generated for jpeg, png, and webp images

### `GET /api/uploads/:path`

Access:

- requires `VIEWER` or `ADMIN` login

Behavior:

- path traversal is rejected
- the file is streamed with `Content-Type` based on the file extension
- the response uses `Cache-Control: private, no-store`
- returns `404` if the file does not exist

## Error Shape

Validation errors use the `validationError()` helper plus Zod field mapping.

The client currently relies on two response patterns:

- `statusMessage` for a generic message
- `fieldErrors` for per-field form errors when available

## Audit Logs

### `GET /api/audit-logs`

Access:

- admin only

Query params:

- `take` number of items per page (default: 50)
- `limit` alias for `take` (used by the sidebar card)
- `cursor` cursor ID for the next page
- `entityType` filter by entity type (`MODULE`, `MODULE_DETAIL`, `COMPONENT_ITEM`, `ATTACHMENT`)
- `actorId` filter by actor ID

Response:

```json
{
  "items": [
    {
      "id": "string",
      "action": "CREATE | UPDATE | DELETE",
      "entityType": "MODULE | MODULE_DETAIL | COMPONENT_ITEM | ATTACHMENT",
      "entityId": "string",
      "entityLabel": "Entity Title",
      "actorId": "string or null",
      "actorEmail": "admin@gitronik.co.id",
      "actorName": "string or null",
      "createdAt": "iso"
    }
  ],
  "nextCursor": "string or null"
}
```

Notes:

- pagination is cursor-based, not offset-based
- `nextCursor` is `null` on the last page
- `payloadBefore` and `payloadAfter` exist in the database (`Json?`) but are intentionally not exposed in the API response; they are reserved for internal forensic use

### `POST/PATCH/PUT/DELETE /api/audit-logs`

Every method other than `GET` returns `405 Method Not Allowed`.

This route group intentionally prevents direct audit-log mutation through the API. Audit logs are only written internally by the server during module, detail, component, or attachment CRUD operations.
