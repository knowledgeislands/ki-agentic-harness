import type { AuditOutcome, RubricItem, RubricOutcomes, ViolationLevel } from '../../vendored/ki-skills/rubric.ts'
import type { ToolsContext } from '../contexts/tools.ts'
export const one = (outcome: AuditOutcome): RubricOutcomes<AuditOutcome> => [outcome]
export const mechanical = (code: string, title: string, description: string, level: ViolationLevel, run: (context: ToolsContext) => RubricOutcomes<AuditOutcome>, conform?: (context: ToolsContext) => any): RubricItem<ToolsContext> => ({ code, title, description, sources: ['standards.md'], mechanical: { level, audit: { phase: 'INSPECT', run }, conform: { phase: 'PRIMARY', run: conform ?? (() => [{ status: 'NOT_APPLICABLE', message: 'This criterion has no safe mechanical conform action.' }]) } } })
export const judgment = (code: string, title: string, description: string): RubricItem<ToolsContext> => ({ code, title, description, sources: ['standards.md'], judgment: { prompt: description } })
