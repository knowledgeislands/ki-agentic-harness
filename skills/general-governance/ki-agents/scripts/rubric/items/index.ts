import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { AuditOutcome, ConformOutcome, RubricDefinition, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { type AgentDefinition, type AgentsRubricContext, relativeLinkTargets, stripCode, triggerPhrases } from '../contexts/agents.ts'

const NAME_MAX = 64
const DESCRIPTION_MAX = 1024
const RESERVED_NAMES = ['anthropic', 'claude'] as const
const MODEL_ALIASES = ['sonnet', 'opus', 'haiku', 'fable'] as const

const outcomes = <Result>(values: Result[]): RubricOutcomes<Result> => {
  if (values.length === 0) throw new Error('rubric execution must return at least one outcome')
  return values as unknown as RubricOutcomes<Result>
}

const result = (status: AuditOutcome['status'], message: string, subject?: string): RubricOutcomes<AuditOutcome> => [
  { status, message, ...(subject ? { subject } : {}) }
]

const forAgents = (
  context: AgentsRubricContext,
  inspect: (agent: AgentDefinition) => readonly AuditOutcome[],
  emptyMessage: string
): RubricOutcomes<AuditOutcome> => {
  if (context.agents.length === 0) return result('NOT_APPLICABLE', emptyMessage)
  return outcomes<AuditOutcome>(context.agents.flatMap(inspect))
}

const LAYOUT = [
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

const NAME = [
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

const DESCRIPTION = [
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

const FRONTMATTER = [
  {
    code: 'FM-1',
    title: 'Least-privilege tools',
    description: 'tools and disallowedTools are least-privilege for the role.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'standards.md#8-tools--model', 'CC', 'BP'],
    judgment: {
      prompt:
        '`tools` / `disallowedTools`, if set, is least-privilege — only what the role needs (omitting inherits all, the wrong default for a narrow role). An advisory agent carries no write/exec tools.'
    }
  },
  {
    code: 'FM-2',
    title: 'Deliberate model choice',
    description: 'model is inherited by default or deliberately pinned to a portable Claude alias with a stated reason.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'standards.md#8-tools--model', 'CC', 'BP'],
    judgment: {
      prompt:
        '`model` is deliberate: `inherit` by default, a pin (a Claude alias `sonnet` / `opus` / `haiku` / `fable`, not a rot-prone full id) only with a stated reason. The reason should trace to the portable model type the role needs (`fast` / `standard` / `reasoning` / `frontier` — `ki-tokenomics`, ADR-KI-HARNESS-009), of which the alias is this runtime’s resolution.'
    }
  },
  {
    code: 'FM-3',
    title: 'Current frontmatter fields',
    description: 'Every frontmatter field belongs to the current subagents specification.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        'Every frontmatter field is in the current subagents spec set — `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`. A field outside this set is flagged as a portability risk.'
    }
  },
  {
    code: 'FM-4',
    title: 'Deliberate permission mode',
    description: 'permissionMode is deliberate and bypassPermissions carries a stated reason.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt: '`permissionMode`, if set, is deliberate, and `bypassPermissions` (which skips permission prompts) carries a stated reason.'
    }
  },
  {
    code: 'FM-5',
    title: 'Deliberate skill preload',
    description: 'skills preloads only standards the role must always have before acting.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`skills`, if set, preloads a named skill’s full content at startup — use only when the role must always have that standard before acting and runtime discovery would be fragile. For optional or situational context, prefer grounding-at-runtime.'
    }
  },
  {
    code: 'FM-6',
    title: 'Deliberate memory',
    description: 'memory is set only when the role genuinely needs cross-session accumulation.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`memory`, if set (`user` / `project` / `local`), enables cross-session accumulation — set only when the role genuinely needs state across sessions; the system prompt should describe what to learn and how to apply it.'
    }
  },
  {
    code: 'FM-7',
    title: 'Scoped hooks',
    description: 'hooks enforce invariants local to the subagent; workspace rules remain project-level.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC', 'COM2'],
    judgment: {
      prompt:
        '`hooks`, if set, are scoped to this subagent — use for invariants local to this role. Prefer project-level `settings.json` hooks for workspace-wide rules; state the invariant each scoped hook enforces.'
    }
  },
  {
    code: 'FM-8',
    title: 'Deliberate reasoning effort',
    description: 'effort is pinned only when the role benefits from a deliberate reasoning level.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`effort`, if set, pins reasoning effort for this agent — `low` for mechanical/high-volume roles; `high`+ for deep-analysis roles where extra reasoning is load-bearing. Prefer inheriting when the session effort is appropriate.'
    }
  },
  {
    code: 'FM-9',
    title: 'Deliberate worktree isolation',
    description: 'isolation: worktree is used only for file-editing roles whose changes could conflict.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`isolation: worktree`, if set, runs the agent in a fresh git worktree — use only when the role makes file edits that could conflict with the caller’s working tree; do not use it for read-only or advisory roles.'
    }
  },
  {
    code: 'FM-10',
    title: 'Deliberate background execution',
    description: 'background: true is used only when the caller need not wait for the result.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'CC'],
    judgment: {
      prompt:
        '`background: true`, if set, always runs the agent as a non-blocking background task — use when the caller does not need to wait for the result; otherwise omit it.'
    }
  },
  {
    code: 'FM-11',
    title: 'Tier-agnostic model',
    description: 'model is omitted, inherit, or a portable Claude alias rather than a full model ID.',
    sources: ['standards.md#5-frontmatter-optional-fields', 'BP', 'HOUSE'],
    mechanical: {
      level: 'FAIL',
      overrideLevels: ['WARN'],
      audit: {
        phase: 'INSPECT',
        run: (context: AgentsRubricContext) =>
          forAgents(
            context,
            (agent) => {
              const model = agent.frontmatter.keys.get('model')
              if (model === undefined || model === '' || model === 'inherit')
                return [{ status: 'PASS', message: 'model is tier-agnostic.', subject: agent.file }]
              if (MODEL_ALIASES.includes(model as (typeof MODEL_ALIASES)[number]))
                return [
                  {
                    status: 'VIOLATION',
                    level: 'WARN',
                    message: `model: ${model} pins a Claude alias — acceptable only with a stated reason (FM-2); prefer inherit for model-agnosticism.`,
                    subject: agent.file
                  }
                ]
              return [
                {
                  status: 'VIOLATION',
                  message: `model: ${model} is a rot-prone full model id — prefer an alias (${MODEL_ALIASES.join('/')}) or inherit.`,
                  subject: agent.file
                }
              ]
            },
            'No agent definitions require model checks.'
          )
      }
    }
  }
] as const

