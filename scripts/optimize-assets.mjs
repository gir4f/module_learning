import { rename, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
import sharp from 'sharp'

const assets = [
  'Device Speed Uni.jpg',
  'GT-GY2 & GT-GY03A.jpg',
  'Fototruk.png',
  'Gambartruk.png',
]

const root = join(process.cwd(), 'public', 'module-assets')

for (const asset of assets) {
  const source = join(root, asset)
  const temporary = `${source}.optimized-tmp`
  const extension = extname(asset).toLowerCase()
  const before = await stat(source)
  let pipeline = sharp(source).rotate().resize({
    width: 1600,
    height: 1600,
    fit: 'inside',
    withoutEnlargement: true,
  })

  if (extension === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, effort: 10, palette: true })
  } else {
    pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true })
  }

  await pipeline.toFile(temporary)
  const after = await stat(temporary)

  if (after.size < before.size) {
    await rename(temporary, source)
    console.log(`${asset}: ${(before.size / 1048576).toFixed(2)} MB -> ${(after.size / 1048576).toFixed(2)} MB`)
  } else {
    await rename(temporary, `${temporary}.unused`)
    console.log(`${asset}: kept original because optimized output was larger`)
  }
}
