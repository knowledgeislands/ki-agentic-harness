import type { AuditOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { AgentDefinition, AgentsRubricContext } from '../contexts/agents.ts'

export const outcomes = <Result>(values: Result[]): RubricOutcomes<Result> => {
  if (values.length === 0) throw new Error('rubric execution must return at least one outcome')
  return values as unknown as RubricOutcomes<Result>
}

export const result = (status: AuditOutcome['status'], message: string, subject?: string): RubricOutcomes<AuditOutcome> => [
  { status, message, ...(subject ? { subject } : {}) }
]

export const forAgents = (
  context: AgentsRubricContext,
  inspect: (agent: AgentDefinition) => readonly AuditOutcome[],
  emptyMessage: string
): RubricOutcomes<AuditOutcome> => {
  if (context.agents.length === 0) return result('NOT_APPLICABLE', emptyMessage)
  return outcomes<AuditOutcome>(context.agents.flatMap(inspect))
}
