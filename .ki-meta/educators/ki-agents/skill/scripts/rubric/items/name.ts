import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { AgentsRubricContext } from '../contexts/agents.ts'
import { forAgents, outcomes, result } from './common.ts'
import { NAME_MAX, RESERVED_NAMES } from './constants.ts'

const NAME_ITEMS = [
  {
    code: 'NAME-1',
    title: 'Name present',
    description: 'name is present.',
    sources: ['standards.md#3-frontmatter-name', 'CC'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => [
              agent.frontmatter.raw === null
                ? { status: 'NOT_APPLICABLE', message: 'Frontmatter is absent.', subject: agent.file }
                : {
                    status: agent.name ? 'PASS' : 'VIOLATION',
                    message: agent.name ? 'name is present.' : 'name is missing from frontmatter.',
                    subject: agent.file
                  }
            ],
            'No agent definitions require name checks.'
          )
      }
    }
  },
  {
    code: 'NAME-2',
    title: 'Name characters and length',
    description: 'name uses lowercase letters, digits, and hyphens only and is at most 64 characters.',
    sources: ['standards.md#3-frontmatter-name', 'CC', 'BP'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => {
              if (!agent.name) return [{ status: 'NOT_APPLICABLE', message: 'name is absent.', subject: agent.file }]
              const checks: AuditOutcome[] = []
              if (agent.name.length > NAME_MAX)
                checks.push({ status: 'VIOLATION', message: `name is ${agent.name.length} chars (max ${NAME_MAX}).`, subject: agent.file })
              if (!/^[a-z0-9-]+$/.test(agent.name))
                checks.push({
                  status: 'VIOLATION',
                  message: `name "${agent.name}" must use lowercase letters, digits, and hyphens only.`,
                  subject: agent.file
                })
              return checks.length > 0
                ? checks
                : [{ status: 'PASS', message: 'name characters and length are valid.', subject: agent.file }]
            },
            'No agent definitions require name checks.'
          )
      }
    }
  },
  {
    code: 'NAME-3',
    title: 'Name hyphen placement',
    description: 'name has no leading or trailing hyphen and no consecutive hyphens.',
    sources: ['standards.md#3-frontmatter-name', 'CC'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => [
              !agent.name
                ? { status: 'NOT_APPLICABLE', message: 'name is absent.', subject: agent.file }
                : {
                    status: agent.name.startsWith('-') || agent.name.endsWith('-') || agent.name.includes('--') ? 'VIOLATION' : 'PASS',
                    message: 'name must not start or end with a hyphen or contain consecutive hyphens.',
                    subject: agent.file
                  }
            ],
            'No agent definitions require name checks.'
          )
      }
    }
  },
  {
    code: 'NAME-4',
    title: 'Name safety',
    description: 'name contains no XML tags and no reserved words (anthropic, claude).',
    sources: ['standards.md#3-frontmatter-name', 'BP'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => {
              if (!agent.name) return [{ status: 'NOT_APPLICABLE', message: 'name is absent.', subject: agent.file }]
              const violations: AuditOutcome[] = []
              if (/<\/?[a-zA-Z][^>]*>/.test(agent.name))
                violations.push({ status: 'VIOLATION', message: 'name contains an XML tag.', subject: agent.file })
              for (const reserved of RESERVED_NAMES)
                if (agent.name.includes(reserved))
                  violations.push({ status: 'VIOLATION', message: `name contains the reserved word "${reserved}".`, subject: agent.file })
              return violations.length > 0
                ? violations
                : [{ status: 'PASS', message: 'name contains no XML tags or reserved words.', subject: agent.file }]
            },
            'No agent definitions require name checks.'
          )
      }
    }
  },
  {
    code: 'NAME-5',
    title: 'Unique name',
    description: 'name is unique across the agent set.',
    sources: ['standards.md#3-frontmatter-name', 'CC', 'HOUSE'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) => {
          if (context.agents.length < 2) return result('NOT_APPLICABLE', 'Fewer than two agents are in scope.')
          const byName = new Map<string, string[]>()
          for (const agent of context.agents) {
            if (!agent.name) continue
            byName.set(agent.name, [...(byName.get(agent.name) ?? []), agent.file])
          }
          const duplicates = [...byName.entries()].filter(([, files]) => files.length > 1)
          return duplicates.length > 0
            ? outcomes<AuditOutcome>(
                duplicates.map(([name, files]) => ({
                  status: 'VIOLATION',
                  message: `name "${name}" is used by ${files
                    .map((file) => file.split('/').at(-1))
                    .sort()
                    .join(', ')} — names must be unique across the agent set.`
                }))
              )
            : result('PASS', 'Agent names are unique across the set.')
        }
      }
    }
  },
  {
    code: 'NAME-6',
    title: 'Specific role name',
    description: 'name is a specific role, not a generic helper or assistant.',
    sources: ['standards.md#3-frontmatter-name', 'BP'],
    judgment: { prompt: 'name is a specific role, not generic (engineering-lead, not helper/assistant).' }
  }
] as const

export const NAME_1 = NAME_ITEMS[0]
export const NAME_2 = NAME_ITEMS[1]
export const NAME_3 = NAME_ITEMS[2]
export const NAME_4 = NAME_ITEMS[3]
export const NAME_5 = NAME_ITEMS[4]
export const NAME_6 = NAME_ITEMS[5]
export const NAME = [NAME_1, NAME_2, NAME_3, NAME_4, NAME_5, NAME_6] as const
