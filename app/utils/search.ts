import type { LearningModule } from '../types/learning'
import { normalizeSearchText } from './slug'

export function moduleMatchesQuery(module: LearningModule, query: string) {
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
