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

export const OPTIONAL: readonly RubricItem<OptionalRubricContext>[] = [OPT_1, OPT_2]
