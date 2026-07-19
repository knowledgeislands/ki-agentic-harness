import type { RubricItem } from '../../lib/rubric.ts'
import type { SizeRubricContext } from '../contexts/contexts.ts'

const BODY_MAX_LINES = 500
const BODY_MAX_TOKENS = 5000
const FOOTPRINT_REFERENCE_NOTE_TOKENS = 1500

export const SIZE_1: RubricItem<SizeRubricContext> = {
  code: 'SIZE-1',
  title: 'body is under 500 lines',
  description: '`SKILL.md` body is under **500 lines**.',
  sources: ['SPEC', 'BP', 'CC'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ bodyLines }) => {
        if (bodyLines === undefined) return [{ status: 'NOT_APPLICABLE', message: 'SKILL.md body line count is unavailable' }]
        return bodyLines > BODY_MAX_LINES
          ? [
              {
                status: 'VIOLATION',
                message: `SKILL.md body is ${bodyLines} lines (recommended < ${BODY_MAX_LINES}) — split into references/`
              }
            ]
          : [{ status: 'PASS', message: 'body is under 500 lines' }]
      }
    }
  }
}

export const SIZE_2: RubricItem<SizeRubricContext> = {
  code: 'SIZE-2',
  title: 'body stays below approximately 5,000 tokens',
  description: 'Body instructions stay under **~5,000 tokens**.',
  sources: ['SPEC'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ bodyTokens }) => {
        if (bodyTokens === undefined) return [{ status: 'NOT_APPLICABLE', message: 'SKILL.md body token count is unavailable' }]
        return bodyTokens > BODY_MAX_TOKENS
          ? [{ status: 'VIOLATION', message: `SKILL.md body is ~${bodyTokens} tokens (recommended < ${BODY_MAX_TOKENS})` }]
          : [{ status: 'PASS', message: 'body stays below approximately 5,000 tokens' }]
      }
    }
  }
}

export const SIZE_3: RubricItem<SizeRubricContext> = {
  code: 'SIZE-3',
  title: 'body omits knowledge the agent already has',
  description: 'No token spent on what a competent Claude already knows.',
  sources: ['BP'],
  judgment: { prompt: 'Does the body avoid spending tokens on knowledge a competent agent already has?' }
}

export const SIZE_4: RubricItem<SizeRubricContext> = {
  code: 'SIZE-4',
  title: 'body is an overview that routes to detail',
  description: '`SKILL.md` reads as an **overview that routes to detail**, not all detail inlined.',
  sources: ['BP', 'SPEC', 'CC'],
  judgment: { prompt: 'Does the body work as an overview that routes rarely used detail into supporting files?' }
}

export const SIZE_5: RubricItem<SizeRubricContext> = {
  code: 'SIZE-5',
  title: 'the optional footprint report measures every loaded component',
  description: `_(INFO, advisory — not a cap.)_ The linter, under \`--footprint\`, emits a per-skill token estimate of each component the skill adds to context — the \`description\` (standing cost), the \`SKILL.md\` body, and each \`references/\` file — plus a total. Neutral measurement for **Mode OPTIMISE**, never a verdict; the body/references soft limits remain SIZE-1/SIZE-2 and the environment-wide aggregate of all descriptions is \`ki-tokenomics\`' \`skills_surface\`.`,
  sources: ['BP'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ footprint }) => {
        if (!footprint) return [{ status: 'NOT_APPLICABLE', message: 'footprint reporting is not enabled' }]
        const references = footprint.rows.filter((row) => row.kind === 'reference').length
        return [
          {
            status: 'INFO',
            message: `Estimated footprint is ${footprint.total} tokens across description, body, and ${references} reference file(s).`
          },
          ...footprint.rows.map((row) => ({
            status: 'INFO' as const,
            message: `Estimated ${row.kind} footprint is ${row.tokens} tokens${row.kind === 'reference' && row.tokens > FOOTPRINT_REFERENCE_NOTE_TOKENS ? '; consider splitting or trimming it' : '.'}`,
            subject: row.path
          }))
        ]
      }
    }
  }
}

export const SIZE = [SIZE_1, SIZE_2, SIZE_3, SIZE_4, SIZE_5] as const
