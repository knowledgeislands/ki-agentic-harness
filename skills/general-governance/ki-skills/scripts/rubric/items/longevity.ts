import type { RubricItem } from '../../lib/rubric/rubric.ts'
import type { LongevityRubricContext } from '../contexts/contexts.ts'
import type { RefreshContext } from '../contexts/longevity.ts'

const REFRESH_GRACE_DAYS = 14

const refreshStatus = (context: RefreshContext): string => {
  const status =
    context.refreshClass === null || context.cadence === null
      ? 'UNMARKED'
      : context.windowDays === null
        ? 'NO-CLOCK'
        : context.ageDays === null || context.ageDays > context.windowDays + REFRESH_GRACE_DAYS
          ? 'OVERDUE'
          : context.ageDays < context.windowDays
            ? 'WITHIN-WINDOW'
            : 'DUE'
  return `${context.refreshClass ?? 'unmarked'} · ${context.cadence ?? '—'} · last ${context.lastReviewed ?? '—'} · age ${context.ageDays ?? '—'}d · ${status}`
}

export const LONG_1: RubricItem = {
  code: 'LONG-1',
  title: 'volatile facts have a refresh path',
  description: 'A skill with time-sensitive facts resolves them at runtime or records sources and a refresh path.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Do volatile facts resolve at runtime or have a tracked source list and refresh path?' }
}

export const LONG_2: RubricItem = {
  code: 'LONG-2',
  title: 'the refresh path has a cadence',
  description: 'A skill that has a refresh path declares an appropriate cadence and schedules it when supported.',
  sources: ['COMMUNITY'],
  judgment: { prompt: 'Does the refresh path have an appropriate declared cadence and scheduled execution where supported?' }
}

export const LONG_3: RubricItem<LongevityRubricContext> = {
  code: 'LONG-3',
  title: 'the declared refresh cadence is being met',
  description: 'A skill source list remains within its declared review cadence and grace period.',
  sources: ['COMMUNITY'],
  audit: (context) => {
    if (context.reportStatus)
      return [
        {
          type: 'M',
          level: 'INFO',
          code: LONG_3.code,
          message: `Refresh status: ${context.sourcesPresent ? refreshStatus(context) : 'no sources.md'}`
        }
      ]
    if (!context.sourcesPresent || context.cadence === null || context.windowDays === null) return []
    if (context.ageDays !== null && context.ageDays <= context.windowDays + REFRESH_GRACE_DAYS) return []
    return [
      {
        type: 'M',
        level: 'WARN',
        code: LONG_3.code,
        message: context.lastReviewed
          ? `references/sources.md last reviewed ${context.lastReviewed} (${context.ageDays} days ago), past its ${context.cadence} REFRESH cadence + ${REFRESH_GRACE_DAYS}d grace — run Mode REFRESH`
          : `references/sources.md declares a ${context.cadence} cadence but has no \`Last reviewed\` date — run Mode REFRESH`
      }
    ]
  }
}

export const LONG_4: RubricItem<LongevityRubricContext> = {
  code: 'LONG-4',
  title: 'the refresh marker is present and coherent',
  description: 'A sources file has a parseable and coherent refresh class and cadence marker.',
  sources: ['COMMUNITY'],
  audit: (context) => {
    if (!context.sourcesPresent) return []
    if (context.refreshClass === null || context.cadence === null)
      return [
        {
          type: 'M',
          level: 'WARN',
          code: LONG_4.code,
          message: 'references/sources.md has no parseable `**Refresh:** <class> · <cadence>` marker near the top (LONG-4a)'
        }
      ]
    return context.refreshClass === 'external-spec' && context.cadence === 'on-change'
      ? [
          {
            type: 'M',
            level: 'WARN',
            code: LONG_4.code,
            message: '`**Refresh:**` marks this external-spec but cadence is `on-change` — an external-spec tracker needs a clock cadence (LONG-4b)'
          }
        ]
      : []
  }
}

export const LONGEVITY: readonly RubricItem<LongevityRubricContext>[] = [LONG_1, LONG_2, LONG_3, LONG_4]
