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

## Bulk Operations

### `PATCH /api/modules/bulk`

Access:

- admin only

Bulk update status modul.

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

- `missingIds` berisi ID yang tidak ditemukan di database
- setiap modul yang berhasil di-update menghasilkan satu `AuditLog` entry
- response `affectedCount` bisa lebih kecil dari `requestedCount` jika ada ID invalid

### `DELETE /api/modules/bulk`

Access:

- admin only

Bulk delete modul beserta semua detail, komponen, dan attachment.

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

- file upload terkait dihapus dari filesystem setelah transaction berhasil
- cascade delete berlaku: detail, komponen, dan attachment record ikut terhapus
- satu `AuditLog` entry per top-level module yang dihapus (bukan per child record)
- jika `ids` kosong atau semua invalid, `affectedCount` akan `0`

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

- butuh login (`VIEWER` atau `ADMIN`)

Behavior:

- path traversal ditolak
- file akan di-stream dengan `Content-Type` sesuai extension
- response memakai `Cache-Control: private, no-store`
- `404` jika file tidak ada

## Error Shape

Validation errors memakai helper `validationError()` dan field mapping Zod.

Client side saat ini mengandalkan dua pola:

- `statusMessage` untuk generic message
- `fieldErrors` untuk form error per field bila ada

## Audit Logs

### `GET /api/audit-logs`

Access:

- admin only

Query params:

- `take` jumlah item per page (default: 50)
- `limit` alias untuk `take` (dipakai oleh sidebar card)
- `cursor` ID cursor untuk pagination selanjutnya
- `entityType` filter berdasarkan tipe entity (`MODULE`, `MODULE_DETAIL`, `COMPONENT_ITEM`, `ATTACHMENT`)
- `actorId` filter berdasarkan ID aktor

Response:

```json
{
  "items": [
    {
      "id": "string",
      "action": "CREATE | UPDATE | DELETE",
      "entityType": "MODULE | MODULE_DETAIL | COMPONENT_ITEM | ATTACHMENT",
      "entityId": "string",
      "entityLabel": "Judul entity",
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

- cursor-based pagination (bukan offset)
- `nextCursor` bernilai `null` jika sudah di halaman terakhir
- field `payloadBefore`/`payloadAfter` ada di database (tipe `Json?`) tetapi sengaja **tidak di-expose** di response API — hanya untuk forensik internal

### `POST/PATCH/PUT/DELETE /api/audit-logs`

Semua method selain `GET` mengembalikan **405 Method Not Allowed**.

Route ini adalah guard intentional untuk mencegah mutasi langsung terhadap data audit log melalui API. Audit log hanya ditulis secara internal oleh server saat terjadi operasi CRUD pada modul, detail, komponen, atau attachment.
