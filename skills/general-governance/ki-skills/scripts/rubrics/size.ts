import type { RubricItem } from '../lib/rubric/rubric.ts'

const BODY_MAX_LINES = 500
const BODY_MAX_TOKENS = 5000
const FOOTPRINT_REFERENCE_NOTE_TOKENS = 1500

export type FootprintRow = { kind: 'description' | 'body' | 'reference'; path: string; tokens: number }

export type SizeRubricContext = {
  bodyLines?: number
  bodyTokens?: number
  footprint?: { total: number; rows: readonly FootprintRow[] }
}

export const SIZE_1: RubricItem<SizeRubricContext> = {
  code: 'SIZE-1',
  title: 'body is under 500 lines',
  description: 'The SKILL.md body stays below the recommended 500-line limit.',
  sources: ['SPEC', 'BP', 'CC'],
  audit: ({ bodyLines }) =>
    bodyLines !== undefined && bodyLines > BODY_MAX_LINES
      ? [
          {
            type: 'M',
            level: 'WARN',
            code: SIZE_1.code,
            message: `SKILL.md body is ${bodyLines} lines (recommended < ${BODY_MAX_LINES}) — split into references/`
          }
        ]
      : []
}

export const SIZE_2: RubricItem<SizeRubricContext> = {
  code: 'SIZE-2',
  title: 'body stays below approximately 5,000 tokens',
  description: 'The SKILL.md body stays below the recommended approximate 5,000-token limit.',
  sources: ['SPEC'],
  audit: ({ bodyTokens }) =>
    bodyTokens !== undefined && bodyTokens > BODY_MAX_TOKENS
      ? [
          {
            type: 'M',
            level: 'WARN',
            code: SIZE_2.code,
            message: `SKILL.md body is ~${bodyTokens} tokens (recommended < ${BODY_MAX_TOKENS})`
          }
        ]
      : []
}

export const SIZE_3: RubricItem<SizeRubricContext> = {
  code: 'SIZE-3',
  title: 'body omits knowledge the agent already has',
  description: 'The skill body does not spend tokens restating knowledge a competent agent already has.',
  sources: ['BP'],
  judgment: { prompt: 'Does the body avoid spending tokens on knowledge a competent agent already has?' }
}

export const SIZE_4: RubricItem<SizeRubricContext> = {
  code: 'SIZE-4',
  title: 'body is an overview that routes to detail',
  description: 'The skill body provides an overview and routes rarely used detail into supporting files.',
  sources: ['BP', 'SPEC', 'CC'],
  judgment: { prompt: 'Does the body work as an overview that routes rarely used detail into supporting files?' }
}

export const SIZE_5: RubricItem<SizeRubricContext> = {
  code: 'SIZE-5',
  title: 'the optional footprint report measures every loaded component',
  description: 'The footprint report measures description, body, references, and a total without treating them as verdicts.',
  sources: ['BP'],
  audit: ({ footprint }) => {
    if (!footprint) return []
    const references = footprint.rows.filter((row) => row.kind === 'reference').length
    return [
      {
        type: 'M',
        level: 'INFO',
        code: SIZE_5.code,
        message: `Estimated footprint is ${footprint.total} tokens across description, body, and ${references} reference file(s).`
      },
      ...footprint.rows.map((row) => ({
        type: 'M' as const,
        level: 'INFO' as const,
        code: SIZE_5.code,
        message: `Estimated ${row.kind} footprint is ${row.tokens} tokens${row.kind === 'reference' && row.tokens > FOOTPRINT_REFERENCE_NOTE_TOKENS ? '; consider splitting or trimming it' : '.'}`,
        file: row.path
      }))
    ]
  }
}

export const SIZE: readonly RubricItem<SizeRubricContext>[] = [SIZE_1, SIZE_2, SIZE_3, SIZE_4, SIZE_5]
