import type { AgentsRubricContext } from '../contexts/agents.ts'
import { forAgents } from './common.ts'

const PROMPT_ITEMS = [
  {
    code: 'PROMPT-1',
    title: 'System-prompt body present',
    description: 'A non-empty system-prompt body follows the frontmatter.',
    sources: ['standards.md#6-system-prompt-size--focus', 'CC'],
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
                    status: agent.body.trim() ? 'PASS' : 'VIOLATION',
                    message: agent.body.trim() ? 'System-prompt body is present.' : 'No system-prompt body follows the frontmatter.',
                    subject: agent.file
                  }
            ],
            'No agent definitions require prompt checks.'
          )
      }
    }
  },
  {
    code: 'PROMPT-2',
    title: 'Role and lane opening',
    description: 'The system prompt opens with the role and lane: what it owns and what it does not.',
    sources: ['standards.md#7-system-prompt-structure--quality', 'HOUSE'],
    judgment: { prompt: 'Opens with role & lane — what it owns and, explicitly, what it does not.' }
  },
  {
    code: 'PROMPT-3',
    title: 'Grounding before action',
    description: 'The system prompt names sources to read and cite before acting.',
    sources: ['standards.md#7-system-prompt-structure--quality', 'HOUSE'],
    judgment: { prompt: 'Grounding: names the sources it must read before acting and requires citing them, not reasoning from memory.' }
  },
  {
    code: 'PROMPT-4',
    title: 'When-invoked procedure',
    description: 'The system prompt gives a short ordered clarify, read, reason, produce procedure.',
    sources: ['standards.md#7-system-prompt-structure--quality', 'HOUSE'],
    judgment: { prompt: 'A short ordered when-invoked procedure (clarify → read → reason → produce).' }
  },
  {
    code: 'PROMPT-5',
    title: 'Own-versus-defer boundary',
    description: 'The system prompt explicitly names sibling hand-offs.',
    sources: ['standards.md#7-system-prompt-structure--quality', 'HOUSE'],
    judgment: { prompt: 'An explicit own-vs-defer list naming the siblings it hands work to.' }
  },
  {
    code: 'PROMPT-6',
    title: 'Safe write guidance',
    description: 'A writing agent requires confirm-before-write and explains house conventions.',
    sources: ['standards.md#7-system-prompt-structure--quality', 'HOUSE'],
    judgment: { prompt: 'If it may write, requires confirm-before-write and house conventions, stating the why alongside each rule.' }
  },
  {
    code: 'PROMPT-7',
    title: 'Focused prompt',
    description: 'The system prompt stays focused on one role with consistent, useful terminology.',
    sources: ['standards.md#6-system-prompt-size--focus', 'standards.md#7-system-prompt-structure--quality', 'BP'],
    judgment: { prompt: 'Focused on one role, consistent terminology, no token spent on what Claude already knows.' }
  }
] as const

export const PROMPT_1 = PROMPT_ITEMS[0]
export const PROMPT_2 = PROMPT_ITEMS[1]
export const PROMPT_3 = PROMPT_ITEMS[2]
export const PROMPT_4 = PROMPT_ITEMS[3]
export const PROMPT_5 = PROMPT_ITEMS[4]
export const PROMPT_6 = PROMPT_ITEMS[5]
export const PROMPT_7 = PROMPT_ITEMS[6]
export const PROMPT = [PROMPT_1, PROMPT_2, PROMPT_3, PROMPT_4, PROMPT_5, PROMPT_6, PROMPT_7] as const
