# API Contract

Nuxt server routes expose a small REST-like API. Mutating routes validate input, require admin auth, and call Prisma.

## Modules

```txt
GET    /api/modules
POST   /api/modules
GET    /api/modules/:id
PATCH  /api/modules/:id
DELETE /api/modules/:id
```

## Module Details

```txt
POST   /api/modules/:moduleId/details
PATCH  /api/details/:detailId
DELETE /api/details/:detailId
```

Component rows are saved as part of the detail payload.

## Attachments

```txt
POST   /api/details/:detailId/attachments
PATCH  /api/attachments/:attachmentId
DELETE /api/attachments/:attachmentId
```

## Uploads

```txt
POST /api/uploads
GET  /api/uploads/:path
```

`POST /api/uploads` accepts multipart form data with a `file` part, requires admin auth, saves to `UPLOAD_DIR`, and returns `{ url, filePath, mimeType, sizeBytes, fileName }`.

Legacy `/api/files/*` upload routes are not part of the contract.

## Auth

```txt
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Login checks `Profile.passwordHash` with bcryptjs and stores `userId` in an h3 session.
Repeated failed login attempts are rate-limited.

## Error Shape

Use readable errors because they appear in admin forms:

```json
{
  "message": "Module title is required.",
  "fieldErrors": {
    "title": "Required"
  }
}
```
