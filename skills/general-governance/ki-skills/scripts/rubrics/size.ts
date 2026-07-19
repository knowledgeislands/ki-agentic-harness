import type { RubricItem } from '../lib/rubric/rubric.ts'

const BODY_MAX_LINES = 500
const BODY_MAX_TOKENS = 5000

export type SizeRubricContext = {
  bodyLines: number
  bodyTokens: number
}

export const SIZE_1: RubricItem<SizeRubricContext> = {
  code: 'SIZE-1',
  title: 'body is under 500 lines',
  description: 'The SKILL.md body stays below the recommended 500-line limit.',
  sources: ['SPEC', 'BP', 'CC'],
  audit: ({ bodyLines }) =>
    bodyLines > BODY_MAX_LINES
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
    bodyTokens > BODY_MAX_TOKENS
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

export const SIZE: readonly RubricItem<SizeRubricContext>[] = [SIZE_1, SIZE_2, SIZE_3, SIZE_4]
