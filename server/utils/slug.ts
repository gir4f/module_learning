import { makeSlug } from '../../app/utils/slug'

export async function uniqueSlug(
  value: string,
  isTaken: (slug: string) => Promise<boolean>,
  fallback = 'item',
) {
  const base = makeSlug(value) || fallback
  let slug = base
  let suffix = 2

  while (await isTaken(slug)) {
    slug = `${base}-${suffix}`
    suffix += 1
  }

  return slug
}
