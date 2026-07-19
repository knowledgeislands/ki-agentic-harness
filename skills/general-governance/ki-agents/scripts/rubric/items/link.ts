import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { AgentsRubricContext } from '../contexts/agents.ts'
import { relativeLinkTargets, stripCode } from '../contexts/agents.ts'
import { forAgents } from './common.ts'

const LINK_ITEMS = [
  {
    code: 'LINK-1',
    title: 'Resolvable relative links',
    description: 'Relative Markdown links to bundled files resolve on disk.',
    sources: ['standards.md#10-linking', 'HOUSE'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => {
              const broken = relativeLinkTargets(stripCode(agent.body)).filter(
                (target) => !existsSync(resolve(dirname(agent.file), target))
              )
              return broken.length > 0
                ? broken.map((target) => ({ status: 'VIOLATION', message: `Broken relative link → "${target}".`, subject: agent.file }))
                : [{ status: 'PASS', message: 'Relative links resolve.', subject: agent.file }]
            },
            'No agent definitions require link checks.'
          )
      }
    }
  },
  {
    code: 'LINK-2',
    title: 'Allowed knowledge-base wikilinks',
    description: 'Wikilinks to knowledge-base notes are allowed in grounded agent prompts.',
    sources: ['standards.md#10-linking', 'HOUSE'],
    judgment: {
      prompt:
        '`[[wikilinks]]` to KB notes are allowed here (a grounded agent cites its notes) and are not a defect, unlike in a `SKILL.md`.'
    }
  },
  {
    code: 'LINK-3',
    title: 'Name-based composition references',
    description: 'Other agents and skills are referred to by name, never by file path.',
    sources: ['standards.md#10-linking', 'HOUSE'],
    judgment: { prompt: 'Other agents/skills are referred to by name, never by file path.' }
  }
] as const

export const LINK_1 = LINK_ITEMS[0]
export const LINK_2 = LINK_ITEMS[1]
export const LINK_3 = LINK_ITEMS[2]
export const LINK = [LINK_1, LINK_2, LINK_3] as const
