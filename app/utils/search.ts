import { normalizeSearchText } from './slug'

interface SearchableModule {
  title?: string | null
  description?: string | null
  keywords?: string | null
  details: Array<{
    title?: string | null
    summary?: string | null
    keywords?: string | null
    components: Array<{ name?: string | null }>
    attachments: Array<{ title?: string | null }>
  }>
}

export function moduleMatchesQuery(module: SearchableModule, query: string) {
  const words = normalizeSearchText(query).split(' ').filter(Boolean)
  if (!words.length) return true

  const haystack = normalizeSearchText([
    module.title,
    module.description,
    module.keywords,
    ...module.details.flatMap((detail) => [
      detail.title,
      detail.summary,
      detail.keywords,
      ...detail.components.map((component) => component.name),
      ...detail.attachments.map((attachment) => attachment.title),
    ]),
  ].join(' '))

  return words.every((word) => haystack.includes(word))
}
