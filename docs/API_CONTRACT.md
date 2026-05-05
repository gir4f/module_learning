# API Contract

Nuxt server routes should expose a small REST-like API for the frontend. These routes should validate input, check auth/role, and call Prisma.

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

## Component Items

For simplicity, update component rows as part of the detail update payload first.

Optional later:

```txt
POST   /api/details/:detailId/components
PATCH  /api/components/:componentId
DELETE /api/components/:componentId
```

## Attachments

```txt
POST   /api/details/:detailId/attachments
PATCH  /api/attachments/:attachmentId
DELETE /api/attachments/:attachmentId
```

## Uploads

Use Supabase Storage for file bytes. The API stores metadata after upload.

```txt
POST /api/uploads/sign
POST /api/details/:detailId/attachments
```

If using direct Supabase client uploads from the browser, keep storage rules strict and still save attachment metadata through a Nuxt server route.

## Authorization

- `GET /api/modules` may return only published modules for viewers.
- Admin-only routes: create, update, delete, upload metadata changes.
- Server routes must verify the Supabase user and role before mutations.

## Error Shape

Use a predictable error shape:

```json
{
  "message": "Module title is required.",
  "fieldErrors": {
    "title": "Required"
  }
}
```

Keep errors readable because they are shown in admin forms.

