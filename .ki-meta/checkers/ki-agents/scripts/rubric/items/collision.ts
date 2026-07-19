import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { AgentsRubricContext } from '../contexts/agents.ts'
import { triggerPhrases } from '../contexts/agents.ts'
import { outcomes, result } from './common.ts'

const COLLISION_ITEMS = [
  {
    code: 'COLL-1',
    title: 'Distinct quoted trigger phrases',
    description: 'Within a set of at least two agents, no two descriptions declare the same quoted trigger phrase.',
    sources: ['standards.md#13-cross-agent-collision', 'HOUSE'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) => {
          if (context.agents.length < 2) return result('NOT_APPLICABLE', 'Fewer than two agents are in scope.')
          const byPhrase = new Map<string, Set<string>>()
          for (const agent of context.agents)
            for (const phrase of triggerPhrases(agent.description ?? ''))
              byPhrase.set(phrase, new Set([...(byPhrase.get(phrase) ?? []), agent.name ?? agent.file.split('/').at(-1) ?? agent.file]))
          const shared = [...byPhrase.entries()].filter(([, agents]) => agents.size > 1)
          return shared.length > 0
            ? outcomes<AuditOutcome>(
                shared.map(([phrase, agents]) => ({
                  status: 'VIOLATION',
                  message: `Trigger "${phrase}" is shared by ${[...agents].sort().join(', ')} — confirm each names the other as an off-ramp (COLL-2).`
                }))
              )
            : result('PASS', 'Quoted trigger phrases are distinct across the agent set.')
        }
      }
    }
  },
  {
    code: 'COLL-2',
    title: 'Reciprocal collision off-ramps',
    description: 'Agents that could take the same request name each other as off-ramps.',
    sources: ['standards.md#13-cross-agent-collision', 'HOUSE'],
    judgment: {
      prompt: 'Where two agents could take one request, each names the other as the off-ramp; a one-directional guard is a half-fix.'
    }
  }
] as const

export const COLL_1 = COLLISION_ITEMS[0]
export const COLL_2 = COLLISION_ITEMS[1]
export const COLLISION = [COLL_1, COLL_2] as const
