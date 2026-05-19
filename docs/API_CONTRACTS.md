# API Contracts

## Summary

Dokumen ini merangkum kontrak route yang saat ini dipakai aplikasi. Fokusnya adalah route yang benar-benar aktif di learner/admin flow sekarang.

Semua route berada di `server/api`.

## Auth

### `POST /api/auth/login`

Body:

```json
{
  "email": "viewer@gitronik.co.id",
  "password": "viewer123"
}
```

Response success:

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

- invalid credentials -> `400` atau `401`
- rate limited per IP+email -> `429`
- success login akan set session cookie
- role `ADMIN` dan `VIEWER` sama-sama bisa login

### `GET /api/auth/me`

Response success:

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

Tanpa session -> `401`.

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

- public allowed
- unauthenticated/non-admin hanya melihat `PUBLISHED`
- admin yang login melihat semua status

Response item shape saat ini adalah list payload ringkas:

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
      "title": "Judul Varian Produk",
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

- response memakai `Cache-Control: no-store`
- search berjalan server-side dengan filter across module/detail/component/attachment text

### `POST /api/modules`

Access:

- admin only

Body schema:

```json
{
  "title": "Judul Modul",
  "slug": "optional-slug",
  "description": "optional",
  "keywords": "optional",
  "status": "DRAFT",
  "sortOrder": 0
}
```

Response:

- full module payload dengan `details` lengkap

### `GET /api/modules/:idOrSlug`

Access:

- public allowed
- non-admin hanya dapat modul `PUBLISHED`
- admin yang login dapat modul draft juga

Response:

- full module payload
- `details.components` dan `details.attachments` lengkap dan sudah terurut

`404` jika modul tidak ditemukan atau tidak visible untuk role saat ini.

### `PATCH /api/modules/:id`

Access:

- admin only

Body boleh partial, minimal 1 field:

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

- full module payload sesudah update

### `DELETE /api/modules/:id`

Access:

- admin only

Response:

```json
{
  "deleted": true
}
```

Atau:

```json
{
  "deleted": false
}
```

untuk delete idempotent ketika row sudah hilang lebih dulu.

## Module Details

### `POST /api/modules/:id/details`

Access:

- admin only

Body:

```json
{
  "title": "Judul Varian Produk",
  "slug": "optional",
  "summary": "optional or null",
  "keywords": "optional or null",
  "sortOrder": 0,
  "components": [
    {
      "category": "optional or null",
      "name": "Komponen",
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

Body schema sama dengan create detail.

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
  "title": "Lampiran",
  "url": "/api/uploads/.... atau https://....",
  "filePath": "optional or null",
  "mimeType": "optional or null",
  "sizeBytes": 1234,
  "sortOrder": 0
}
```

Response:

- attachment yang baru dibuat

### `PATCH /api/attachments/:attachmentId`

Access:

- admin only

Body schema sama dengan create attachment.

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

Menambah satu komponen baru ke detail.

### `PATCH /api/components/:componentId`

Access:

- admin only

Update satu komponen.

### `DELETE /api/components/:componentId`

Access:

- admin only

Hapus satu komponen.

## Uploads

### `POST /api/uploads`

Access:

- admin only

Multipart form:

- field `file` wajib

Rules:

- max 10 MB
- MIME allowed:
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

- preview hanya dibuat untuk image jpeg/png/webp

### `GET /api/uploads/:path`

Access:

- public-by-URL saat ini

Behavior:

- path traversal ditolak
- file akan di-stream dengan `Content-Type` sesuai extension
- `404` jika file tidak ada

## Error Shape

Validation errors memakai helper `validationError()` dan field mapping Zod.

Client side saat ini mengandalkan dua pola:

- `statusMessage` untuk generic message
- `fieldErrors` untuk form error per field bila ada
