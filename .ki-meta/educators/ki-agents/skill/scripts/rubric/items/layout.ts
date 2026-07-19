import type { AuditOutcome, ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { AgentsRubricContext } from '../contexts/agents.ts'
import { forAgents, outcomes } from './common.ts'

const LAYOUT_ITEMS = [
  {
    code: 'LAY-1',
    title: 'Agent file and frontmatter layout',
    description: 'The agent is a single .md file with a YAML frontmatter block at the top.',
    sources: ['standards.md#2-layout', 'CC'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext): RubricOutcomes<AuditOutcome> => {
          if (context.missingRoots.length > 0)
            return outcomes<AuditOutcome>(
              context.missingRoots.map((root) => ({
                status: 'VIOLATION',
                message: 'A requested audit path does not exist.',
                subject: root
              }))
            )
          return forAgents(
            context,
            (agent) => [
              {
                status: agent.frontmatter.raw === null ? 'VIOLATION' : 'PASS',
                message:
                  agent.frontmatter.raw === null
                    ? 'No YAML frontmatter block (--- ... ---) at the top of the file.'
                    : 'Agent is a Markdown file with top-level YAML frontmatter.',
                subject: agent.file
              }
            ],
            'No agent definitions were found.'
          )
        }
      }
    }
  },
  {
    code: 'LAY-2',
    title: 'Path-independent identity',
    description: 'Grouping subdirectories are for human organisation only; identity is name, not path.',
    sources: ['standards.md#2-layout', 'CC', 'HOUSE'],
    judgment: { prompt: 'Grouping subdirectories are for human organisation only; identity is name, not path.' }
  },
  {
    code: 'LAY-3',
    title: 'Filename and name alignment',
    description: 'The filename stem matches name.',
    sources: ['standards.md#2-layout', 'HOUSE'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => [
              agent.name === undefined
                ? { status: 'NOT_APPLICABLE', message: 'No name field is available for filename alignment.', subject: agent.file }
                : {
                    status: agent.name === agent.stem ? 'PASS' : 'VIOLATION',
                    message:
                      agent.name === agent.stem
                        ? 'Filename stem matches name.'
                        : `name "${agent.name}" does not match the filename stem "${agent.stem}" — rename one so they agree.`,
                    subject: agent.file
                  }
            ],
            'No agent definitions require filename alignment.'
          )
      },
      conform: {
        phase: 'NORMALISE',
        run: (context: AgentsRubricContext): RubricOutcomes<ConformOutcome> => {
          if (context.agents.length === 0)
            return [{ status: 'NOT_APPLICABLE', message: 'No agent definitions require filename alignment.' }]
          return outcomes(context.agents.flatMap(context.alignName))
        }
      }
    }
  }
] as const

export const LAY_1 = LAYOUT_ITEMS[0]
export const LAY_2 = LAYOUT_ITEMS[1]
export const LAY_3 = LAYOUT_ITEMS[2]
export const LAYOUT = [LAY_1, LAY_2, LAY_3] as const
