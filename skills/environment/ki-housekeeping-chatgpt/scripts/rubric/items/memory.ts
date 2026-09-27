import type { RubricFamily } from '../../shared/rubric.ts'
import type { HousekeepingRubricContext } from '../contexts/housekeeping.ts'
import type { MemoryContext } from '../contexts/memory.ts'

export const MEMORY = {
  code: 'MEMORY',
  title: 'Codex local-memory policy',
  standard: 'standards-codex-memory.md',
  description: 'Explicit repository policy, readable runtime configuration, and retained-memory reconciliation.',
  selectContext: (context) => context.memory,
  items: [
    {
      code: 'MEMORY-1',
      title: 'repository memory policy is explicit',
      description: 'A repository supporting Codex declares disabled, transition, or human-approved enabled memory.',
      sources: ['standards-codex-memory.md#repository-policy'],
      mechanical: {
        level: 'FAIL',
        remediation: {
          class: 'diagnostic',
          guidance:
            'Inspect the selected Codex memory store, then explicitly declare disabled or transition; enabled requires human approval.'
        },
        audit: { phase: 'PREPARE', run: (context: MemoryContext) => context.declaration }
      }
    },
    {
      code: 'MEMORY-2',
      title: 'readable Codex settings agree with policy',
      description:
        'Readable Codex configuration must not enable memory against KI policy; enabled requires project opt-in.',
      sources: ['standards-codex-memory.md#runtime-settings'],
      mechanical: {
        level: 'FAIL',
        remediation: {
          class: 'diagnostic',
          guidance:
            'Review Codex configuration precedence and session overrides; do not change managed user settings without review.'
        },
        audit: { phase: 'PREPARE', run: (context: MemoryContext) => context.runtime }
      }
    },
    {
      code: 'MEMORY-3',
      title: 'retained local memory is reconciled',
      description: 'Transition always warns; memory files under disabled policy need reviewed knowledge routing.',
      sources: ['standards-codex-memory.md#reconciliation'],
      mechanical: {
        level: 'WARN',
        remediation: {
          class: 'diagnostic',
          guidance: 'Preserve local files until useful learning is approved in repository guidance or KB notes.'
        },
        audit: { phase: 'INSPECT', run: (context: MemoryContext) => context.reconciliation }
      }
    }
  ]
} satisfies RubricFamily<HousekeepingRubricContext, MemoryContext>
