import type { AuditOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'

export const inactive = (context: WebsiteContext): RubricOutcomes<AuditOutcome> | null =>
  !context.available
    ? [{ status: 'VIOLATION', message: `target path is not a directory: ${context.target}` }]
    : !context.applicable
      ? [
          {
            status: 'NOT_APPLICABLE',
            message: 'ki-website not applicable: no [ki-website] declaration or Eleventy config structural marker'
          }
        ]
      : null
export const mechanical = (
  code: string,
  title: string,
  description: string,
  level: 'FAIL' | 'WARN',
  run: (context: WebsiteContext) => RubricOutcomes<AuditOutcome>,
  options: {
    overrideLevels?: readonly ('FAIL' | 'WARN')[]
    conform?: RubricItem<WebsiteContext>['mechanical'] extends infer _T ? never : never
  } = {}
): RubricItem<WebsiteContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  mechanical: { level, ...(options.overrideLevels ? { overrideLevels: options.overrideLevels } : {}), audit: { phase: 'INSPECT', run } }
})
export const judgment = (code: string, title: string, description: string, prompt: string): RubricItem<WebsiteContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  judgment: { prompt }
})