const PROMPT = [
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

const LANE = [
  {
    code: 'LANE-1',
    title: 'Distinct lane',
    description: 'The agent owns a distinct lane whose boundary prevents sibling overlap.',
    sources: ['standards.md#9-lane--delegation', 'HOUSE'],
    judgment: { prompt: 'The agent owns a distinct lane; its boundary keeps it from overlapping siblings.' }
  },
  {
    code: 'LANE-2',
    title: 'Reciprocal hand-offs',
    description: 'Adjacent sibling agents name each other as hand-offs.',
    sources: ['standards.md#9-lane--delegation', 'HOUSE'],
    judgment: { prompt: 'Where a sibling is genuinely adjacent, each names the other as the hand-off — reciprocal, not one-directional.' }
  },
  {
    code: 'LANE-3',
    title: 'Bounded coordinator tools',
    description: 'A coordinator restricts the agent types it may spawn and declares what it orchestrates.',
    sources: ['standards.md#9-lane--delegation', 'CC'],
    judgment: {
      prompt:
        'A coordinator agent — one that spawns subagents — restricts which agents it may spawn via `Agent(type)` in `tools` (e.g. `tools: Agent(worker, researcher)`). Its own-vs-defer boundary declares which agents it orchestrates and why; an unrestricted coordinator is a blast-radius risk.'
    }
  },
  {
    code: 'LANE-4',
    title: 'Bounded nesting depth',
    description: 'Subagent nesting is at most five levels and coordinators declare their spawn depth.',
    sources: ['standards.md#9-lane--delegation', 'CC'],
    judgment: {
      prompt:
        'Subagents may nest to a depth of at most five. A coordinator’s system prompt declares its spawn depth so callers can reason about total depth. Avoid nesting unless hierarchical decomposition genuinely helps; flat fan-out is simpler and easier to audit.'
    }
  },
  {
    code: 'LANE-5',
    title: 'Coordinator progress visibility',
    description: 'A coordinator owns caller-visible progress for long-running and background work.',
    sources: ['standards.md#9-lane--delegation', 'HOUSE'],
    judgment: {
      prompt:
        'A coordinator’s system prompt owns progress visibility for long-running/background work: it announces the next checkpoint, reports phase completion and material blockers, and uses the caller’s cadence or five-minute default. Workers report to the coordinator; the coordinator updates the caller.'
    }
  }
] as const

const LINK = [
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

const PROCESS = [
  {
    code: 'PROC-1',
    title: 'Representative in-lane evaluation',
    description: 'The agent is exercised on representative in-lane tasks.',
    sources: ['standards.md#11-process--evaluation', 'BP', 'COM1'],
    judgment: { prompt: 'Exercised on representative in-lane tasks — does it stay in lane, ground itself, and defer correctly?' }
  },
  {
    code: 'PROC-2',
    title: 'Cross-model evaluation',
    description: 'The agent is tested across the models it will run under.',
    sources: ['standards.md#11-process--evaluation', 'BP'],
    judgment: { prompt: 'Tested across the models it will run under.' }
  }
] as const

const LONGEVITY = [
  {
    code: 'LONG-1',
    title: 'Volatile fact handling',
    description: 'Volatile facts are resolved at runtime or covered by a refresh path.',
    sources: ['standards.md#12-longevity', 'BP', 'HOUSE'],
    judgment: {
      prompt:
        'Volatile facts (model IDs, tool names, note paths, dated specifics) are resolved at runtime (read the live KB, prefer `model: inherit`) or covered by a refresh path — prefer grounding-at-runtime over baked-in facts.'
    }
  }
] as const

const COLLISION = [
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

export const KI_AGENTS_RUBRIC: RubricDefinition<AgentsRubricContext> = {
  name: 'ki-agents',
  concern: 'Claude Code subagent definitions',
  families: [
    {
      code: 'LAY',
      title: 'File and frontmatter layout',
      description: 'Agent definition layout and filename identity.',
      standard: 'standards.md#2-layout',
      selectContext: (context) => context,
      items: LAYOUT
    },
    {
      code: 'NAME',
      title: 'Frontmatter name',
      description: 'Agent name syntax, uniqueness, and role quality.',
      standard: 'standards.md#3-frontmatter-name',
      selectContext: (context) => context,
      items: NAME
    },
    {
      code: 'DESC',
      title: 'Frontmatter description',
      description: 'The agent delegation signal.',
      standard: 'standards.md#4-frontmatter-description',
      selectContext: (context) => context,
      items: DESCRIPTION
    },
    {
      code: 'FM',
      title: 'Frontmatter tools and model',
      description: 'Optional frontmatter and runtime choices.',
      standard: 'standards.md#5-frontmatter-optional-fields',
      selectContext: (context) => context,
      items: FRONTMATTER
    },
    {
      code: 'PROMPT',
      title: 'System-prompt quality',
      description: 'System-prompt presence, structure, and focus.',
      standard: 'standards.md#6-system-prompt-size--focus',
      selectContext: (context) => context,
      items: PROMPT
    },
    {
      code: 'LANE',
      title: 'Lane and delegation',
      description: 'Agent ownership, boundaries, and orchestration.',
      standard: 'standards.md#9-lane--delegation',
      selectContext: (context) => context,
      items: LANE
    },
    {
      code: 'LINK',
      title: 'Linking',
      description: 'Resolvable files and name-based composition.',
      standard: 'standards.md#10-linking',
      selectContext: (context) => context,
      items: LINK
    },
    {
      code: 'PROC',
      title: 'Process and evaluation',
      description: 'Representative and cross-model evaluation.',
      standard: 'standards.md#11-process--evaluation',
      selectContext: (context) => context,
      items: PROCESS
    },
    {
      code: 'LONG',
      title: 'Longevity',
      description: 'Runtime grounding and refresh discipline.',
      standard: 'standards.md#12-longevity',
      selectContext: (context) => context,
      items: LONGEVITY
    },
    {
      code: 'COLL',
      title: 'Cross-agent collision',
      description: 'Trigger collisions and reciprocal off-ramps.',
      standard: 'standards.md#13-cross-agent-collision',
      selectContext: (context) => context,
      items: COLLISION
    }
  ]
}

export const KI_AGENTS_FAMILY_CODES = KI_AGENTS_RUBRIC.families.map((family) => family.code)
