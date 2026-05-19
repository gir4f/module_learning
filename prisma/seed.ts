import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedModules } from '../app/data/seedModules'

const prisma = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash('admin123', 12)
  const viewerHash = await bcrypt.hash('viewer123', 12)
  await prisma.profile.upsert({
    where: { email: 'admin@gitronik.co.id' },
    update: { passwordHash: adminHash, role: 'ADMIN' },
    create: {
      id: 'seed-admin',
      email: 'admin@gitronik.co.id',
      fullName: 'Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })

  await prisma.profile.upsert({
    where: { email: 'viewer@gitronik.co.id' },
    update: { passwordHash: viewerHash, role: 'VIEWER' },
    create: {
      id: 'seed-viewer',
      email: 'viewer@gitronik.co.id',
      fullName: 'Viewer',
      passwordHash: viewerHash,
      role: 'VIEWER',
    },
  })

  for (const module of seedModules) {
    const savedModule = await prisma.module.upsert({
      where: { slug: module.slug },
      update: {
        title: module.title,
        description: module.description,
        keywords: module.keywords,
        status: module.status,
        sortOrder: module.sortOrder,
      },
      create: {
        slug: module.slug,
        title: module.title,
        description: module.description,
        keywords: module.keywords,
        status: module.status,
        sortOrder: module.sortOrder,
      },
    })

    for (const detail of module.details) {
      const savedDetail = await prisma.moduleDetail.upsert({
        where: {
          moduleId_slug: {
            moduleId: savedModule.id,
            slug: detail.slug,
          },
        },
        update: {
          title: detail.title,
          summary: detail.summary,
          keywords: detail.keywords,
          sortOrder: detail.sortOrder,
        },
        create: {
          moduleId: savedModule.id,
          slug: detail.slug,
          title: detail.title,
          summary: detail.summary,
          keywords: detail.keywords,
          sortOrder: detail.sortOrder,
        },
      })

      await prisma.componentItem.deleteMany({ where: { detailId: savedDetail.id } })
      await prisma.attachment.deleteMany({ where: { detailId: savedDetail.id } })

      if (detail.components.length) {
        await prisma.componentItem.createMany({
          data: detail.components.map((component, index) => ({
            detailId: savedDetail.id,
            category: component.category || null,
            name: component.name,
            quantity: component.quantity,
            unit: component.unit,
            note: component.note || null,
            sortOrder: component.sortOrder ?? index,
          })),
        })
      }

      if (detail.attachments.length) {
        await prisma.attachment.createMany({
          data: detail.attachments.map((attachment, index) => ({
            detailId: savedDetail.id,
            type: attachment.type,
            title: attachment.title,
            url: attachment.url,
            filePath: attachment.filePath || null,
            mimeType: attachment.mimeType || null,
            sizeBytes: attachment.sizeBytes || null,
            sortOrder: attachment.sortOrder ?? index,
          })),
        })
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
