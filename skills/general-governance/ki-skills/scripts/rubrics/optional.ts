import type { RubricItem } from '../lib/rubric/rubric.ts'

const COMPATIBILITY_MIN_LENGTH = 1
const COMPATIBILITY_MAX_LENGTH = 500

export type OptionalRubricContext = {
  compatibility: string | undefined
  metadataPresent: boolean
  metadata: unknown
}

export const OPT_1: RubricItem<OptionalRubricContext> = {
  code: 'OPT-1',
  title: 'compatibility is between 1 and 500 characters when present',
  description: 'An optional compatibility declaration is between 1 and 500 characters long.',
  sources: ['SPEC'],
  audit: ({ compatibility }) =>
    compatibility !== undefined && (compatibility.length < COMPATIBILITY_MIN_LENGTH || compatibility.length > COMPATIBILITY_MAX_LENGTH)
      ? [
          {
            type: 'M',
            level: 'FAIL',
            code: OPT_1.code,
            message: `\`compatibility\` is ${compatibility.length} chars (must be ${COMPATIBILITY_MIN_LENGTH}–${COMPATIBILITY_MAX_LENGTH})`
          }
        ]
      : []
}

export const OPT_2: RubricItem<OptionalRubricContext> = {
  code: 'OPT-2',
  title: 'metadata is a string-to-string map when present',
  description: 'An optional metadata declaration is a map whose keys and values are strings.',
  sources: ['SPEC'],
  audit: ({ metadataPresent, metadata }) => {
    if (!metadataPresent) return []
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata))
      return [{ type: 'M', level: 'FAIL', code: OPT_2.code, message: '`metadata` must be a string-to-string map' }]
    const invalid = Object.entries(metadata as Record<string, unknown>).find(([, value]) => typeof value !== 'string')
    return invalid ? [{ type: 'M', level: 'FAIL', code: OPT_2.code, message: `\`metadata.${invalid[0]}\` must be a string` }] : []
  }
}

export const OPT_3: RubricItem<OptionalRubricContext> = {
  code: 'OPT-3',
  title: 'tool declarations use valid tool specifications',
  description: 'Optional allowed-tools and disallowed-tools declarations use valid tool specifications.',
  sources: ['SPEC', 'CC']
}

export const OPT_4: RubricItem<OptionalRubricContext> = {
  code: 'OPT-4',
  title: 'license declarations are short names or bundled-file references',
  description: 'An optional license declaration is a short license name or references a bundled file.',
  sources: ['SPEC']
}

export const OPT_5: RubricItem<OptionalRubricContext> = {
  code: 'OPT-5',
  title: 'runtime-specific fields are flagged where portability matters',
  description: 'A skill identifies runtime-specific fields when cross-platform portability matters.',
  sources: ['CC'],
  judgment: { prompt: 'Where cross-platform portability matters, are runtime-specific fields clearly identified?' }
}

export const OPT_6: RubricItem<OptionalRubricContext> = {
  code: 'OPT-6',
  title: 'manually timed side effects disable model invocation',
  description: 'Side-effecting or manually timed workflows set disable-model-invocation appropriately.',
  sources: ['CC'],
  judgment: { prompt: 'Do side-effecting or manually timed workflows set disable-model-invocation: true where appropriate?' }
}

export const OPT_7: RubricItem<OptionalRubricContext> = {
  code: 'OPT-7',
  title: 'discrete modes have an ordered argument hint',
  description: 'A skill with discrete modes declares named, alphabetically ordered modes in argument-hint.',
  sources: ['CC', 'COMMUNITY'],
  judgment: { prompt: 'Where the skill has discrete modes, are they named and alphabetically ordered in argument-hint?' }
}

export const OPTIONAL: readonly RubricItem<OptionalRubricContext>[] = [OPT_1, OPT_2, OPT_3, OPT_4, OPT_5, OPT_6, OPT_7]
