export function normalizeSearchText(value: unknown) {
  return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function makeSlug(value: unknown) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
