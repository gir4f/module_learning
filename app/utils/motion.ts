import type { AutoAnimateOptions } from '@formkit/auto-animate'

/** Canonical duration for every learner-surface v-auto-animate binding (ms). */
export const LEARNER_AUTO_ANIMATE_DURATION = 170

/** Canonical easing for every learner-surface v-auto-animate binding. */
export const LEARNER_AUTO_ANIMATE_EASING = 'ease-out' as const

/**
 * Shared config bound to `v-auto-animate` on every learner-surface list/grid.
 * Centralising this guarantees uniform timing across:
 *   - `app/components/learning/ModuleLibrary.vue`     — root container + module grid
 *   - `app/components/learning/AttachmentList.vue`    — attachments grid
 *   - `app/components/learning/SectionNav.vue`        — root nav
 *   - `app/components/learning/ComponentTable.vue`    — mobile grid
 *   - `app/components/learning/ModuleDocument.vue`    — TOC `<ol>`, per-detail
 *     sections wrapper, summary `<dl>`, quick-attachments list
 */
export const learnerAutoAnimateConfig: Partial<AutoAnimateOptions> = {
  duration: LEARNER_AUTO_ANIMATE_DURATION,
  easing: LEARNER_AUTO_ANIMATE_EASING,
}
