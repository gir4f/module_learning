import { readdir, stat } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const root = join(process.cwd(), 'public', 'module-assets')
const largeAssetBytes = 1024 * 1024
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp'])

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walk(path)
    if (!entry.isFile() || !imageExtensions.has(extname(entry.name).toLowerCase())) return []
    const info = await stat(path)
    return [{ path, size: info.size }]
  }))
  return files.flat()
}

const assets = (await walk(root))
  .sort((a, b) => b.size - a.size)
  .map(asset => ({
    file: relative(process.cwd(), asset.path),
    sizeMb: Number((asset.size / (1024 * 1024)).toFixed(2)),
    needsOptimization: asset.size >= largeAssetBytes,
  }))

const largeAssets = assets.filter(asset => asset.needsOptimization)

console.table(assets.slice(0, 20))

if (largeAssets.length) {
  console.log(`\n${largeAssets.length} image asset(s) are larger than 1 MB. Optimize these before polishing smaller UI details.`)
  process.exitCode = 1
} else {
  console.log('\nAll module image assets are below 1 MB.')
}
