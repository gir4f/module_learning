import { seedModules } from '../app/data/seedModules'

function sql(value: unknown) {
  if (value === null || value === undefined || value === '') return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function moduleId(slug: string) {
  return `module:${slug}`
}

function detailId(moduleSlug: string, detailSlug: string) {
  return `detail:${moduleSlug}:${detailSlug}`
}

function componentId(moduleSlug: string, detailSlug: string, index: number) {
  return `component:${moduleSlug}:${detailSlug}:${index}`
}

function attachmentId(moduleSlug: string, detailSlug: string, index: number) {
  return `attachment:${moduleSlug}:${detailSlug}:${index}`
}

const statements: string[] = []

for (const module of seedModules) {
  statements.push(`
INSERT INTO "Module" ("id", "slug", "title", "description", "keywords", "status", "sortOrder", "updatedAt")
VALUES (${sql(moduleId(module.slug))}, ${sql(module.slug)}, ${sql(module.title)}, ${sql(module.description)}, ${sql(module.keywords)}, '${module.status}', ${module.sortOrder}, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "keywords" = EXCLUDED."keywords",
  "status" = EXCLUDED."status",
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = CURRENT_TIMESTAMP;`)

  for (const detail of module.details) {
    const currentDetailId = detailId(module.slug, detail.slug)
    statements.push(`
INSERT INTO "ModuleDetail" ("id", "moduleId", "slug", "title", "summary", "keywords", "sortOrder", "updatedAt")
VALUES (${sql(currentDetailId)}, ${sql(moduleId(module.slug))}, ${sql(detail.slug)}, ${sql(detail.title)}, ${sql(detail.summary)}, ${sql(detail.keywords)}, ${detail.sortOrder}, CURRENT_TIMESTAMP)
ON CONFLICT ("moduleId", "slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "summary" = EXCLUDED."summary",
  "keywords" = EXCLUDED."keywords",
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = CURRENT_TIMESTAMP;`)

    statements.push(`DELETE FROM "ComponentItem" WHERE "detailId" = ${sql(currentDetailId)};`)
    detail.components.forEach((component, index) => {
      statements.push(`
INSERT INTO "ComponentItem" ("id", "detailId", "category", "name", "quantity", "unit", "note", "sortOrder")
VALUES (${sql(componentId(module.slug, detail.slug, index))}, ${sql(currentDetailId)}, ${sql(component.category)}, ${sql(component.name)}, ${sql(component.quantity)}, ${sql(component.unit)}, ${sql(component.note)}, ${component.sortOrder ?? index});`)
    })

    statements.push(`DELETE FROM "Attachment" WHERE "detailId" = ${sql(currentDetailId)};`)
    detail.attachments.forEach((attachment, index) => {
      statements.push(`
INSERT INTO "Attachment" ("id", "detailId", "type", "title", "url", "storagePath", "mimeType", "sizeBytes", "sortOrder")
VALUES (${sql(attachmentId(module.slug, detail.slug, index))}, ${sql(currentDetailId)}, '${attachment.type}', ${sql(attachment.title)}, ${sql(attachment.url)}, ${sql(attachment.storagePath)}, ${sql(attachment.mimeType)}, ${attachment.sizeBytes ?? 'NULL'}, ${attachment.sortOrder ?? index});`)
    })
  }
}

console.log(statements.join('\n'))

