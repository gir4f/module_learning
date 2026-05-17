export async function invalidateModuleCache() {
  const storage = useStorage()
  const keys = await storage.getKeys('cache').catch(() => [])
  await Promise.all(
    keys
      .filter(key => key.includes('module-api'))
      .map(key => storage.removeItem(key).catch(() => undefined)),
  )
}
