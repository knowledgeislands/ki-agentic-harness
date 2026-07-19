import type { AgentsRubricContext } from '../contexts/agents.ts'
import { stripCode } from '../contexts/agents.ts'
import { forAgents } from './common.ts'
import { DESCRIPTION_MAX } from './constants.ts'

const DESCRIPTION_ITEMS = [
  {
    code: 'DESC-1',
    title: 'Description present',
    description: 'description is present and non-empty.',
    sources: ['standards.md#4-frontmatter-description', 'CC'],
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
                    status: agent.description?.trim() ? 'PASS' : 'VIOLATION',
                    message: agent.description?.trim() ? 'description is present.' : 'description is missing or empty.',
                    subject: agent.file
                  }
            ],
            'No agent definitions require description checks.'
          )
      }
    }
  },
  {
    code: 'DESC-2',
    title: 'Description soft length cap',
    description: 'description is at most approximately 1024 characters.',
    sources: ['standards.md#4-frontmatter-description', 'BP'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => [
              agent.description === undefined
                ? { status: 'NOT_APPLICABLE', message: 'description is absent.', subject: agent.file }
                : {
                    status: agent.description.length <= DESCRIPTION_MAX ? 'PASS' : 'VIOLATION',
                    message: `description is ${agent.description.length} chars (recommended ≤ ${DESCRIPTION_MAX}).`,
                    subject: agent.file
                  }
            ],
            'No agent definitions require description checks.'
          )
      }
    }
  },
  {
    code: 'DESC-3',
    title: 'Description XML safety',
    description: 'description contains no XML tags.',
    sources: ['standards.md#4-frontmatter-description', 'BP'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => [
              agent.description === undefined
                ? { status: 'NOT_APPLICABLE', message: 'description is absent.', subject: agent.file }
                : {
                    status: /<\/?[a-zA-Z][^>]*>/.test(stripCode(agent.description)) ? 'VIOLATION' : 'PASS',
                    message: 'description contains no XML tags.',
                    subject: agent.file
                  }
            ],
            'No agent definitions require description checks.'
          )
      }
    }
  },
  {
    code: 'DESC-4',
    title: 'Ownership and delegation signal',
    description: 'The description states both what the agent owns and when to delegate to it.',
    sources: ['standards.md#4-frontmatter-description', 'CC', 'BP'],
    judgment: { prompt: 'States both what the agent owns and when to delegate to it.' }
  },
  {
    code: 'DESC-5',
    title: 'Third-person description',
    description: 'The description is written in the third person, never first or second person.',
    sources: ['standards.md#4-frontmatter-description', 'BP'],
    judgment: { prompt: 'Written in the third person, never first/second person.' }
  },
  {
    code: 'DESC-6',
    title: 'Concrete request cues',
    description: 'The description includes concrete cues a request would carry.',
    sources: ['standards.md#4-frontmatter-description', 'CC', 'BP'],
    judgment: { prompt: "Includes concrete cues a request would carry (the role's nouns/verbs)." }
  },
  {
    code: 'DESC-7',
    title: 'Specific description',
    description: 'The description avoids vague phrasing such as helps with engineering.',
    sources: ['standards.md#4-frontmatter-description', 'BP'],
    judgment: { prompt: 'Avoids vague phrasing ("helps with engineering").' }
  }
] as const

export const DESC_1 = DESCRIPTION_ITEMS[0]
export const DESC_2 = DESCRIPTION_ITEMS[1]
export const DESC_3 = DESCRIPTION_ITEMS[2]
export const DESC_4 = DESCRIPTION_ITEMS[3]
export const DESC_5 = DESCRIPTION_ITEMS[4]
export const DESC_6 = DESCRIPTION_ITEMS[5]
export const DESC_7 = DESCRIPTION_ITEMS[6]
export const DESCRIPTION = [DESC_1, DESC_2, DESC_3, DESC_4, DESC_5, DESC_6, DESC_7] as const
