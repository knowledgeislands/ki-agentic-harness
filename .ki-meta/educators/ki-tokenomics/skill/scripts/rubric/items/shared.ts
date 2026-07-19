import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import { auditOutcomes, conformOutcomes, type TokenomicsRubricContext } from '../contexts/tokenomics.ts'

export const mechanical = (
  code: string,
  title: string,
  description: string,
  level: 'FAIL' | 'WARN' = 'WARN'
): RubricItem<TokenomicsRubricContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  mechanical: {
    level,
    overrideLevels: level === 'FAIL' ? ['WARN'] : ['FAIL'],
    audit: { phase: 'INSPECT', run: (context) => auditOutcomes(context, code) },
    conform: { phase: 'NORMALISE', run: (context) => conformOutcomes(context, code) }
  }
})
export const judgment = (code: string, title: string, description: string): RubricItem<TokenomicsRubricContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  judgment: { prompt: description }
})
